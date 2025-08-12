"use client";

import { useEffect, useRef, useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [platePosition, setPlatePosition] = useState(50); // Percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  // Configuration
  const INITIAL_VISIBILITY = 50; // Percentage of plate initially visible
  const SCROLL_SENSITIVITY = 300; // Adjust for scroll speed

  // Get actual screen dimensions instead of relying on vh
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const height = window.innerHeight;
        setContainerHeight(height);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, []);

  // Handle viewport scrolling with pixel-based calculations
  const handleViewportScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const scrollProgress = Math.min(scrollTop / SCROLL_SENSITIVITY, 1);

    // Calculate position as percentage (more reliable than vh)
    const initialHidden = 100 - INITIAL_VISIBILITY; // How much is initially hidden
    const newPosition = initialHidden - scrollProgress * initialHidden;

    setPlatePosition(newPosition);
  };

  // Calculate transform based on actual container height
  const getTransform = () => {
    if (!containerHeight) return "translateY(0)";
    const translatePx = (platePosition / 100) * containerHeight;
    return `translateY(${translatePx}px)`;
  };

  return (
    <div
      className="relative w-full"
      style={{ height: containerHeight || "100vh" }}
    >
      {/* Scrollable container with proper mobile handling */}
      <div
        ref={containerRef}
        className="relative w-full overflow-y-auto overflow-x-hidden"
        style={{
          height: containerHeight || "100vh",
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        }}
        onScroll={handleViewportScroll}
      >
        {/* Background Image */}
        {/* <div
          className="relative w-full bg-cover bg-center bg-no-repeat"
          style={{
            height: containerHeight || "100vh",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Mountain landscape"
            className="h-full w-full object-cover opacity-0"
            onLoad={() => {}}
          />
        </div> */}

        {/* Scrolling Plate with pixel-based positioning */}
        <div
          ref={plateRef}
          className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-white shadow-2xl transition-transform duration-75 ease-out will-change-transform"
          style={{
            height: containerHeight || "100vh",
            transform: getTransform(),
          }}
        >
          {/* Plate Content with proper mobile spacing */}
          <div className="flex h-full flex-col">
            {/* Handle/Indicator */}
            <div className="flex flex-shrink-0 justify-center pb-2 pt-3">
              <div className="h-1 w-12 rounded-full bg-gray-300"></div>
            </div>

            {/* Scrollable Content Area */}
          </div>
        </div>
      </div>
    </div>
  );
}
