import { notFound } from "next/navigation";
import CoreLayout from "@/components/layouts/CoreLayout";
import AboutMdx from "./about.mdx";
import ContactsMdx from "./contacts.mdx";

type Props = {
  params: {
    mdxPageSlug: string;
  };
};

const MDX_FILES_MAP: Record<string, any> = {
  about: AboutMdx,
  contacts: ContactsMdx,
};

export function generateStaticParams() {
  return Object.keys(MDX_FILES_MAP).map((mdxPageSlug) => ({
    mdxPageSlug,
  }));
}

export default function Page({ params }: Props) {
  const { mdxPageSlug } = params;

  const MdxComponent = MDX_FILES_MAP[mdxPageSlug];

  if (!MdxComponent) {
    return notFound();
  }

  return (
    <CoreLayout>
      <div className="prose lg:prose-xl">
        <MdxComponent />
      </div>
    </CoreLayout>
  );
}
