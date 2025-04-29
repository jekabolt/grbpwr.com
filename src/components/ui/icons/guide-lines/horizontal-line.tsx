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
  measurementType:
    | "waist"
    | "width"
    | "chest"
    | "sholders"
    | "hips"
    | "bust"
    | "leg open"
    | "bottom width"
    | "width to last"
    | "width to first"
    | "length";
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
        fontSize="10"
        x={rectCenterX}
        y={rectCenterY - 8}
      >
        {measurementType}
      </text>
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        x={rectCenterX}
        y={rectCenterY + 8}
      >
        {info} cm
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
