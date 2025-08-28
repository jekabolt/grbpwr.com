"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

export interface BottomSheetProps {
  children: ReactNode;
  initialHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
  containerClassName?: string;
  movementThreshold?: number;
  sensitivity?: number;
}

export function BottomSheet({
  children,
  initialHeight = 150,
  minHeight = 150,
  maxHeight = 800,
  className = "",
  containerClassName = "",
  movementThreshold = 5,
  sensitivity = 1.3,
}: BottomSheetProps) {
  // Container state for bottom sheet
  const containerRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(initialHeight);
  const [lastTouchY, setLastTouchY] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // Use useEffect to add non-passive event listeners
  useEffect(() => {
    const mainArea = mainAreaRef.current;
    if (!mainArea) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchStartY(touch.clientY);
      setLastTouchY(touch.clientY);
      setIsDragging(false); // Don't set to true immediately
      setHasMoved(false);

      // Don't prevent default yet - let the event bubble normally for now
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentTouchY = touch.clientY;
      const totalMovement = Math.abs(currentTouchY - touchStartY);

      // If user has moved beyond threshold, start treating it as a drag
      if (totalMovement > movementThreshold && !hasMoved) {
        setHasMoved(true);
        setIsDragging(true);
        // Now prevent default to stop any click events from firing
        e.preventDefault();
      }

      // If we're in drag mode, handle the drag
      if (hasMoved && isDragging) {
        e.preventDefault();

        const deltaY = lastTouchY - currentTouchY; // Positive when swiping up

        // Calculate new height with configurable sensitivity
        let newHeight = containerHeight + deltaY * sensitivity;

        // Smooth resistance when approaching boundaries (no hard stops)
        if (newHeight < minHeight) {
          const overshoot = minHeight - newHeight;
          newHeight = minHeight - Math.pow(overshoot, 0.7) * 0.3;
        } else if (newHeight > maxHeight) {
          const overshoot = newHeight - maxHeight;
          newHeight = maxHeight + Math.pow(overshoot, 0.7) * 0.3;
        }

        setContainerHeight(newHeight);
        setLastTouchY(currentTouchY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // If user didn't move much, let the click/tap event fire normally
      if (!hasMoved) {
        setIsDragging(false);
        return; // Don't prevent default - allow normal click behavior
      }

      // If it was a drag, prevent default and finish the drag
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);

        if (containerHeight < minHeight) {
          setContainerHeight(minHeight);
        } else if (containerHeight > maxHeight) {
          setContainerHeight(maxHeight);
        }
      }

      // Reset state
      setHasMoved(false);
    };

    // Add non-passive event listeners
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
  }, [
    isDragging,
    containerHeight,
    lastTouchY,
    touchStartY,
    hasMoved,
    minHeight,
    maxHeight,
    movementThreshold,
    sensitivity,
  ]);

  return (
    <div ref={mainAreaRef} className={containerClassName}>
      <motion.div
        ref={containerRef}
        className={`border-b-none absolute inset-x-2.5 bottom-0 z-30 flex flex-col border border-textInactiveColor bg-bgColor ${className}`}
        style={{
          height: containerHeight,
          overflow: "hidden",
        }}
        animate={{ height: containerHeight }}
        transition={{
          type: "spring",
          stiffness: 900,
          damping: 35,
          mass: 0.15,
          velocity: 15,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Hook to provide sheet control from parent components
export function useBottomSheet(initialHeight = 150) {
  const [height, setHeight] = useState(initialHeight);

  const expand = (targetHeight: number) => setHeight(targetHeight);
  const collapse = () => setHeight(initialHeight);

  return {
    height,
    setHeight,
    expand,
    collapse,
  };
}
