export function HorizontalTopLine({ widthInfo }: { widthInfo?: string }) {
  // Position the line at the top of the t-shirt, spanning across it horizontally
  return (
    <>
      {/* Horizontal line with arrow ends */}
      <path
        d="M150 -100L970 -100"
        stroke="#311EEE"
        strokeWidth="5"
        markerStart="url(#arrowStartHorizontal)"
        markerEnd="url(#arrowEndHorizontal)"
      />

      {/* Info box with measurement */}
      <rect
        width="254"
        height="124"
        transform="translate(440 -165)"
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        x="567"
        y="-103"
      >
        {widthInfo}
      </text>

      {/* Arrow markers definition */}
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
