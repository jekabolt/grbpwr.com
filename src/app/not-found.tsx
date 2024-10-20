import Header from "@/components/sections/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="ml-40 mt-40">
        <p className="mb-4">page not found.</p>
        <p className="mb-6">
          sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
          <br />
          please go back to the homepage or contact us if the problem persists.
        </p>
        <div className="flex gap-x-20">
          <Button asChild variant="underlineWithColors">
            <Link href="/contacts">contact us</Link>
          </Button>
          <Button asChild variant="underlineWithColors">
            <Link href="/catalog">catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
