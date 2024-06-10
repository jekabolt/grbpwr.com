import Header from "@/components/global/Header";
import GlobalLink from "@/components/global/Link";
import { LinkStyle } from "@/components/global/Link/styles";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow items-center justify-center">
        <div className=" text-left">
          <p className="mb-4 text-sm">page not found.</p>
          <p className="mb-6 text-xs">
            sorry, the page you are looking for doesn&apos;t exist or has been
            moved.
            <br />
            please go back to the homepage or contact us if the problem
            persists.
          </p>
          <div className="flex flex-row items-center space-x-20">
            <GlobalLink style={LinkStyle.mainNavigation} href="/contacts">
              <p className="text-sm ">contact us</p>
            </GlobalLink>
            <GlobalLink style={LinkStyle.notFoundCatalogButton} href="/catalog">
              <button>catalog</button>
            </GlobalLink>
          </div>
        </div>
      </div>
    </div>
  );
}
