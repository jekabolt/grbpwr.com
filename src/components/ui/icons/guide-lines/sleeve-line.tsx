export function SleeveLine({ sleeveInfo = "25" }: { sleeveInfo?: string }) {
  return (
    <>
      {/* Sleeve line with arrow ends */}
      <path
        d="M1306.66 657.57L1161.34 121.17"
        stroke="#311EEE"
        strokeWidth="5"
        markerStart="url(#arrowStartSleeve)"
        markerEnd="url(#arrowEndSleeve)"
      />
      <rect
        width="254"
        height="124"
        transform="translate(1134 354)"
        fill="#311EEE"
      />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        x="1261"
        y="416"
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
