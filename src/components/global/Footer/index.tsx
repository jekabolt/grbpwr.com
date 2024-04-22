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
    <footer className="grid grid-cols-1 gap-14 p-2 md:grid-cols-2 md:gap-10">
      <div className="col-span-1 md:order-last">
        <FooterForm formSubmitClick={formSubmitClick} />
      </div>

      <div className="col-span-1 flex h-full flex-col gap-4 text-xs md:flex-row">
        <div className="space-x-5">
          {links.map((link) => (
            <Link href={link.href} key={link.text} className="hover:underline">
              {link.text}
            </Link>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-6">
            <div>grbpwr {year}©</div>
            <Link className="hover:underline" href="/privacy-policy">
              privacy policy
            </Link>
          </div>
          <div className="bg-black px-1.5 py-0.5 leading-3 text-white">
            currency: {"[tbd]"}
          </div>
        </div>
      </div>
    </footer>
  );
}
