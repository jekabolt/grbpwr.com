import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { useDataContext } from "../contexts/DataContext";
import { Button } from "./button";

export function Announce({
  open,
  onClose,
  isVisible,
}: {
  open: boolean;
  onClose: () => void;
  isVisible: boolean;
}) {
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const announce =
    dictionary?.announce?.translations?.find((t) => t.languageId === languageId)
      ?.text || "";

  if (!open || !announce) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex h-8 w-full items-center justify-between bg-bgColor px-2.5 text-textColor lg:px-0",
        "transform-gpu transition-transform duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        {
          "translate-y-0": isVisible,
          "-translate-y-full": !isVisible,
        },
      )}
    >
      <div className="lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
        <Text variant="uppercase">{announce}</Text>
      </div>
      <Button
        onClick={onClose}
        className="lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2"
      >
        [x]
      </Button>
    </div>
  );
}
