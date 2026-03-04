"use client";

import { useCallback, useRef } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

const SWIPE_DOWN_THRESHOLD = 80;

const TRANSFORM_CONFIG_BASE = {
  initialScale: 1,
  maxScale: 4,
  limitToBounds: true,
  wheel: { step: 0.1 },
  pinch: { step: 10 },
  doubleClick: {
    disabled: false,
    step: 2,
    mode: "toggle" as const,
  },
} as const;

const TRANSFORM_WRAPPER_STYLE = {
  width: "100%",
  height: "100%",
} as const;

const TRANSFORM_CONTENT_STYLE = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
} as const;

export function ImageZoom({
  children,
  onDoubleClick,
  onClose,
}: {
  children: React.ReactNode;
  onDoubleClick?: () => void;
  onClose?: () => void;
}) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const touchStartY = useRef<number | null>(null);
  const wasSingleTouch = useRef(true);

  const handlePinchingStop = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      if (onClose && ref.state.scale < 1) {
        onClose();
      }
    },
    [onClose]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!onClose || e.touches.length !== 1) return;
      touchStartY.current = e.touches[0].clientY;
      wasSingleTouch.current = true;
    },
    [onClose]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current !== null && e.touches.length > 1) {
      wasSingleTouch.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (
        !onClose ||
        touchStartY.current === null ||
        e.touches.length !== 0 ||
        !wasSingleTouch.current
      ) {
        touchStartY.current = null;
        return;
      }
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - touchStartY.current;
      touchStartY.current = null;

      const scale = transformRef.current?.state.scale ?? 1;
      if (scale <= 1 && deltaY > SWIPE_DOWN_THRESHOLD) {
        onClose();
      }
    },
    [onClose]
  );

  const transformConfig = {
    ...TRANSFORM_CONFIG_BASE,
    minScale: onClose ? 0.5 : 1,
    onPinchingStop: onClose ? handlePinchingStop : undefined,
  };

  return (
    <TransformWrapper ref={transformRef} {...transformConfig}>
      <TransformComponent
        wrapperStyle={TRANSFORM_WRAPPER_STYLE}
        contentStyle={TRANSFORM_CONTENT_STYLE}
      >
        <div
          onDoubleClick={onDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="h-full"
        >
          {children}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
