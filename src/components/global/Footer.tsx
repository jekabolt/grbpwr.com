import { footerLinks as links, footerYear as year } from "@/constants";
import { serviceClient } from "@/lib/api";
import Link from "next/link";
import FooterForm from "./FooterForm";

export default function Footer() {
  async function formSubmitClick(data: FormData): Promise<void> {
    "use server";
    try {
      const payload: { email: string; name: string } = {
        email: data.get("email") as string,
        name: "no field for name",
      };
      await serviceClient.SubscribeNewsletter(payload);
    } catch (error) {
      throw error;
    }
  }

  return (
    <footer className="mt-24 flex w-full items-end justify-between gap-5 self-center p-5 text-xs font-medium text-black max-md:mt-10 max-md:max-w-full max-md:flex-wrap">
      <div className="mt-24 flex justify-center gap-0 whitespace-nowrap bg-black px-1.5 py-0.5 text-xs lowercase text-white max-md:mt-10">
        <div>currency:</div>
        {/* <CustomImage
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8764204ec037682f32733d88473f7cc6f61e2364f55757470d79a852ae6116e4?apiKey=2bd386ac58de4a4f9e996607125fc961&"
          alt="Currency icon"
          className="aspect-square w-3 shrink-0"
        /> */}
      </div>
      <div className="mt-28 max-md:mt-10">grbpwr {year}©</div>
      <Link
        className="mt-28 text-[#311EEE] underline max-md:mt-10"
        href={"/privacy-policy"}
      >
        privacy policy
      </Link>
      <div className="mt-28 flex justify-center gap-5 whitespace-nowrap text-[#311EEE] underline max-md:mt-10">
        {links.map((link) => (
          <Link href={link.href} key={link.text}>
            {link.text}
          </Link>
        ))}
      </div>

      <FooterForm formSubmitClick={formSubmitClick} />
    </footer>
  );
}
