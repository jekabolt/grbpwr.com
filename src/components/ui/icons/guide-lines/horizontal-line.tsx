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
        width="90"
        height="36"
        transform={`translate(${rectCenterX - 45} ${y - 18})`}
        style={{ zIndex: 1000 }}
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        x={rectCenterX}
        y={rectCenterY - 8}
      >
        {measurementType}
      </text>
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        x={rectCenterX}
        y={rectCenterY + 8}
      >
        {info} cm
      </text>
    </>
  );
}
