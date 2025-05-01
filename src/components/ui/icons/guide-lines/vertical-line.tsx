import { useEffect, useRef, useState } from "react";

export function VerticalLine({
  info = "65",
  x = 763,
  yStart = 15,
  yEnd = 1216,
  textY,
  rectXOffset = 0,
  rectYOffset = 0,
  view = "vertical",
  xEnd,
  yOffset = 0,
  measurementType = "length",
}: {
  info: string;
  x?: number;
  yStart?: number;
  yEnd?: number;
  textY?: number;
  rectXOffset?: number;
  rectYOffset?: number;
  view?: "vertical" | "diagonal";
  xEnd?: number;
  yOffset?: number;
  measurementType?: string;
}) {
  const endX = view === "diagonal" ? xEnd ?? x + (yEnd - yStart) : x;

  const adjustedYStart = yStart + yOffset;
  const adjustedYEnd = yEnd + yOffset;

  const centerX = view === "diagonal" ? (x + endX) / 2 : x;
  const centerY = (adjustedYStart + adjustedYEnd) / 2;

  const finalTextY = textY ?? centerY;

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
        d={`M${x} ${adjustedYStart}L${endX} ${adjustedYEnd}`}
        stroke="#311EEE"
        strokeWidth="1"
        fill="none"
        markerStart="url(#arrowStart)"
        markerEnd="url(#arrowEnd)"
      />
      <rect
        width={rectDimensions.width}
        height={rectDimensions.height}
        transform={`translate(${centerX - rectDimensions.width / 2 + rectXOffset} ${finalTextY - rectDimensions.height / 2 + rectYOffset})`}
        fill="#311EEE"
      />
      <text
        ref={typeTextRef}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset - 8}
      >
        {measurementType}
      </text>
      <text
        ref={infoTextRef}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset + 8}
      >
        {info} cm
      </text>
    </>
  );
}
