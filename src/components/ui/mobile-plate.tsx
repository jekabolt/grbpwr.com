"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";

const snapPoints = ["340px", 1];

export default function VaulDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  // Lock background scroll while sheet is mounted (prevents body pan/scroll)
  useEffect(() => {
    const { scrollY } = window;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      touchAction: (document.body.style as any).touchAction,
      overscrollBehavior: (document.body.style as any).overscrollBehavior,
    } as const;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    (document.body.style as any).touchAction = "none"; // disable touch panning on body
    (document.body.style as any).overscrollBehavior = "none"; // prevent scroll chaining

    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      (document.body.style as any).touchAction = prev.touchAction;
      (document.body.style as any).overscrollBehavior = prev.overscrollBehavior;
      // restore scroll position
      const top = parseInt(prev.top || "0", 10);
      window.scrollTo(0, scrollY);
    };
  }, []);

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
          className="border-b-none fixed inset-x-2.5 bottom-0 flex h-full max-h-[94.5%] flex-col border border-textInactiveColor bg-bgColor"
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
