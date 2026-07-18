"use client";

import { Text } from "@/components/ui/text";
import { formatSizeName } from "@/lib/utils";

// The order line now carries its own public size code/name (size_name_snapshot,
// R2), so there is no dictionary lookup by internal size id any more.
export default function CartItemSize({ sizeName }: { sizeName: string }) {
  if (!sizeName) return null;

  return <Text variant="uppercase">{formatSizeName(sizeName)}</Text>;
}
