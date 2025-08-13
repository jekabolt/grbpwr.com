"use client";

import { useState } from "react";
import { Drawer } from "vaul";

const snapPoints = ["340px", 1];

export default function VaulDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      dismissible={false}
      defaultOpen
    >
      <Drawer.Title />
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Portal>
        <Drawer.Content
          data-testid="content"
          className="border-b-none fixed inset-x-2.5 bottom-0 z-50 flex h-full max-h-[94.5%] flex-col border border-textInactiveColor bg-bgColor"
        >
          {/* Dedicated drag handle - won't interfere with scroll */}
          <div className="absolute left-0 right-0 top-0 h-32 flex-shrink-0 cursor-grab p-4 active:cursor-grabbing" />

          <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pt-2.5">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
