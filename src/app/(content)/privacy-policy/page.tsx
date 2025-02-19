import Link from "next/link";

import { Button } from "@/components/ui/button";
import CareComposition from "@/components/ui/care-composition";
import CopyText from "@/components/ui/copy-text";
import { Text } from "@/components/ui/text";
import TextWrapper from "@/components/ui/text-wrapper";

import { CookieContent } from "./cookie-content";

const links = [
  { href: "facebook", label: "facebook" },
  { href: "google", label: "google" },
  { href: "bing", label: "bing" },
  { href: "daa", label: "daa" },
];

export default function Component() {
  return (
    <TextWrapper>
      <Text variant="uppercase" component="h1">
        privacy policy
      </Text>
      <Text variant="uppercase">introduction</Text>
      <Text size="small" className="pb-6 leading-none">
        welcome to grbpwr&apos;s privacy policy. we respect your privacy and are
        committed to protecting your personal data. this policy outlines how we
        handle your personal data when you visit our website, irrespective of
        where you visit from, and informs you about your privacy rights and
        legal protections.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">1.personal data we collect</Text>
      <Text size="small" className="leading-none">
        1.1 device information: when you visit our website, we automatically
        collect information about your device, including details like your web
        browser, ip address, time zone, and your site interactions. we collect
        this information through: local storage: stores data like site
        preferences and shopping cart contents directly in your browser without
        transmitting it back to our servers.
        <br />
        log files: track actions on the site and gather data such as ip adress,
        browser type, service provider, referring/exit pages, and timestamps.
        <br />
        1.2 order information: when you make a purchase, we collect the
        following information to process your transaction: your name, billing
        and shipping address, payment details (excluding direct credit card
        numbers), email address, and phone number.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">2.how we use your information</Text>
      <Text size="small" className="leading-none">
        we use order information to fulfill your orders, communicate with you,
        screen for risks or fraud, and provide relevant advertisements. device
        information helps us to improve site functionality, analyze customer
        interaction, and optimize marketing strategies.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">3. third-party services</Text>
      <Text size="small" component="span" className="mb-6 block leading-none">
        we share your personal data with selected third parties including:
        payment processors like stripe and tron
        <br />
        <span className="inline-flex items-center">
          google analytics for site usage analysis (opt-out&nbsp;
          <Button variant="underlineWithColors" asChild>
            <Link href="here">here</Link>
          </Button>
          )
        </span>
        <br />
        logistics and delivery partners necessary for order fulfillment
        <br />
        for further details on how these parties manage your data, please review
        their privacy policies directly on their respective websites.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">4. marketing choices and rights</Text>
      <Text size="small" className="mb-1 leading-none">
        you have several choices regarding targeted advertising:
      </Text>
      <ul className="mt-0 list-inside list-disc pl-0 leading-none [&>li]:m-0 [&>li]:pl-1 [&>li]:leading-none">
        {links.map((link) => (
          <li
            key={link.href}
            className="flex items-center leading-none before:mr-2 before:content-['•']"
          >
            <Button variant="underlineWithColors" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">5. your rights</Text>
      <Text size="small" component="span" className="mb-6 block leading-none">
        as a european resident, you are entitled to access, correct, delete, or
        transfer your personal data, or object to its processing. to exercise
        these rights, please contact us via email at&nbsp;
        <span className="inline-flex items-center">
          <CopyText text="info@gibpwr.com" />
        </span>
        , or by phone or postal mail at our company address listed on our
        website.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">6. data retention</Text>
      <Text size="small" className="leading-none">
        we retain your order information as long as necessary to fulfill the
        purposes outlined in this policy unless otherwise required or permitted
        by law.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <CookieContent />
    </TextWrapper>
  );
}
