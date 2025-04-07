import { ARCHIVE_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { Galery } from "./_components/galery";

export default async function Page() {
  const { archives, total } = await serviceClient.GetArchivesPaged({
    limit: ARCHIVE_LIMIT,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  return (
    <div className="blackTheme bg-bgColor text-textColor">
      <FlexibleLayout
        mobileHeaderType="flexible"
        headerProps={{
          left: "grbpwr archive",
        }}
        mobileHeaderProps={{
          className: "bottom-0",
        }}
        footerType="mini"
        theme="dark"
        className="pt-16"
      >
        <Galery archives={archives || []} total={total || 0} />
        {/* 
        <VerticalCarousel>
          {archives.map((archive) => (
            <div key={archive.id}>{archive.name}</div>
          ))}
        </VerticalCarousel> */}
      </FlexibleLayout>
    </div>
  );
}
