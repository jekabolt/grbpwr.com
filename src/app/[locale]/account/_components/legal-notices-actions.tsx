import { Button } from "@/components/ui/button";

import { LegalNotices } from "../../(content)/legal-notices/legal-notices";

export function LegalNoticesActions({
  onAccept,
  onSkip,
}: {
  onAccept: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-14">
      <div className="flex w-full">
        <LegalNotices />
      </div>
      <div className="flex w-full gap-4">
        <Button
          type="button"
          variant="simpleReverse"
          size="lg"
          className="w-full border border-textColor"
          onClick={onSkip}
        >
          skip for now
        </Button>
        <Button
          type="button"
          variant="main"
          size="lg"
          className="w-full"
          onClick={onAccept}
        >
          accept
        </Button>
      </div>
    </div>
  );
}
