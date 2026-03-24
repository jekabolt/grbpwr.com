"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import { Overlay } from "@/components/ui/overlay";

const SWIPE_CLOSE_THRESHOLD = 80;
const PULSE_DURATION_MS = 400;

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
  const [pulseActive, setPulseActive] = useState(false);
  const pulseEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pulseEndTimeoutRef.current) {
        clearTimeout(pulseEndTimeoutRef.current);
        pulseEndTimeoutRef.current = null;
      }
    };
  }, []);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick?.();
    if (pulseEndTimeoutRef.current) {
      clearTimeout(pulseEndTimeoutRef.current);
      pulseEndTimeoutRef.current = null;
    }
    setPulseActive(false);
    requestAnimationFrame(() => {
      setPulseActive(true);
      pulseEndTimeoutRef.current = setTimeout(() => {
        setPulseActive(false);
        pulseEndTimeoutRef.current = null;
      }, PULSE_DURATION_MS);
    });
  }, [onDoubleClick]);

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
    onPinchingStop: onClose || onPinchZoom ? handlePinchingStop : undefined,
    onPanningStart: onClose ? handlePanningStart : undefined,
    onPanningStop: onClose ? handlePanningStop : undefined,
  };

  return (
    <TransformWrapper ref={transformRef} {...transformConfig}>
      <TransformComponent
        wrapperStyle={TRANSFORM_WRAPPER_STYLE}
        contentStyle={TRANSFORM_CONTENT_STYLE}
      >
        <div onDoubleClick={handleDoubleClick} className="relative h-full">
          {children}
          <div className="pointer-events-none absolute inset-0">
            <Overlay
              cover="container"
              color="highlight"
              trigger="active"
              active={pulseActive}
            />
          </div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
