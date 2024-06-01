import { notFound } from "next/navigation";
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

export default function Page({ params }: Props) {
  const { mdxPageSlug } = params;

  const MdxComponent = MDX_FILES_MAP[mdxPageSlug];

  if (!MdxComponent) {
    return notFound();
  }

  return <MdxComponent />;
}
