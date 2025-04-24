import Link from "next/link";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { Button } from "@/components/ui/button";
import CareComposition from "@/components/ui/care-composition";
import { Text } from "@/components/ui/text";
import TextWrapper from "@/components/ui/text-wrapper";

export const metadata = generateCommonMetadata({
  title: "terms and conditions".toUpperCase(),
});

export default function Component() {
  return (
    <TextWrapper>
      <Text variant="uppercase" component="h1">
        terms and conditions
      </Text>
      <Text variant="uppercase">overview</Text>
      <Text size="small" className="leading-none">
        this website is managed by grbpwr. throughout the site, the terms
        &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to
        grbpwr. grbpwr provides this website, which includes all information,
        tools, and services available to you, the user, conditioned upon your
        acceptance of all terms, conditions, policies, and notices stated here.
        <br />
        <br />
        by accessing our site and/or purchasing something from us, you
        participate in our &ldquo;service&rdquo; and agree to be bound by the
        terms and conditions (&ldquo;terms&rdquo;, &ldquo;terms of
        service&rdquo;), including additional terms and conditions and policies
        referenced herein and/or available by hyperlink. these terms and
        conditions apply to all users of the site, including browsers, vendors,
        customers, merchants, and content contributors.
        <br />
        <br />
        please read these terms and conditions carefully before using our
        website. by using any part of website, you agree to these terms of
        service. if you disagree with any part of the terms and conditions, then
        you should not access the website or use any services. if these terms of
        service are considered an offer, acceptance is expressly limited to
        these terms.
        <br />
        <br />
        new features or tools added to the current store will also be subject to
        the terms of service. you can review the most current version of the
        terms of service at any time on this page. we reserve the right to
        update, change, or replace any part of these terms of service by posting
        updates and/or changes on our website. it is your responsibility to
        check this page periodically for changes. your continued use of or
        access to the website following the posting of any changes constitutes
        acceptance of those changes.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">1. online store terms</Text>
      <Text size="small" className="leading-none">
        by agreeing to these terms of service, you confirm that you are at least
        the age of majority in your state or province of residence, or that you
        have given us your consent to allow any of your minor dependents to use
        this site.
        <br />
        <br />
        you must not use our products for any illegal or unauthorized purpose,
        nor may you, in the use of the service, violate any laws in your
        jurisdiction.
        <br />
        <br />
        you must not transmit any worms, viruses, or any code of a destructive
        nature.
        <br />
        <br />a breach or violation of any of the terms will result in an
        immediate termination of your services.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">2. general conditions</Text>
      <Text size="small" className="leading-none">
        we reserve the right to refuse service to anyone for any reason at any
        time.
        <br />
        <br />
        your content may be transferred unencrypted and involve transmissions
        over various networks; and changes to conform and adapt to technical
        requirements of connecting networks or devices. credit card information
        is always encrypted during transfer over networks.
        <br />
        <br />
        you agree not to reproduce, duplicate, copy, sell, resell or exploit any
        portion of the service, use of the service, or access to the service or
        any contact on the website through which the service is provided,
        without express written permission by us.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">
        3. accurancy, completeness, and timeliness of information
      </Text>
      <Text size="small" className="leading-none">
        we are not responsible if information made available on this site is not
        accurate, complete, or current. the material on this site is provided
        for general information only and should not be relied upon or used as
        the sole basis for making decisions without consulting primary, more
        accurate, complete, or timely sources of information, any reliance on
        the material on this site is at your own risk.
        <br />
        <br />
        this site may contain historical information, which is not current and
        is provided for your reference only. we reserve the right to modify the
        contents of this site at any time, but we have no obligation to update
        any information. it is your responsibility to monitor changes to our
        site.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">4. modification to the service and prices</Text>
      <Text size="small" className="leading-none">
        prices for our products are subject to change without notice.
        <br />
        <br />
        we reserve the right at any time to modify or discontinue the service
        (or any part or content thereof) without notice at any time.
        <br />
        <br />
        the service. De table to you of to any thara-pazty for any modaticatzon,
        peace change, suspension, of discontanuance of
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">5. product or services (if applicable)</Text>
      <Text size="small" className="leading-none">
        certain products or services may be available exclusively online through
        the website. these products or services may have limited quantities and
        are subject to return or exchange only according to our return policy.
        <br />
        <br />
        we hade made every effort to display as accuratly as possible the colors
        and images of our products that appear at the store. we cannot guarantee
        that your computer monitor&apos;s display of any color will be accurate.
        <br />
        <br />
        we reserve the right, but are not obligated, to limit the sales of our
        products or services to any person, geographic region or jurisdiction.
        we may exercise this right on a case-by-case basis. we reserve the right
        to limit the quantities of any products or services that we offer. all
        descriptions of products or product pricing are subject to change at any
        time without notice, at our sole discretion. we reserve the right to
        discontinue any product at any time. any offer for any product or
        service mode on this site is void where prohibited.
        <br />
        <br />
        we do not warrant that the quality of any products, services,
        information, or other material purchased or obtained by you will meet
        your expectations, or that any errors in the service will be corrected.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">
        6. accuracy of billing and account information
      </Text>
      <Text size="small" component="span" className="mb-6 block leading-none">
        we reserve the right to refuse any order you place with us. we may, in
        our sole discretion, limit or cancel quantities purchased per person,
        per household or per order. these restrictions may include orders placed
        by or under the same customer account, the some credit card, and/or
        orders that use the same billing and/or shipping address. in the event
        that we make a change to or cancel an order, we may attempt to notify
        you by contacting the e-mail and/or billing address/phone number
        provided at the time the order was made. we reserve the right to limit
        or prohibit orders that, in our sole judgment, appear to be placed by
        dealers, resellers, or distributors.
        <br />
        <br />
        you agree to provide current, complete, and accurate purchase and
        account information for all purchases made at our store. you agree to
        promptly update your account and other information, including your email
        address and credit card numbers and expiration dates, so that we can
        complete your transactions and contact you as needed.
        <br />
        <br />
        <span className="inline-flex items-center">
          for more details, please review our&nbsp;
          <Button variant="underlineWithColors" asChild>
            <Link href="refund-return-policy">returns policy</Link>
          </Button>
        </span>
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">7. optional tools</Text>
      <Text size="small" className="leading-none">
        we may provide you with access to third-party tools over which we
        neither monitor nor have any control nor input.
        <br />
        <br />
        you acknowledge and agree that we provide access to such tools &ldquo;as
        is&rdquo; and &ldquo;as available&rdquo; without any warranties,
        representations, or conditions of any kind and without any endorsement.
        we sholl have no liability whatsoever arising from or relating to your
        use of optional third-party tools.
        <br />
        <br />
        any use by you of optional tools offered through the site is entirely at
        your own risk and discretion, and you should ensure that you are
        familiar with and approve of the terms on which tools are provided by
        the relevant third-party provider(s).
        <br />
        <br />
        we may also, in the future, offer new services and/or features through
        the website (including, the release of new tools and resources). such
        new features and/or services shall also be subject to these terms of
        service.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">8. third-party links</Text>
      <Text size="small" className="leading-none">
        certain content, products, and services available via our service may
        include materials from third-parties.
        <br />
        <br />
        third-party links on this site may direct you to third-party websites
        that are not affiliated with us. we are not responsible for examining or
        evaluating the content or accuracy, and we do not warrant and will not
        have any liability or responsibility for any third-party materials or
        websites, or for any other materials, products, or services of third-
        parties.
        <br />
        <br />
        we are not liable for any harm or damages related to the purchase or use
        of goods, services, resources, content, or any other transactions made
        in connection with any third-party websites. please review carefully the
        third-party&apos;s policies and practices and make sure you understand
        them before you engage in any transaction. complaints, claime, concerns,
        or questions regarding third-party products should be directed to the
        third-party.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">
        9. user comments, feedback, and other submissions
      </Text>
      <Text size="small" className="leading-none">
        if, at our request, you send certain specific submissions (e.g., contest
        entries) or without a request from us, you send suggestions, proposals,
        plons, or other materials, whether online, by email, by postal mail, or
        otherwise (collectively, &ldquo;comments&rdquo;) you agree that me may,
        at any time, without restriction, edit, copy, publishe, distribute,
        translate, and otherwise use in any medium any comments that you forward
        to us. we are and shall be under no obligation (1) to maintain any
        comments in confidence; (2) to pay compensation for any comments; or (3)
        to respond to any comments.
        <br />
        <br />
        we may, but have no obligation to, monitor, edit, or remove content that
        we determine in our sole discretion are unlawful, offensive,
        threatening, libelous, defamotory, pornographic, obscene, or otherwise
        objectionable or violates any party&apos;s intellectual property or
        these terms of service.
        <br />
        <br />
        you agree that your comments will not violate any right of any
        third-party, including copyright, trademark, privacy. personality, or
        other personal or proprietary right. you further agree that your
        comments will not contain libelous or otherwise unlowful, abusive, or
        obscene material, or contoin any computer virus or other malware that
        could in any way affect the operation of the service or any related
        website. you may not use a folse e-mail address, pretend to be someone
        other than yourself, or otherwise mislead us or third-parties os to the
        origin of any comments. you are solely responsible for any comments you
        make and their accuracy. we take no responsibility and assume no
        liability for any comments posted by you or any third-party.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">10. personal information</Text>
      <Text size="small" component="span" className="mb-6 block leading-none">
        your submission of personal information through the store is governed by
        our privacy policy. view our&nbsp;
        <Button variant="underlineWithColors" asChild>
          <Link href="privacy-policy">privacy policy.</Link>
        </Button>
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">11. errors, inaccuracies, and omissions</Text>
      <Text size="small" className="leading-none">
        occasionally there may be information on our site or in the service that
        contains typographical errors, inaccuracies, or omissions that may
        relate to product.
        <br />
        <br />
        descriptions, pricing, promotions, offers, product shipping charges,
        transit times, and availability. we reserve the right to correct ony
        errors, inaccuracies, or omissions, and to change or update information
        or cancel orders if any information in the service or on any related
        website is inaccurate at any time without prior notice (including after
        you have submitted your order).
        <br />
        <br />
        we undertake no obligation to update, amend, or clarify information in
        the service or any related website, except as required by law. no
        specified update or refresh date applied in the service or on any
        related website should be taken to indicate that all information in the
        service or any related website has been modified or updated.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">12. prohibited uses</Text>
      <Text size="small" className="leading-none">
        in addation to other prohibitions os set forth in the terms of service,
        you are prohibited trom using the site or ats content: (a) for any
        unlawful purpose; (b) to solicit others to perform or participate in any
        unlawful acts; a to violate any international, federal, provincial, or
        state regulations, rules, laws, or local ordinances; (d) to infringe
        upon or violate our intellectual property rights or the intellectual
        property rights of others; (e) to harass, abuse, insult, harm, defame,
        slander, disparage, intimidate, or discriminate based on gender, sexual
        orientation, religion, ethnicity, race, age, national origin, or
        disability: (f) to submit false or misleading information; (g) to upload
        or transmit viruses or any other type of malicious code that will or may
        be used in any way that will affect the functionality or operation of
        the service or of any related website, other websites, or the internet;
        (h) to collect or track the personal information of others; (1) to spam,
        phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or
        immoral purpose; or (k) to interfere with or circumvent the security
        features of the service or any related website, other websites, or the
        internet. we reserve the right to terminate your use of the service or
        any related website for violating any of the prohibited uses.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">
        13. disclaimer of warranties; limitations of liability
      </Text>
      <Text size="small" className="leading-none">
        we do not guarantee, represent, or warrant that your use of our service
        will be uninterrupted, timely, secure, or error-free.
        <br />
        <br />
        we do not warrant that the results that may be obtained from the use of
        the service will be accurate or reliable.
        <br />
        <br />
        you agree that from time to time we may remove the service for
        indefinite periods of time or cancel the service at any time, without
        notice to you.
        <br />
        <br />
        you expressly agree that your use of, or inability to use, the service
        is at your sole risk. the service and all products and services
        delivered to you through the service are (except as expressly stated by
        us) provided &apos;as is&apos; and &apos;as available&apos; for your
        use, without any representation, warranties, or conditions of any kind,
        either express or implied, including all implied warranties or
        conditions of merchantability, merchantable quality, fitness for a
        particular purpose, durability, title, and non-infringement.
        <br />
        <br />
        in no case shall grbpwr, our directors, officers, employees, affiliates,
        agents, contractors, interns, suppliers, service providers, or licensors
        be liable for any injury, loss, claim, liable for any injury, loss,
        claim, or any direct, indirect, incidental, punitive, special, or
        consequential damages of any kind, including, without limitation, lost
        profits, lost revenue, lost savings, loss of data, replacement costs, or
        any similar damages, whether based in contract, tort (including
        negligence), strict liability, or otherwise, arising from your use of
        any of the service or any products procured using the service, or for
        any other claim related in any way to your use of the service or any
        product, including, but not limited to, any errors or omissions in any
        content, or any loss or damage of any kind incurred as a result of the
        use of the service or any content (or product) posted, transmitted, or
        otherwise made available via the service, even if advised of their
        possibility. because some states or jurisdictions do not allow the
        exclusion or the limitation of liability for consequential or incidental
        damages, in such states or jurisdictions, our liability shall be limited
        to the maximum extent permitted by law.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">14. indemnification</Text>
      <Text size="small" className="leading-none">
        you agree to indemnify, defend, and hold harmless gbpwr and our parent,
        subsidiaries, affiliates, partners, officers, directors, agents,
        contractors, licensors, service providers, subcontractors, suppliers,
        interns, and employees, harmless from any claim or demand, including
        reasonable attorneys&apos; fees, made by any third-party due to or
        arising out of your breach of these terms of service or the documents
        they incorporate by reference, or your violation of any law or the
        rights of a third-party.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">15. severability</Text>
      <Text size="small" className="leading-none">
        in the event that any provision of these terms of service is determined
        to be unlawful, void, or unenforceable, such provision shall nonetheless
        be enforceable to the fullest extent permitted by applicable law, and
        the unenforceable portion shall be deemed to be severed from these terms
        of service, such determination shall not affect the validity and
        enforceability of any other remaining provisions.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
    </TextWrapper>
  );
}
