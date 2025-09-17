import { Text } from "@/components/ui/text";
import { useAnnounce } from "@/app/[locale]/_components/useAnnounce";

import { useDataContext } from "../contexts/DataContext";
import { Button } from "./button";

export function Announce() {
  const { dictionary } = useDataContext();
  const announce = dictionary?.announce || "";
  const { open, handleClose } = useAnnounce(announce);

  if (!open || !announce) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-30 flex h-8 w-full items-center justify-between bg-bgColor px-2.5 text-textColor lg:px-0">
      <div className="lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
        <Text variant="uppercase">{announce}</Text>
      </div>
      <Button
        onClick={handleClose}
        className="lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2"
      >
        [x]
      </Button>
    </div>
  );
}
