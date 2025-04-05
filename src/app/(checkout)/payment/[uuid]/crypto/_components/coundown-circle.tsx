import { CountdownCircleIcon } from "@/components/ui/icons/countdown-circle-icon";

export function CountdownCircle({
  timeLeft,
  progressPercentage,
}: {
  timeLeft: string;
  progressPercentage: number;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPercentage / 100);

  return (
    <div className="relative h-4 w-4">
      <CountdownCircleIcon
        radius={radius}
        circumference={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </div>
  );
}
