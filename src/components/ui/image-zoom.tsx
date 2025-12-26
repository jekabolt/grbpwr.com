"use client";

import { useRef } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

const TRANSFORM_CONFIG = {
  initialScale: 1,
  minScale: 1,
  maxScale: 4,
  limitToBounds: true,
  wheel: {
    step: 0.1,
  },
  pinch: {
    step: 10,
  },
  doubleClick: {
    disabled: false,
    step: 2,
    mode: "toggle",
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
}: {
  children: React.ReactNode;
  onDoubleClick?: () => void;
}) {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  return (
    <TransformWrapper ref={transformRef} {...TRANSFORM_CONFIG}>
      <TransformComponent
        wrapperStyle={TRANSFORM_WRAPPER_STYLE}
        contentStyle={TRANSFORM_CONTENT_STYLE}
      >
        <div onDoubleClick={onDoubleClick} className="h-full">
          {children}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
