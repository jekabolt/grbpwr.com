import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { CountdownCircle } from "./coundown-circle";

export function NetworkExpiration({
  timeLeft,
  progressPercentage,
}: {
  timeLeft: string;
  progressPercentage: number;
}) {
  const isTimeExpired = timeLeft === "00:00:00";
  const isLessThan10Min =
    parseInt(timeLeft.split(":")[0]) === 0 &&
    parseInt(timeLeft.split(":")[1]) < 10;

  return (
    <div className="w-full space-y-4 border-b border-t border-textInactiveColor py-6">
      <div className="flex justify-between">
        <Text>network</Text>
        <Text variant="uppercase">tron (trc-20)</Text>
      </div>
      <div className="flex items-center justify-between">
        <Text className={cn({ "text-red-600": isTimeExpired })}>
          expiration time
        </Text>
        <div className="flex items-center gap-2">
          <CountdownCircle
            timeLeft={timeLeft}
            progressPercentage={progressPercentage}
          />
          <Text
            variant="inherit"
            className={cn("text-textColor", {
              "text-red-600": isLessThan10Min,
            })}
          >
            {timeLeft}
          </Text>
        </div>
      </div>
    </div>
  );
}
