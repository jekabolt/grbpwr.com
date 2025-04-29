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
  yOffset = 0,
}: {
  lengthInfo: string; //TODO: change name
  x?: number;
  yStart?: number;
  yEnd?: number;
  textY?: number;
  rectXOffset?: number;
  rectYOffset?: number;
  view?: "vertical" | "diagonal";
  xEnd?: number;
  yOffset?: number;
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
        fontSize="10"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset - 8}
      >
        inseam
      </text>
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        x={centerX + rectXOffset}
        y={finalTextY + rectYOffset + 8}
      >
        {lengthInfo} cm
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
