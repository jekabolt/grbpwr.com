import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import {
  common_ArchiveFull,
  common_ArchiveList,
} from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

import { FullSizeItem } from "../_components/full-size-item";
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

  const archiveResponse = await serviceClient.GetArchive({
    heading,
    tag,
    id: parseInt(id),
  });

  const archive = archiveResponse.archive as common_ArchiveFull;

  return generateCommonMetadata({
    title:
      archive.archiveList?.heading?.toUpperCase() || "heading".toUpperCase(),
    description: archive.archiveList?.description || "description",
    ogParams: {
      imageUrl: archive.media?.[0].media?.thumbnail?.mediaUrl || "",
      imageAlt: archive.archiveList?.heading || "",
    },
  });
}

export const dynamic = "force-static";

export default async function Page({ params }: ArchivePageParams) {
  const { archiveParams } = await params;

  let nextArchive: common_ArchiveList | undefined;

  if (archiveParams.length !== 3) {
    notFound();
  }

  const [heading, tag, id] = archiveParams;
  const { archive } = await serviceClient.GetArchive({
    heading,
    tag,
    id: parseInt(id),
  });

  if (archive?.archiveList?.nextSlug) {
    const parts = archive.archiveList?.nextSlug.split("/");
    const nextParams = parts.slice(2);

    const [nextHeading, nextTag, nextId] = nextParams;

    const { archive: nextArchivee } = await serviceClient.GetArchive({
      heading: nextHeading,
      tag: nextTag,
      id: parseInt(nextId),
    });

    nextArchive = nextArchivee?.archiveList;
  }

  return (
    <FlexibleLayout
      headerType="archive"
      headerProps={{
        left: "grbpwr.com",
        center: "archive",
      }}
      theme="dark"
    >
      <PageComponent archive={archive} />

      <FullSizeItem archive={nextArchive} className="w-full lg:w-96" />
    </FlexibleLayout>
  );
}
