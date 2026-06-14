// Sink for Content-Security-Policy violation reports while the policy runs in
// Report-Only mode (see the CSP in next.config.ts). Accepts both the legacy
// `application/csp-report` body and the modern Reporting API
// (`application/reports+json`), logs a concise line per violation, and always
// returns 204. Purely observational — remove (and the report-uri/report-to
// directives) once the policy is enforced and stable.

interface CspViolation {
  documentUri?: string;
  blockedUri?: string;
  directive?: string;
}

function normalize(report: unknown): CspViolation | null {
  if (!report || typeof report !== "object") return null;
  const r = report as Record<string, unknown>;
  // Legacy report-uri shape: { "csp-report": { "blocked-uri", ... } }
  const legacy = (r["csp-report"] ?? r) as Record<string, unknown>;
  // Reporting API shape: { type: "csp-violation", body: { blockedURL, ... } }
  const body = (r.body ?? legacy) as Record<string, unknown>;

  const blockedUri = (body["blockedURL"] ?? legacy["blocked-uri"]) as
    | string
    | undefined;
  const directive = (body["effectiveDirective"] ??
    legacy["effective-directive"] ??
    legacy["violated-directive"]) as string | undefined;
  const documentUri = (body["documentURL"] ?? legacy["document-uri"]) as
    | string
    | undefined;

  if (!blockedUri && !directive) return null;
  return { documentUri, blockedUri, directive };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const reports = Array.isArray(payload) ? payload : [payload];
    for (const report of reports) {
      const v = normalize(report);
      if (!v) continue;
      console.warn(
        `[csp-report] blocked=${v.blockedUri ?? "?"} directive=${v.directive ?? "?"} doc=${v.documentUri ?? "?"}`,
      );
    }
  } catch {
    // Malformed/non-JSON report — ignore, never error out.
  }
  return new Response(null, { status: 204 });
}
