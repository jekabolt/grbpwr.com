import { notFound } from "next/dist/client/components/not-found";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import { FullSizeItem } from "../_components/full-size-item";
import PageComponent from "./_components/page-component";

interface ArchivePageParams {
  params: Promise<{
    archiveParams: string[];
  }>;
}

let nextArchive: common_ArchiveFull | undefined;

export const dynamic = "force-static";

export default async function Page({ params }: ArchivePageParams) {
  const { archiveParams } = await params;

  if (archiveParams.length === 0) {
    notFound();
  }

  const [heading, tag, id] = archiveParams;
  const { archive } = await serviceClient.GetArchive({
    heading,
    tag,
    id: parseInt(id),
  });

  if (archive?.nextSlug) {
    const parts = archive.nextSlug.split("/");
    const nextParams = parts.slice(2);

    console.log(archive?.nextSlug);
    console.log(nextParams);

    const [nextHeading, nextTag, nextId] = nextParams;

    const { archive: nextArchivee } = await serviceClient.GetArchive({
      heading: nextHeading,
      tag: nextTag,
      id: parseInt(nextId),
    });

    nextArchive = nextArchivee;
  }

  return (
    <FlexibleLayout
      headerType="archive"
      headerProps={{
        left: "grbpwr.com",
        center: "archive",
      }}
      footerType="mini"
      theme="dark"
      className="pt-16"
    >
      <div className="px-14 lg:px-7">
        <PageComponent archive={archive} />
        <div className="my-16">
          <FullSizeItem
            archive={nextArchive}
            link="next"
            className="w-full lg:w-96"
          />
        </div>
      </div>
    </FlexibleLayout>
  );
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { id } = await params;

//   const archiveResponse = await serviceClient.GetArchive({
//     id: parseInt(id),
//     heading: "1",
//     tag: "1",
//   });

//   const archive = archiveResponse.archive as common_ArchiveFull;

//   return generateCommonMetadata({
//     title: archive.heading?.toUpperCase() || "heading".toUpperCase(),
//     description: archive.description || "description",
//     ogParams: {
//       imageUrl: archive.media?.[0].media?.thumbnail?.mediaUrl || "",
//       imageAlt: archive.heading || "",
//     },
//   });
// }
