import { useEffect, useRef, useState } from "react";

export interface UseBottomSheetConfig {
    movementThreshold?: number;
    sensitivity?: number;
    /** Minimum height in pixels, or as percentage (0-1) of available height */
    minHeight?: number;
    topOffset?: number;
}

export interface UseBottomSheetProps {
    mainAreaRef: React.RefObject<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    isCarouselScrolling?: boolean;
    config?: UseBottomSheetConfig;
}

export interface TouchState {
    startY: number;
    startX: number;
    lastY: number;
    isDragging: boolean;
    hasMoved: boolean;
    isVertical: boolean;
    startedAtTop: boolean;
}

export function useBottomSheet({
    mainAreaRef,
    containerRef,
    isCarouselScrolling = false,
    config: userConfig = {},
}: UseBottomSheetProps) {
    const config = {
        movementThreshold: 0.1,
        sensitivity: 3,
        minHeight: 150,
        topOffset: 48,
        ...userConfig,
    };

    const [containerHeight, setContainerHeight] = useState(config.minHeight);
    const [hideArrows, setHideArrows] = useState(false);

    const touchState = useRef<TouchState>({
        startY: 0,
        startX: 0,
        lastY: 0,
        isDragging: false,
        hasMoved: false,
        isVertical: false,
        startedAtTop: false,
    });

    const canScrollInside = () => {
        if (typeof window === "undefined") return false;

        const maxHeight = window.innerHeight - config.topOffset;
        return containerHeight >= maxHeight;
    };

    const getMaxHeight = () => {
        if (typeof window === "undefined") return 0;
        return window.innerHeight - config.topOffset;
    };

    const getMinHeight = () => {
        if (typeof window === "undefined") return 150;
        // If minHeight is between 0 and 1, treat as percentage
        if (config.minHeight > 0 && config.minHeight <= 1) {
            return (window.innerHeight - config.topOffset) * config.minHeight;
        }
        return config.minHeight;
    };

    const isAtMinHeight = () => containerHeight <= getMinHeight() + 10;


    useEffect(() => {
        if (typeof window === "undefined") return;

        if (config.minHeight > 0 && config.minHeight <= 1) {
            const actualHeight = (window.innerHeight - config.topOffset) * config.minHeight;
            const ssrHeight = (800 - config.topOffset) * config.minHeight;

            if (Math.abs(actualHeight - ssrHeight) > 20) {
                setContainerHeight(actualHeight);
            }
        }
    }, []);


    useEffect(() => {
        if (typeof window === "undefined") return;

        const isDragging = touchState.current.isDragging;
        const atMinHeight = isAtMinHeight();

        setHideArrows(!atMinHeight || isDragging || isCarouselScrolling);
    }, [containerHeight, config.minHeight, isCarouselScrolling]);

    const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        const state = touchState.current;

        state.startY = touch.clientY;
        state.startX = touch.clientX;
        state.lastY = touch.clientY;
        state.isDragging = false;
        state.hasMoved = false;
        state.isVertical = false;

        if (containerRef.current && canScrollInside()) {
            const scrollableElement = containerRef.current.querySelector(
                '[class*="overflow-y-scroll"]',
            );
            if (scrollableElement) {
                state.startedAtTop = scrollableElement.scrollTop <= 5;
            }
        } else {
            state.startedAtTop = false;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const state = touchState.current;
        const currentY = touch.clientY;
        const currentX = touch.clientX;

        const deltaY = Math.abs(currentY - state.startY);
        const deltaX = Math.abs(currentX - state.startX);
        const totalMovement = Math.max(deltaY, deltaX);

        // Determine if user has moved enough to start gesture recognition
        if (totalMovement > config.movementThreshold && !state.hasMoved) {
            state.hasMoved = true;
            state.isVertical = deltaY > deltaX;

            if (state.isVertical) {
                if (!canScrollInside()) {
                    state.isDragging = true;
                    e.preventDefault();
                } else {
                    const isSwipeDown = currentY > state.startY;
                    if (isSwipeDown && state.startedAtTop) {
                        state.isDragging = true;
                        e.preventDefault();
                    }
                }

                if (state.isDragging) {
                    setHideArrows(true);
                }
            }
        }

        // Handle dragging gesture
        if (state.hasMoved && state.isDragging && state.isVertical) {
            const isCollapsingFromExpanded =
                canScrollInside() && currentY > state.startY && state.startedAtTop;
            if (!canScrollInside() || isCollapsingFromExpanded) {
                e.preventDefault();
            }

            const deltaMove = state.lastY - currentY;
            const maxHeight = getMaxHeight();
            let newHeight = containerHeight + deltaMove * config.sensitivity;

            // Apply resistance when going beyond bounds
            const minHeight = getMinHeight();
            if (newHeight < minHeight) {
                const overshoot = minHeight - newHeight;
                newHeight = minHeight - Math.pow(overshoot, 0.7) * 0.3;
            } else if (newHeight > maxHeight) {
                const overshoot = newHeight - maxHeight;
                newHeight = maxHeight + Math.pow(overshoot, 0.7) * 0.3;
            }

            setContainerHeight(newHeight);
            state.lastY = currentY;
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        const state = touchState.current;

        if (!state.hasMoved) return;

        if (state.isDragging && state.isVertical) {
            const wasCollapsingFromExpanded =
                canScrollInside() && state.lastY > state.startY && state.startedAtTop;
            if (!canScrollInside() || wasCollapsingFromExpanded) {
                e.preventDefault();
            }

            const maxHeight = getMaxHeight();
            const minHeight = getMinHeight();

            // Snap to bounds
            if (containerHeight < minHeight) {
                setContainerHeight(minHeight);
            } else if (containerHeight > maxHeight) {
                setContainerHeight(maxHeight);
            }
        }

        // Reset touch state
        state.hasMoved = false;
        state.isVertical = false;
        state.isDragging = false;

        // Update arrow visibility
        setHideArrows(!isAtMinHeight() || isCarouselScrolling);
    };

    // Set up touch event listeners
    useEffect(() => {
        const mainArea = mainAreaRef.current;
        if (!mainArea) return;

        mainArea.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        mainArea.addEventListener("touchmove", handleTouchMove, { passive: false });
        mainArea.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            mainArea.removeEventListener("touchstart", handleTouchStart);
            mainArea.removeEventListener("touchmove", handleTouchMove);
            mainArea.removeEventListener("touchend", handleTouchEnd);
        };
    }, [containerHeight]);

    return {
        containerHeight,
        hideArrows,
        canScrollInside: canScrollInside(),
        isAtMinHeight: isAtMinHeight(),
        touchState: touchState.current,
    };
}
