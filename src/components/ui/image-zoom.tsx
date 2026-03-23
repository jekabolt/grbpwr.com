"use client";

import { useCallback, useRef } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

const SWIPE_CLOSE_THRESHOLD = 80;

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
  // stretch so the relative h-full child gets a real height (alignItems:start left it at 0 in some flex chains)
  alignItems: "stretch",
  justifyContent: "center",
  paddingTop: "48px",
} as const;

export function ImageZoom({
  children,
  onDoubleClick,
  onClose,
  onPinchZoom,
}: {
  children: React.ReactNode;
  onDoubleClick?: () => void;
  onClose?: () => void;
  onPinchZoom?: () => void;
}) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const panStart = useRef<{ x: number; y: number } | null>(null);
  const lastScale = useRef<number>(1);

  const handlePinchingStop = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      if (onPinchZoom && ref.state.scale > 1 && lastScale.current <= 1) {
        onPinchZoom();
      }
      lastScale.current = ref.state.scale;
      
      if (onClose && ref.state.scale < 1) {
        onClose();
      }
    },
    [onClose, onPinchZoom],
  );

  const handlePanningStart = useCallback(
    (_ref: ReactZoomPanPinchRef, e: TouchEvent | MouseEvent) => {
      if (!onClose) return;
      const x =
        "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const y =
        "touches" in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
      if (x != null && y != null) panStart.current = { x, y };
    },
    [onClose],
  );

  const handlePanningStop = useCallback(
    (ref: ReactZoomPanPinchRef, e: TouchEvent | MouseEvent) => {
      const start = panStart.current;
      panStart.current = null;
      if (!onClose || start === null) return;

      const endX =
        "changedTouches" in e
          ? (e as TouchEvent).changedTouches[0]?.clientX
          : (e as MouseEvent).clientX;
      const endY =
        "changedTouches" in e
          ? (e as TouchEvent).changedTouches[0]?.clientY
          : (e as MouseEvent).clientY;
      if (endX == null || endY == null) return;

      const deltaX = Math.abs(endX - start.x);
      const deltaY = Math.abs(endY - start.y);
      const scale = ref.state.scale;
      const swipeDistance = Math.max(deltaX, deltaY);
      if (scale <= 1 && swipeDistance > SWIPE_CLOSE_THRESHOLD) {
        onClose();
      }
    },
    [onClose],
  );

  const transformConfig = {
    ...TRANSFORM_CONFIG_BASE,
    minScale: onClose ? 0.5 : 1,
    onPinchingStop: (onClose || onPinchZoom) ? handlePinchingStop : undefined,
    onPanningStart: onClose ? handlePanningStart : undefined,
    onPanningStop: onClose ? handlePanningStop : undefined,
  };

  return (
    <TransformWrapper ref={transformRef} {...transformConfig}>
      <TransformComponent
        wrapperStyle={TRANSFORM_WRAPPER_STYLE}
        contentStyle={TRANSFORM_CONTENT_STYLE}
      >
        <div
          onDoubleClick={onDoubleClick}
          className="relative h-full min-h-0 w-full min-w-0"
        >
          {children}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
