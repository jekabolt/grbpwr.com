import { serviceClient } from "@/lib/api";

import { ArchiveClient } from "./_components/archive-client";

export type ViewMode = "horizontal" | "vertical";

export default async function Page() {
  const response = await serviceClient.GetArchivesPaged({
    limit: 8,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  return (
    <ArchiveClient
      archives={response.archives || []}
      total={response.total || 0}
    />
  );
}
