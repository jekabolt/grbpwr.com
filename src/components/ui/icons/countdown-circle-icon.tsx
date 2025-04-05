export function CountdownCircleIcon({
  radius,
  circumference,
  strokeDashoffset,
}: {
  radius: number;
  circumference: number;
  strokeDashoffset: number;
}) {
  return (
    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="#E5E7EB"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="#000"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        fill="none"
        strokeLinecap="round"
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
}
