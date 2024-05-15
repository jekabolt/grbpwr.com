import { FOOTER_LINKS as links, FOOTER_YEAR as year } from "@/constants";
import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import FooterForm from "./FooterForm";
import Popover from "@/components/ui/Popover";

export default function Footer({
  className,
  hideForm,
}: {
  className?: string;
  hideForm?: boolean;
}) {
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
    <footer
      className={cn(
        "grid grid-cols-1 gap-14 p-2 text-textColor lg:grid-cols-2 lg:gap-10",
        className,
      )}
    >
      <div className="col-span-1 lg:order-last">
        {!hideForm && <FooterForm formSubmitClick={formSubmitClick} />}
      </div>

      <div className="col-span-1 flex h-full flex-col gap-4 text-xs lg:flex-row-reverse lg:justify-between">
        <div className="space-x-5">
          {links.map((link) => (
            <Link href={link.href} key={link.text} className="hover:underline">
              {link.text}
            </Link>
          ))}
        </div>

        <div className="flex justify-between gap-4 lg:flex-row-reverse">
          <div className="flex items-start gap-6 lg:gap-10">
            <div>grbpwr {year}©</div>
            <Link className="hover:underline" href="/privacy-policy">
              privacy policy
            </Link>
          </div>
          <div>
            <span className="bg-textColor px-1.5 py-0.5 text-buttonTextColor">
              {/* currency: {"[tbd]"} */}
              <Popover />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
