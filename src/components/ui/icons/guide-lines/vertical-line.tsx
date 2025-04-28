export function VerticalLine({
  lengthInfo = "65",
  x = 763,
  yStart = 15,
  yEnd = 1216,
  textY,
  rectXOffset = 0,
  rectYOffset = 0,
  view = "vertical",
  xEnd,
}: {
  lengthInfo: string;
  x?: number;
  yStart?: number;
  yEnd?: number;
  textY?: number;
  rectXOffset?: number;
  rectYOffset?: number;
  view?: "vertical" | "diagonal";
  xEnd?: number;
}) {
  // For diagonal lines, if xEnd isn't specified, create a default diagonal
  const endX = view === "diagonal" ? xEnd ?? x + (yEnd - yStart) : x;

  // Calculate the center point of the line
  const centerX = view === "diagonal" ? (x + endX) / 2 : x;
  const centerY = (yStart + yEnd) / 2;

  // Use provided textY or calculate from center
  const finalTextY = textY ?? centerY;

  return (
    <>
      <path
        d={`M${x} ${yStart}L${endX} ${yEnd}`}
        stroke="#311EEE"
        strokeWidth="5"
        fill="none"
        markerStart="url(#arrowStart)"
        markerEnd="url(#arrowEnd)"
      />
      <rect
        width="254"
        height="124"
        transform={`translate(${centerX - 127 + rectXOffset} ${finalTextY - 62 + rectYOffset})`}
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="40"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset}
      >
        {lengthInfo}
      </text>

      <defs>
        <marker
          id="arrowStart"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="5"
          orient="auto"
        >
          <path d="M5,0 L0,5 L5,10" stroke="#311EEE" />
        </marker>
        <marker
          id="arrowEnd"
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
