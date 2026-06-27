import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { common_ArchiveFull } from "@/api/proto-http/frontend";
import { LANGUAGE_CODE_TO_ID } from "@/constants";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { PageBackground } from "../../_components/page-background";
import PageComponent from "./_components/page-component";

interface ArchivePageParams {
  params: Promise<{
    archiveParams: string[];
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; archiveParams: string[] }>;
}): Promise<Metadata> {
  const { archiveParams, locale } = await params;
  const localeId = LANGUAGE_CODE_TO_ID[locale];
  const [heading, tag, id] = archiveParams;
  const path = `/timeline/${archiveParams.join("/")}`;

  const archiveId = Number.parseInt(id, 10);
  if (Number.isNaN(archiveId)) {
    return generateCommonMetadata({ locale, path });
  }

  const archiveResponse = await serviceClient.GetArchive({
    heading,
    tag,
    id: archiveId,
  });

  const archive = archiveResponse.archive as common_ArchiveFull;
  const currentTranslation =
    archive?.archiveList?.translations?.find(
      (t) => t.languageId === localeId,
    ) || archive?.archiveList?.translations?.[0];

  return generateCommonMetadata({
    title:
      currentTranslation?.heading?.toUpperCase() || "heading".toUpperCase(),
    description: currentTranslation?.description || "description",
    locale,
    path,
    ogParams: {
      imageUrl: archive?.media?.[0]?.media?.thumbnail?.mediaUrl || undefined,
      imageAlt: currentTranslation?.heading || "",
    },
  });
}

export const dynamic = "force-static";

export default async function Page({ params }: ArchivePageParams) {
  const { archiveParams } = await params;
  const t = await getTranslations("navigation");

  if (archiveParams.length !== 3) {
    notFound();
  }

  const [heading, tag, id] = archiveParams;
  const archiveId = Number.parseInt(id, 10);

  if (Number.isNaN(archiveId)) {
    notFound();
  }

  const { archive } = await serviceClient.GetArchive({
    heading,
    tag,
    id: archiveId,
  });

  return (
    <>
      <PageBackground backgroundColor="#000000" splitBackground={false} />
      <FlexibleLayout
        headerType="archive"
        headerProps={{
          left: "grbpwr.com",
          center: t("timeline"),
        }}
        theme="dark"
        // className="pt-5 lg:pt-20"
      >
        <div className="space-y-20 px-2.5 pt-20 lg:space-y-10 lg:px-7">
          <PageComponent archive={archive} />
        </div>
      </FlexibleLayout>
    </>
  );
}
