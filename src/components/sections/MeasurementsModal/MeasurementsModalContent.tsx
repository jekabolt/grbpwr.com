"use client";

import { useLockBodyScroll } from "@uidotdev/usehooks";

export default function MeasurementsModalContent() {
  useLockBodyScroll();

  return (
    <div className="flex h-full w-full pt-20 text-buttonTextColor">
      <div className="w-1/2 ">Image placeholder</div>
      <div className="w-1/2 ">
        <div className="mb-20 flex h-full flex-col">
          <div className="h-1/3">measurements</div>
          <div className="flex h-1/3 gap-4">
            <div>xs</div>
            <div>s</div>
            <div>...buttons here taken from dictionary</div>
          </div>
          <div className="flex h-1/3 gap-40">
            <div className="flex flex-col gap-4">
              <div>length</div>
              <div>chest</div>
              <div>shoulders</div>
            </div>
            <div className="flex flex-col gap-4">
              <div>74cm</div>
              <div>74cm</div>
              <div>...values taken from dictionary</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
