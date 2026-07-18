import { Metadata } from "next";
import { notFound } from "next/dist/client/components/not-found";
import { StorefrontArchiveFull } from "@/api/proto-http/frontend";
import { LANGUAGE_CODE_TO_ID } from "@/constants";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { archiveCodeFromHandle } from "@/lib/slug-tail";
import FlexibleLayout from "@/components/flexible-layout";

import { PageBackground } from "../../_components/page-background";
import PageComponent from "./_components/page-component";

interface ArchivePageParams {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { handle, locale } = await params;
  const localeId = LANGUAGE_CODE_TO_ID[locale];
  const code = archiveCodeFromHandle(handle);

  const archiveResponse = code
    ? await serviceClient.GetArchive({
        heading: undefined,
        tag: undefined,
        id: undefined,
        code,
      })
    : { archive: undefined };

  const archive = archiveResponse.archive as StorefrontArchiveFull | undefined;
  const currentTranslation =
    archive?.archiveList?.translations?.find(
      (t) => t.languageId === localeId,
    ) || archive?.archiveList?.translations?.[0];

  // Description now lives in the first TEXT block (the archive translation no
  // longer carries one); fall back to the heading.
  const firstText = archive?.items?.find(
    (i) => i.type === "ARCHIVE_ITEM_TYPE_TEXT",
  )?.text?.translations;
  const description =
    (firstText?.find((t) => t.languageId === localeId) || firstText?.[0])
      ?.text ||
    currentTranslation?.heading ||
    "grbpwr archive";

  // OG image: the archive thumbnail, else the first media-carrying block.
  const firstBlockMedia = archive?.items?.reduce<string | undefined>(
    (found, i) =>
      found ||
      i.mainMedia?.media?.media?.thumbnail?.mediaUrl ||
      i.mediaLine?.media?.find((m) => m.media?.thumbnail?.mediaUrl)?.media
        ?.thumbnail?.mediaUrl ||
      i.mediaWithCaption?.media?.media?.thumbnail?.mediaUrl,
    undefined,
  );

  return generateCommonMetadata({
    title:
      currentTranslation?.heading?.toUpperCase() || "heading".toUpperCase(),
    description,
    locale,
    path: `/timeline/${handle}`,
    ogParams: {
      imageUrl:
        archive?.archiveList?.thumbnail?.media?.thumbnail?.mediaUrl ||
        firstBlockMedia ||
        "",
      imageAlt: currentTranslation?.heading || "",
    },
  });
}

export const dynamic = "force-static";

export default async function Page({ params }: ArchivePageParams) {
  const { handle } = await params;
  const t = await getTranslations("navigation");

  const code = archiveCodeFromHandle(handle);
  if (!code) {
    notFound();
  }

  const { archive } = await serviceClient.GetArchive({
    heading: undefined,
    tag: undefined,
    id: undefined,
    code,
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
        // className="pt-5 lg:pt-20"
      >
        <div className="space-y-20 px-2.5 pt-20 lg:space-y-10 lg:px-7">
          <PageComponent archive={archive} />
          {/* <div className="h-full lg:h-screen">
          <FullSizeItem archive={nextArchive} className="w-60 lg:w-[34rem]" />
        </div> */}
        </div>
      </FlexibleLayout>
    </>
  );
}
