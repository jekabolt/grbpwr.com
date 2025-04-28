export function VerticalLine({
  lengthInfo = "65",
  x = 763,
  yStart = 15,
  yEnd = 1216,
  textY = 611,
  rectXOffset = 0,
}: {
  lengthInfo: string;
  x?: number;
  yStart?: number;
  yEnd?: number;
  textY?: number;
  rectXOffset?: number;
}) {
  return (
    <>
      <path
        d={`M${x} ${yStart}L${x} ${yEnd}`}
        stroke="#311EEE"
        strokeWidth="5"
        fill="none"
        markerStart="url(#arrowStart)"
        markerEnd="url(#arrowEnd)"
      />
      <rect
        width="254"
        height="124"
        transform={`translate(${x - 127 + rectXOffset} ${textY - 62})`}
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="40"
        x={x + rectXOffset}
        y={textY}
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
