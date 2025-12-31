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

  const archiveResponse = await serviceClient.GetArchive({
    heading,
    tag,
    id: parseInt(id),
  });

  const archive = archiveResponse.archive as common_ArchiveFull;
  const currentTranslation =
    archive.archiveList?.translations?.find((t) => t.languageId === localeId) ||
    archive.archiveList?.translations?.[0];

  return generateCommonMetadata({
    title:
      currentTranslation?.heading?.toUpperCase() || "heading".toUpperCase(),
    description: currentTranslation?.description || "description",
    ogParams: {
      imageUrl: archive.media?.[0].media?.thumbnail?.mediaUrl || "",
      imageAlt: currentTranslation?.heading || "",
    },
  });
}

export const dynamic = "force-static";

export default async function Page({ params }: ArchivePageParams) {
  const { archiveParams } = await params;
  const t = await getTranslations("navigation");

  // let nextArchive: common_ArchiveList | undefined;

  if (archiveParams.length !== 3) {
    notFound();
  }

  const [heading, tag, id] = archiveParams;
  const { archive } = await serviceClient.GetArchive({
    heading,
    tag,
    id: parseInt(id),
  });

  // if (archive?.archiveList?.nextSlug) {
  //   const parts = archive.archiveList?.nextSlug.split("/");
  //   const nextParams = parts.slice(2);

  //   const [nextHeading, nextTag, nextId] = nextParams;

  //   const { archive: nextArchivee } = await serviceClient.GetArchive({
  //     heading: nextHeading,
  //     tag: nextTag,
  //     id: parseInt(nextId),
  //   });

  //   nextArchive = nextArchivee?.archiveList;
  // }

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
        className="pt-5 lg:pt-20"
      >
        <div className="space-y-20 px-2.5 pt-20 lg:space-y-10 lg:px-7 lg:pt-24">
          <PageComponent archive={archive} />
          {/* <div className="h-full lg:h-screen">
          <FullSizeItem archive={nextArchive} className="w-60 lg:w-[34rem]" />
        </div> */}
        </div>
      </FlexibleLayout>
    </>
  );
}
