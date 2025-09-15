import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import FlexibleLayout from "@/components/flexible-layout";

import PageComponent from "./_components/page-component";

interface ArchivePageParams {
  params: Promise<{
    archiveParams: string[];
  }>;
}

export async function generateMetadata({
  params,
}: ArchivePageParams): Promise<Metadata> {
  const { archiveParams } = await params;

  const [heading, tag, id] = archiveParams;

  const { selectedLanguage } = useCurrency((state) => state);

  const archiveResponse = await serviceClient.GetArchive({
    heading,
    tag,
    id: parseInt(id),
  });

  const archive = archiveResponse.archive as common_ArchiveFull;

  return generateCommonMetadata({
    title:
      archive.archiveList?.translations?.[
        selectedLanguage.id
      ]?.heading?.toUpperCase() || "heading".toUpperCase(),
    description:
      archive.archiveList?.translations?.[selectedLanguage.id]?.description ||
      "description",
    ogParams: {
      imageUrl: archive.media?.[0].media?.thumbnail?.mediaUrl || "",
      imageAlt:
        archive.archiveList?.translations?.[selectedLanguage.id]?.heading || "",
    },
  });
}

export const dynamic = "force-static";

export default async function Page({ params }: ArchivePageParams) {
  const { archiveParams } = await params;

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
    <FlexibleLayout
      headerType="archive"
      headerProps={{
        left: "grbpwr.com",
        center: "timeline",
      }}
      theme="dark"
      className="pt-5 lg:pt-20"
    >
      <div className="space-y-20 px-2.5 pb-20 lg:space-y-10 lg:px-7 lg:pb-12">
        <PageComponent archive={archive} />
        {/* <div className="h-full lg:h-screen">
          <FullSizeItem archive={nextArchive} className="w-60 lg:w-[34rem]" />
        </div> */}
      </div>
    </FlexibleLayout>
  );
}
