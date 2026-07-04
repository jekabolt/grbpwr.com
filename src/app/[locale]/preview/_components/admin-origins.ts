// Origins allowed to embed the /preview/* iframes and push editor drafts into
// them — used both as the incoming-message origin gate and as the postMessage
// target list. Keep in sync with the `frame-ancestors` allowlist for /preview/*
// in next.config.ts (previewFrameAncestors). localhost is harmless in prod (no
// such parent exists there) but lets the admin dev server frame a local build.
export const ADMIN_ORIGINS = [
  "https://admin.grbpwr.com",
  "https://admin.beta.grbpwr.com",
  "http://localhost:4040",
];
