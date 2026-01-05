import { RefObject, useEffect, useRef, useState } from "react";

export interface UseBottomSheetConfig {
    minHeight?: number;
    topOffset?: number;
}

export interface UseBottomSheetProps {
    mainAreaRef: React.RefObject<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    isCarouselScrolling?: boolean;
    config?: UseBottomSheetConfig;
    contentAboveRef?: React.RefObject<HTMLDivElement>;
}

export interface TouchState {
    startY: number;
    startX: number;
    lastY: number;
    isDragging: boolean;
    hasMoved: boolean;
    isVertical: boolean;
    startedAtTop: boolean;
    velocityY: number;
    lastTimestamp: number;
    velocityHistory: Array<{ velocity: number; timestamp: number }>;
}

export function useBottomSheet({
    mainAreaRef,
    containerRef,
    config: userConfig = {},
}: UseBottomSheetProps) {
    const config = {
        minHeight: 150,
        topOffset: 48,
        ...userConfig,
    };

    const [containerHeight, setContainerHeight] = useState(config.minHeight);

    useEffect(() => {
        setContainerHeight(config.minHeight);
    }, [config.minHeight]);

    const touchState = useRef<TouchState>({
        startY: 0,
        startX: 0,
        lastY: 0,
        isDragging: false,
        hasMoved: false,
        isVertical: false,
        startedAtTop: false,
        velocityY: 0,
        lastTimestamp: 0,
        velocityHistory: [],
    });

    const scrollPositionRef = useRef<number>(0);

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
        if (config.minHeight > 0 && config.minHeight <= 1) {
            return (window.innerHeight - config.topOffset) * config.minHeight;
        }
        return config.minHeight;
    };

    const isAtMinHeight = () => containerHeight <= getMinHeight() + 10;

    const calculateVelocity = (currentY: number, timestamp: number) => {
        const state = touchState.current;
        const timeDelta = timestamp - state.lastTimestamp;

        if (timeDelta === 0) return state.velocityY;

        const velocity = (state.lastY - currentY) / timeDelta;

        state.velocityHistory.push({ velocity, timestamp });

        state.velocityHistory = state.velocityHistory.filter(
            item => timestamp - item.timestamp < 100
        );

        if (state.velocityHistory.length > 0) {
            const avgVelocity = state.velocityHistory.reduce((sum, item) => sum + item.velocity, 0) / state.velocityHistory.length;
            state.velocityY = avgVelocity;
        }

        return state.velocityY;
    };

    const applyMomentum = (currentHeight: number, velocity: number) => {
        const minHeight = getMinHeight();
        const maxHeight = getMaxHeight();
        const momentumDistance = velocity * 200;
        let targetHeight = currentHeight + momentumDistance;

        targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));

        return targetHeight;
    };

    const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        const state = touchState.current;
        const timestamp = Date.now();

        state.startY = touch.clientY;
        state.startX = touch.clientX;
        state.lastY = touch.clientY;
        state.isDragging = false;
        state.hasMoved = false;
        state.isVertical = false;
        state.velocityY = 0;
        state.lastTimestamp = timestamp;
        state.velocityHistory = [];

        if (containerRef.current && canScrollInside()) {
            const scrollableElement = containerRef.current.querySelector(
                '[class*="overflow-y-auto"]',
            ) as HTMLElement | null;
            if (scrollableElement) {
                scrollPositionRef.current = scrollableElement.scrollTop;
                state.startedAtTop = scrollableElement.scrollTop <= 10;
            } else {
                state.startedAtTop = false;
                scrollPositionRef.current = 0;
            }
        } else {
            state.startedAtTop = false;
            scrollPositionRef.current = 0;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const state = touchState.current;
        const currentY = touch.clientY;
        const currentX = touch.clientX;
        const timestamp = Date.now();

        const deltaY = Math.abs(currentY - state.startY);
        const deltaX = Math.abs(currentX - state.startX);
        const totalMovement = Math.max(deltaY, deltaX);

        calculateVelocity(currentY, timestamp);

        if (totalMovement > 5 && !state.hasMoved) {
            state.hasMoved = true;
            state.isVertical = deltaY > deltaX;

            if (state.isVertical) {
                if (!canScrollInside()) {
                    state.isDragging = true;
                    e.preventDefault();
                } else {
                    const scrollableElement = containerRef.current?.querySelector(
                        '[class*="overflow-y-auto"]',
                    ) as HTMLElement | null;
                    const currentScrollTop = scrollableElement?.scrollTop ?? 0;
                    const isSwipeDown = currentY > state.startY;

                    if (scrollableElement) {
                        scrollPositionRef.current = currentScrollTop;
                    }

                    if (isSwipeDown && currentScrollTop <= 10) {
                        state.isDragging = true;
                        e.preventDefault();
                    } else if (isSwipeDown && state.startedAtTop) {
                        state.isDragging = true;
                        e.preventDefault();
                    }
                }
            }
        }

        if (state.hasMoved && state.isDragging && state.isVertical) {
            const isCollapsingFromExpanded =
                canScrollInside() && currentY > state.startY && state.startedAtTop;
            if (!canScrollInside() || isCollapsingFromExpanded) {
                e.preventDefault();
            }

            const deltaMove = state.lastY - currentY;
            const maxHeight = getMaxHeight();
            const minHeight = getMinHeight();
            let newHeight = containerHeight + deltaMove;

            if (newHeight < minHeight) {
                const overshoot = minHeight - newHeight;
                const resistance = Math.min(overshoot / 100, 0.8);
                newHeight = minHeight - overshoot * (1 - resistance);
            } else if (newHeight > maxHeight) {
                const overshoot = newHeight - maxHeight;
                const resistance = Math.min(overshoot / 100, 0.8);
                newHeight = maxHeight + overshoot * (1 - resistance);
            }

            setContainerHeight(newHeight);
            state.lastY = currentY;
            state.lastTimestamp = timestamp;
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

            let targetHeight = containerHeight;
            if (Math.abs(state.velocityY) > 0.1) {
                targetHeight = applyMomentum(containerHeight, state.velocityY);
            }

            targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));

            if (Math.abs(targetHeight - containerHeight) > 5) {
                setContainerHeight(targetHeight);
            }
        }

        state.hasMoved = false;
        state.isVertical = false;
        state.isDragging = false;
        state.velocityY = 0;
        state.velocityHistory = [];
    };

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

    useEffect(() => {
        if (!containerRef.current || touchState.current.isDragging) return;

        const scrollableElement = containerRef.current.querySelector(
            '[class*="overflow-y-auto"]',
        ) as HTMLElement | null;

        if (scrollableElement && canScrollInside()) {
            const savedScroll = scrollPositionRef.current;
            if (savedScroll > 0) {
                requestAnimationFrame(() => {
                    if (touchState.current.isDragging) return;
                    const element = containerRef.current?.querySelector(
                        '[class*="overflow-y-auto"]',
                    ) as HTMLElement | null;
                    if (element && Math.abs(element.scrollTop - savedScroll) > 5) {
                        element.scrollTop = savedScroll;
                    }
                });
            }
        }
    }, [containerHeight]);

    useEffect(() => {
        if (!containerRef.current) return;

        const scrollableElement = containerRef.current.querySelector(
            '[class*="overflow-y-auto"]',
        ) as HTMLElement | null;

        if (!scrollableElement) return;

        const handleScroll = () => {
            if (!touchState.current.isDragging) {
                scrollPositionRef.current = scrollableElement.scrollTop;
            }
        };

        scrollableElement.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            scrollableElement.removeEventListener('scroll', handleScroll);
        };
    }, [containerHeight]);

    return {
        containerHeight,
        canScrollInside: canScrollInside(),
        isAtMinHeight: isAtMinHeight(),
        touchState: touchState.current,
    };
}

export function useElementHeight(ref: RefObject<HTMLElement | null>, offset = 0) {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const measure = () => {
            if (!ref.current) return;
            const availableHeight = window.innerHeight - ref.current.getBoundingClientRect().height - offset;
            setHeight(availableHeight);
        };

        measure();
        const timer = setTimeout(measure, 100);
        window.addEventListener("resize", measure);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", measure);
        };
    }, [ref, offset]);

    return height;
}
