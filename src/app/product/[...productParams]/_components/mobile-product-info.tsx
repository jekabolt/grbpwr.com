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
        <div
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
            onLoad={() => {
              /* Image loaded */
            }}
          />
        </div>

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
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="mx-auto max-w-md">
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  Mobile-Optimized Plate
                </h1>

                <p className="mb-6 leading-relaxed text-gray-600">
                  This version uses pixel-based calculations and proper mobile
                  viewport handling instead of problematic vh units.
                </p>

                <div className="mb-6 rounded-lg bg-green-50 p-4">
                  <h3 className="mb-2 font-semibold text-green-900">
                    Mobile Improvements
                  </h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p>• Uses window.innerHeight instead of vh units</p>
                    <p>• Handles mobile browser UI changes</p>
                    <p>
                      • Proper touch scrolling with -webkit-overflow-scrolling
                    </p>
                    <p>• Pixel-based transforms for accuracy</p>
                    <p>• Content positioned correctly in available space</p>
                  </div>
                </div>

                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-blue-900">
                    Current Status
                  </h3>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>
                      Screen Height: <strong>{containerHeight}px</strong>
                    </p>
                    <p>
                      Plate Position:{" "}
                      <strong>{platePosition.toFixed(1)}%</strong>
                    </p>
                    <p>
                      Visible Area:{" "}
                      <strong>{(100 - platePosition).toFixed(1)}%</strong>
                    </p>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium text-gray-900">Method</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Pixel-based
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium text-gray-900">Units</h4>
                    <p className="text-lg font-bold text-gray-700">px + %</p>
                  </div>
                </div>

                {/* Content sections to enable scrolling */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Why this works better
                  </h3>

                  {[
                    {
                      title: "Real viewport height",
                      desc: "Uses window.innerHeight which accounts for mobile browser UI",
                    },
                    {
                      title: "Pixel precision",
                      desc: "Transforms use pixels instead of vh for consistent positioning",
                    },
                    {
                      title: "Touch optimization",
                      desc: "WebkitOverflowScrolling for smooth native-like scrolling",
                    },
                    {
                      title: "Dynamic resize handling",
                      desc: "Responds to orientation changes and browser UI changes",
                    },
                    {
                      title: "Proper flexbox layout",
                      desc: "Content area uses flex-1 to fill available space correctly",
                    },
                    {
                      title: "Performance optimized",
                      desc: "Uses will-change-transform and shorter transition duration",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <h4 className="mb-2 font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <h4 className="mb-2 font-medium text-yellow-900">
                    Configuration
                  </h4>
                  <div className="space-y-1 text-sm text-yellow-800">
                    <p>
                      • Change <code>INITIAL_VISIBILITY</code> to adjust
                      starting position
                    </p>
                    <p>
                      • Modify <code>SCROLL_SENSITIVITY</code> to control scroll
                      speed
                    </p>
                    <p>• All calculations automatically adapt to screen size</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
