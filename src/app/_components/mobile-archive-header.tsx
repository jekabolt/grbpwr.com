import Link from "next/link";

import { HeaderProps } from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function MobileArchiveHeader({
  left,
  center,
  right,
  link,
  onClick,
}: HeaderProps) {
  return (
    <>
      <div className="fixed inset-x-6 top-6 z-30 flex justify-end bg-transparent text-textColor">
        <Button onClick={onClick}>{right}</Button>
      </div>
      <div className="bottom fixed inset-x-2.5 bottom-2.5 z-30 flex h-12 items-center justify-between bg-bgColor px-4 py-2.5 text-textColor">
        <Button asChild>
          <Link href={link ? link : "/"}>{left}</Link>
        </Button>
        <Text>{center}</Text>
      </div>
    </>
  );
}
