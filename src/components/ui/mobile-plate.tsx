"use client";

import { useState } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";

const snapPoints = [0.35, 1];

export default function VaulDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  function handleSnapChange(snap: number | string | null) {
    if (snap === snapPoints[0]) {
      setSnap(snapPoints[1]);
    } else {
      setSnap(snapPoints[0]);
    }
  }

  const isFullyExpanded = snap === snapPoints[1];

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={!isFullyExpanded} // Only dismissible when not fully expanded
      defaultOpen
    >
      <Drawer.Title />
      {/* Only show overlay when fully expanded */}
      {isFullyExpanded && (
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      )}
      <Drawer.Portal>
        <Drawer.Content
          data-testid="content"
          className="border-b-none fixed inset-x-2.5 bottom-0 top-12 flex h-full max-h-screen flex-col border border-textInactiveColor bg-bgColor lg:hidden"
        >
          <div
            onClick={() => handleSnapChange(snap)}
            className="absolute left-0 right-0 top-0 h-16 flex-shrink-0 cursor-grab p-4 active:cursor-grabbing"
          />

          <div
            className={cn("space-y-12 px-2.5 pb-32 pt-2.5", {
              "flex-1 overflow-y-auto": snap === snapPoints[1],
            })}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
