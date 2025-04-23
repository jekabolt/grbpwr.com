import { Metadata } from "next";
import { notFound } from "next/navigation";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

import PageComponent from "./_components/page-component";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const archiveResponse = await serviceClient.GetArchive({
    id: parseInt(id),
    heading: "1",
    tag: "1",
  });

  const archive = archiveResponse.archive as common_ArchiveFull;

  return {
    title: archive.heading,
    openGraph: {
      title: archive.heading,
      description: archive.description,
      type: "website",
      siteName: "grbpwr.com",
      images: [
        {
          url: archive.media?.[0].media?.thumbnail?.mediaUrl || "",
          width: 20,
          height: 20,
          alt: "archive image",
        },
      ],
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;

  const archiveResponse = await serviceClient.GetArchive({
    id: parseInt(params.id),
    heading: "1",
    tag: "1",
  });

  if (!archiveResponse || !archiveResponse.archive) {
    notFound();
  }

  const archive = archiveResponse.archive as common_ArchiveFull;

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
      <PageComponent archive={archive} />
    </FlexibleLayout>
  );
}
