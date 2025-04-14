import { ARCHIVE_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";

import { ArchiveLayout } from "./_components/archive-layout";

export default async function Page() {
  const { archives, total } = await serviceClient.GetArchivesPaged({
    limit: ARCHIVE_LIMIT,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  return <ArchiveLayout archives={archives || []} total={total || 0} />;
}
