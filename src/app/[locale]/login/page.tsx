import { redirect } from "next/navigation";
import {
  getMagicLinkToken,
  getSafeRelativeRedirect,
} from "@/lib/storefront-account/magic-link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    token?: string;
    magic_token?: string;
    magicToken?: string;
    next?: string;
    redirect_to?: string;
  }>;
};

export default async function LoginMagicPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const qs = await searchParams;

  const token = getMagicLinkToken(qs);
  const redirectTo = getSafeRelativeRedirect(
    qs.redirect_to ?? qs.next,
    `/${locale}/account`,
  );

  if (!token) {
    redirect(`${redirectTo}?login_error=missing_token`);
  }

  const verifyUrl = new URL("/api/account/login/verify-magic", "http://localhost");
  verifyUrl.searchParams.set("token", token);
  verifyUrl.searchParams.set("redirect_to", redirectTo);

  redirect(`${verifyUrl.pathname}?${verifyUrl.searchParams.toString()}`);
}
