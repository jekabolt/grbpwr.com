"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";

import { MobileImageCarousel } from "./mobile-image-carousel";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  // Configuration for different initial heights
  const INITIAL_POSITION = 57; // Change this value to control initial plate height
  // 0vh = fully visible (covers entire image)
  // 25vh = 75% visible
  // 50vh = 50% visible (current)
  // 75vh = 25% visible
  // 100vh = completely hidden

  // Viewport-based scrolling handler
  const handleViewportScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const maxViewportScroll = 300; // Adjust this for sensitivity
    const viewportTransform = Math.min(scrollTop / maxViewportScroll, 1);

    // Calculate position: starts at INITIAL_POSITION, ends at 0
    const viewportTranslateY =
      INITIAL_POSITION - viewportTransform * INITIAL_POSITION;

    // Update the plate position directly via style
    const plate = e.currentTarget.querySelector(
      ".scrolling-plate",
    ) as HTMLElement;
    if (plate) {
      plate.style.transform = `translateY(${viewportTranslateY}vh)`;
    }
  };

  return (
    <div className="relative">
      {/* Viewport-based Scroll Container */}
      <div
        className="relative h-screen overflow-y-auto"
        onScroll={handleViewportScroll}
      >
        <div className="h-[479px] w-full">
          <MobileImageCarousel media={product.media || []} />
        </div>

        {/* Scrolling Plate with configurable initial positioning */}
        <div
          className="scrolling-plate absolute inset-x-0 bottom-0 z-10 border border-red-500 bg-white transition-transform duration-100 ease-out"
          style={{
            height: "100vh",
            transform: `translateY(${INITIAL_POSITION}vh)`, // Uses the configurable value
          }}
        >
          <div className="h-full overflow-y-auto p-6">
            {/* Handle/Indicator */}
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-300"></div>

            <div className="mx-auto max-w-md">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Beautiful Mountain View
              </h1>

              <p className="mb-6 leading-relaxed text-gray-600">
                Experience the breathtaking beauty of mountain landscapes as you
                scroll through this interactive overlay effect.
              </p>

              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">
                  Viewport Scroll
                </h3>
                <p className="text-sm text-blue-700">
                  Scroll within this area to see the plate cover the image. No
                  additional page content needed!
                </p>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">Elevation</h4>
                  <p className="text-2xl font-bold text-gray-700">2,847m</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">
                    Temperature
                  </h4>
                  <p className="text-2xl font-bold text-gray-700">-2°C</p>
                </div>
              </div>

              {/* Content to enable scrolling within viewport */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  How it works
                </h3>
                <p className="leading-relaxed text-gray-600">
                  This version uses a scrollable container thats exactly
                  viewport height. The scroll happens within this container, not
                  the entire page.
                </p>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Features
                  </h3>

                  {[
                    "Self-contained viewport scrolling",
                    "No additional page content needed",
                    "Mobile-optimized touch scrolling",
                    "Smooth transition effects",
                    "Dynamic content overlay",
                    "Customizable scroll sensitivity",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Section {i + 1}
                    </h4>
                    <p className="text-sm text-gray-600">
                      This content enables scrolling within the viewport
                      container, making the plate effect work without needing
                      page-level content below.
                    </p>
                  </div>
                ))}

                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> You can adjust the `maxViewportScroll`
                    value in the code to control scroll sensitivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
