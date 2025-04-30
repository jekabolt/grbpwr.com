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
        width="70"
        height="36"
        transform={`translate(${centerX - 35 + rectXOffset} ${finalTextY - 18 + rectYOffset})`}
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset - 8}
      >
        {measurementType}
      </text>
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset + 8}
      >
        {info} cm
      </text>
    </>
  );
}
