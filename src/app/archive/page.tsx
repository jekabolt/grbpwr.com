import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { Galery } from "./_components/galery";

export default async function Page() {
  const { archives } = await serviceClient.GetArchivesPaged({
    limit: 10,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  return (
    <FlexibleLayout
      headerType="flexible"
      headerProps={{
        left: "grbpwr archive",
      }}
      footerType="mini"
      theme="dark"
    >
      <Galery archives={archives || []} />
      {/*
        <VerticalCarousel>
          {archives.map((archive) => (
            <div key={archive.id}>{archive.name}</div>
          ))}
        </VerticalCarousel> */}
    </FlexibleLayout>
  );
}
