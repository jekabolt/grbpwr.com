import { NextResponse } from "next/server";

import type {
  ShoppingPreferenceEnum,
  UpdateAccountRequest,
  googletype_Date,
} from "@/api/proto-http/frontend";
import { EMAIL_PREFERENCES } from "@/constants";
import { updateAccountResponse } from "@/lib/storefront-account/account-update";

function parseBirthDate(raw: unknown): googletype_Date | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "object" || raw === null) return undefined;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.year !== "number" ||
    typeof o.month !== "number" ||
    typeof o.day !== "number" ||
    !Number.isFinite(o.year) ||
    !Number.isFinite(o.month) ||
    !Number.isFinite(o.day)
  ) {
    return undefined;
  }
  return { year: o.year, month: o.month, day: o.day };
}

const ALLOWED_SHOPPING_PREFERENCES = new Set<string>(
  Object.values(EMAIL_PREFERENCES),
);

function isShoppingPreferenceEnum(v: unknown): v is ShoppingPreferenceEnum {
  return typeof v === "string" && ALLOWED_SHOPPING_PREFERENCES.has(v);
}

export async function POST(req: Request) {
  const raw = (await req.json()) as Record<string, unknown>;
  const body: UpdateAccountRequest = {};

  if (raw.phone !== undefined) {
    if (typeof raw.phone !== "string") {
      return NextResponse.json({ error: "phone must be a string" }, { status: 400 });
    }
    body.phone = raw.phone;
  }
  if (raw.firstName !== undefined && typeof raw.firstName === "string") {
    body.firstName = raw.firstName;
  }
  if (raw.lastName !== undefined && typeof raw.lastName === "string") {
    body.lastName = raw.lastName;
  }
  if (raw.defaultCountry !== undefined && typeof raw.defaultCountry === "string") {
    body.defaultCountry = raw.defaultCountry;
  }
  if (raw.defaultLanguage !== undefined && typeof raw.defaultLanguage === "string") {
    body.defaultLanguage = raw.defaultLanguage;
  }

  if (raw.birthDate !== undefined) {
    const birthDate = parseBirthDate(raw.birthDate);
    if (!birthDate) {
      return NextResponse.json({ error: "invalid birthDate" }, { status: 400 });
    }
    body.birthDate = birthDate;
  }

  if (raw.subscribeNewArrivals !== undefined) {
    if (typeof raw.subscribeNewArrivals !== "boolean") {
      return NextResponse.json({ error: "subscribeNewArrivals must be boolean" }, { status: 400 });
    }
    body.subscribeNewArrivals = raw.subscribeNewArrivals;
  }

  if (raw.shoppingPreference !== undefined) {
    if (!isShoppingPreferenceEnum(raw.shoppingPreference)) {
      return NextResponse.json({ error: "invalid shoppingPreference" }, { status: 400 });
    }
    body.shoppingPreference = raw.shoppingPreference;
  }

  if (raw.subscribeNewsletter !== undefined) {
    if (typeof raw.subscribeNewsletter !== "boolean") {
      return NextResponse.json({ error: "subscribeNewsletter must be boolean" }, { status: 400 });
    }
    body.subscribeNewsletter = raw.subscribeNewsletter;
  }

  if (raw.subscribeEvents !== undefined) {
    if (typeof raw.subscribeEvents !== "boolean") {
      return NextResponse.json({ error: "subscribeEvents must be boolean" }, { status: 400 });
    }
    body.subscribeEvents = raw.subscribeEvents;
  }

  if (Object.keys(body).length === 0) {
    return NextResponse.json({ error: "no valid fields" }, { status: 400 });
  }

  return updateAccountResponse(body);
}
