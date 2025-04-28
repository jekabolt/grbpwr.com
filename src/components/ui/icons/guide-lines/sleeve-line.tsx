export function SleeveLine({
  sleeveInfo = "25",
  xStart = 1306.66,
  yStart = 657.57,
  xEnd = 1161.34,
  yEnd = 121.17,
  rectX = 1134,
  rectY = 354,
  rectXOffset = 0,
  rectYOffset = 0,
  xOffset = 0,
}: {
  sleeveInfo?: string;
  xStart?: number;
  yStart?: number;
  xEnd?: number;
  yEnd?: number;
  rectX?: number;
  rectY?: number;
  rectXOffset?: number;
  rectYOffset?: number;
  xOffset?: number;
}) {
  // Calculate the center of the rectangle for text positioning
  const textX = rectX + rectXOffset + 127; // 127 is half the width of the rectangle (254/2)
  const textY = rectY + rectYOffset + 62; // 62 is half the height of the rectangle (124/2)

  // Apply xOffset to both start and end points
  const adjustedXStart = xStart + xOffset;
  const adjustedXEnd = xEnd + xOffset;

  return (
    <>
      {/* Sleeve line with arrow ends */}
      <path
        d={`M${adjustedXStart} ${yStart}L${adjustedXEnd} ${yEnd}`}
        stroke="#311EEE"
        strokeWidth="5"
        markerStart="url(#arrowStartSleeve)"
        markerEnd="url(#arrowEndSleeve)"
      />
      <rect
        width="254"
        height="124"
        transform={`translate(${rectX + rectXOffset + xOffset} ${rectY + rectYOffset})`}
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        x={textX + xOffset}
        y={textY}
      >
        {sleeveInfo}cm length
      </text>

      {/* Arrow markers definition */}
      <defs>
        <marker
          id="arrowStartSleeve"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="5"
          orient="auto"
        >
          <path d="M5,0 L0,5 L5,10" stroke="#311EEE" />
        </marker>
        <marker
          id="arrowEndSleeve"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L5,5 L0,10" stroke="#311EEE" />
        </marker>
      </defs>
    </>
  );
}
