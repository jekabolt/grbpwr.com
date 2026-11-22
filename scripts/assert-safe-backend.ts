interface BackendEnvironment {
  NODE_ENV?: string;
  NEXT_PUBLIC_BACKEND_URL?: string;
  ALLOW_PROD_BACKEND?: string;
}

const PRODUCTION_BACKEND_HOSTNAMES = [
  "api.lekalo.studio",
  "backend.grbpwr.com",
];

export function assertSafeBackendEnvironment(env: BackendEnvironment): void {
  if (env.NODE_ENV !== "development" || env.ALLOW_PROD_BACKEND === "1") {
    return;
  }

  let hostname: string;
  try {
    hostname = new URL(env.NEXT_PUBLIC_BACKEND_URL ?? "").hostname.replace(
      /\.$/,
      "",
    );
  } catch {
    return;
  }

  if (PRODUCTION_BACKEND_HOSTNAMES.includes(hostname)) {
    throw new Error(
      "Refusing to start next dev with NEXT_PUBLIC_BACKEND_URL pointing to a production backend; set ALLOW_PROD_BACKEND=1 to override.",
    );
  }
}
