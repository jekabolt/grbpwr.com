import { useEffect, useRef, useState } from "react";

export function HorizontalLine({
  info = "70",
  xStart = 156,
  xEnd = 966,
  y = 894,
  rectYOffset = 0,
  measurementType = "width",
}: {
  info: string;
  xStart?: number;
  xEnd?: number;
  y?: number;
  rectYOffset?: number;
  measurementType: string;
}) {
  const rectCenterX = (xStart + xEnd) / 2;
  const rectCenterY = y + rectYOffset;
  const typeTextRef = useRef<SVGTextElement>(null);
  const infoTextRef = useRef<SVGTextElement>(null);
  const [rectDimensions, setRectDimensions] = useState({
    width: 75,
    height: 19,
  });

  useEffect(() => {
    if (typeTextRef.current && infoTextRef.current) {
      const typeBox = typeTextRef.current.getBBox();
      const infoBox = infoTextRef.current.getBBox();

      const width = Math.max(typeBox.width, infoBox.width) + 20;
      const height = typeBox.height + infoBox.height + 16;

      setRectDimensions({ width, height });
    }
  }, [measurementType, info]);

  return (
    <>
      <path
        d={`M${xStart} ${y}L${xEnd} ${y}`}
        stroke="#311EEE"
        strokeWidth="1"
        fill="none"
        markerStart="url(#arrowStartHorizontal)"
        markerEnd="url(#arrowEndHorizontal)"
      />
      <rect
        width={rectDimensions.width}
        height={rectDimensions.height}
        transform={`translate(${rectCenterX - rectDimensions.width / 2} ${y - rectDimensions.height / 2})`}
        fill="#311EEE"
      />
      <text
        ref={typeTextRef}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        x={rectCenterX}
        y={rectCenterY - 8}
      >
        {measurementType}
      </text>
      <text
        ref={infoTextRef}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        x={rectCenterX}
        y={rectCenterY + 8}
      >
        {info} cm
      </text>
    </>
  );
}
