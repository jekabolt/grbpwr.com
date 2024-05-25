"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import GlobalImage from "@/components/global/Image";
import { calculateAspectRatio } from "@/lib/utils";
import { useEffect, useState } from "react";

export function FullScreenMediaViewer({
  media,
  startIndex,
  onClose,
}: {
  media: common_MediaFull[];
  startIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length,
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "ArrowLeft") {
      handlePrev();
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="relative h-full w-full">
        <div className="absolute left-0 right-0 top-0 flex justify-end p-4 text-white">
          <button onClick={onClose} aria-label="Close">
            [X]
          </button>
        </div>
        <div className="flex h-full items-center justify-center bg-black">
          <button onClick={handlePrev} className="px-4 text-2xl text-white">
            {"<"}
          </button>
          <div className="flex h-[80vh] w-[80vw] items-center justify-center">
            <GlobalImage
              src={media[currentIndex]?.media?.fullSize?.mediaUrl!}
              alt="Product image"
              aspectRatio={calculateAspectRatio(
                media[currentIndex]?.media?.fullSize?.width,
                media[currentIndex]?.media?.fullSize?.height,
              )}
              fit="contain"
            />
          </div>
          <button onClick={handleNext} className="px-4 text-2xl text-white">
            {">"}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center p-4 text-white">
          <span>
            {currentIndex + 1} / {media.length}
          </span>
        </div>
      </div>
    </div>
  );
}
