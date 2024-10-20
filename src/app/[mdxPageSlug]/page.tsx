import { notFound } from "next/navigation";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import AboutMdx from "./about.mdx";
import ContactsMdx from "./contacts.mdx";
import ShippingMdx from "./shipping.mdx";

type Props = {
  params: {
    mdxPageSlug: string;
  };
};

const MDX_FILES_MAP: Record<string, any> = {
  about: AboutMdx,
  contacts: ContactsMdx,
  shipping: ShippingMdx,
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
    <NavigationLayout>
      <div className="prose lg:prose-xl">
        <MdxComponent />
      </div>
    </NavigationLayout>
  );
}
