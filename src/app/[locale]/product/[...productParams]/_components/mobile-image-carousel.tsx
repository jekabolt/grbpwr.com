"use client";

import { useEffect, useRef, useState } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";

export function MobileImageCarousel({ media }: { media: common_MediaFull[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const imageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
      skipSnaps: true,
      align: "center",
      axis: "x",
      startIndex: 0,
    },
    [WheelGesturesPlugin()],
  );

  useEffect(() => {
    if (emblaApi) {
      const updateSelectedIndex = () => {
        const currentIndex = emblaApi.selectedScrollSnap();
        setSelectedIndex(currentIndex);
      };

      emblaApi.on("select", updateSelectedIndex);
      updateSelectedIndex(); // Set initial index

      return () => {
        emblaApi.off("select", updateSelectedIndex);
      };
    }
  }, [emblaApi]);

  useEffect(() => {
    if (isOpen && selectedIndex !== null) {
      // Trigger animation when dialog opens
      setShouldAnimate(true);

      // Scroll to the selected image
      const scrollToSelected = () => {
        const selectedElement = imageRefs.current.get(selectedIndex);
        const scrollContainer = dialogContentRef.current;

        if (selectedElement && scrollContainer) {
          // Try scrollIntoView first (more reliable)
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });

          // Fallback: manual scroll calculation if scrollIntoView doesn't work well
          // (Some browsers have issues with scrollIntoView in certain contexts)
          setTimeout(() => {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = selectedElement.getBoundingClientRect();

            // Check if element is already centered
            const elementCenter = elementRect.top + elementRect.height / 2;
            const containerCenter =
              containerRect.top + containerRect.height / 2;
            const offset = Math.abs(elementCenter - containerCenter);

            // If not well centered, use manual scroll
            if (offset > 10) {
              const currentScrollTop = scrollContainer.scrollTop;
              const elementTopRelativeToContainer =
                elementRect.top - containerRect.top + currentScrollTop;
              const containerHeight = scrollContainer.clientHeight;
              const elementHeight = elementRect.height;
              const centerOffset = (containerHeight - elementHeight) / 2;
              const targetScrollTop =
                elementTopRelativeToContainer - centerOffset;

              scrollContainer.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: "smooth",
              });
            }
          }, 50);
        }
      };

      // Wait for dialog to be fully rendered
      const scrollTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToSelected);
        });
      }, 100);

      // Reset animation state after animation completes
      const animationTimer = setTimeout(() => setShouldAnimate(false), 400);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(animationTimer);
      };
    } else {
      setShouldAnimate(false);
    }
  }, [isOpen, selectedIndex]);

  function scrollNext() {
    emblaApi?.scrollNext(true);
  }

  function scrollPrev() {
    emblaApi?.scrollPrev(true);
  }

  return (
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={setIsOpen}>
      <div ref={emblaRef} className="relative overflow-hidden">
        <div className="flex h-full w-full">
          {media.map((m, index) => (
            <div key={`${m.id}-${index}`} className="h-full flex-[0_0_102%]">
              <ImageComponent
                src={m?.media?.fullSize?.mediaUrl!}
                alt="Product image"
                aspectRatio={calculateAspectRatio(
                  m?.media?.fullSize?.width,
                  m?.media?.fullSize?.height,
                )}
                fit="contain"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex text-bgColor mix-blend-exclusion">
          <AnimatedButton
            animationDuration={300}
            animationArea="text-no-underline"
            onClick={scrollPrev}
            className="flex w-20 flex-col items-start justify-end pl-2.5 text-bgColor"
          >
            {"<"}
          </AnimatedButton>
          <DialogPrimitives.Trigger asChild>
            <div className="flex-1" />
          </DialogPrimitives.Trigger>
          <AnimatedButton
            animationArea="text-no-underline"
            animationDuration={300}
            onClick={scrollNext}
            className="z-50 flex w-20 flex-col items-end justify-end pr-2.5 text-bgColor"
          >
            {">"}
          </AnimatedButton>
        </div>
      </div>

      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitives.Content
          className="fixed inset-0 z-50 flex flex-col bg-white pt-12"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="fixed right-4 top-4 z-50">[x]</Button>
          </DialogPrimitives.Close>

          <div ref={dialogContentRef} className="flex-1 overflow-y-auto">
            <DialogPrimitives.Close asChild>
              <div className="relative grid">
                {media.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        if (el) {
                          imageRefs.current.set(index, el);
                        } else {
                          imageRefs.current.delete(index);
                        }
                      }}
                      className="relative w-full"
                    >
                      {/* Threshold overlay effect - blue overlay that fades out, only for selected image */}
                      {isSelected && (
                        <div
                          className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
                          style={{
                            backgroundColor: "var(--highlight)",
                            opacity: shouldAnimate ? 0.6 : 0,
                            transition: "opacity 0.4s ease-out",
                          }}
                        />
                      )}
                      <div
                        className={`relative w-full ${
                          shouldAnimate && isSelected ? "animate-threshold" : ""
                        }`}
                      >
                        <ImageComponent
                          src={item.media?.fullSize?.mediaUrl || ""}
                          alt={
                            item.media?.fullSize?.mediaUrl ||
                            "Product thumbnail"
                          }
                          aspectRatio={calculateAspectRatio(
                            item.media?.fullSize?.width,
                            item.media?.fullSize?.height,
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogPrimitives.Close>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
