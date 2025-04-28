export function HorizontaltLine({
  info = "70",
  xStart = 156,
  xEnd = 966,
  y = 894,
  rectYOffset = 0,
}: {
  info: string;
  xStart?: number;
  xEnd?: number;
  y?: number;
  rectYOffset?: number;
}) {
  // Calculate the center of the rectangle
  const rectCenterX = (xStart + xEnd) / 2;
  const rectCenterY = y + rectYOffset;

  return (
    <>
      <path
        d={`M${xStart} ${y}L${xEnd} ${y}`}
        stroke="#311EEE"
        strokeWidth="5"
        fill="none"
        markerStart="url(#arrowStartHorizontal)"
        markerEnd="url(#arrowEndHorizontal)"
      />
      <rect
        width="254"
        height="124"
        transform={`translate(${rectCenterX - 127} ${y - 62 + rectYOffset})`}
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        x={rectCenterX}
        y={rectCenterY}
      >
        {info}
      </text>
      <defs>
        <marker
          id="arrowStartHorizontal"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="5"
          orient="auto"
        >
          <path d="M5,0 L0,5 L5,10" stroke="#311EEE" />
        </marker>
        <marker
          id="arrowEndHorizontal"
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
