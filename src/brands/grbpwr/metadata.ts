// grbpwr pack: metadata pieces that need the bundler (static image import).
import logo from "../../../public/brands/grbpwr/app-logo.webp";

/** Default og / twitter image, as before lekalo (hashed static asset). */
export const GRBPWR_OG_IMAGE_URL = logo.src;

/** Home page link preview: the brand logo, not the hero. */
export const GRBPWR_HOME_OG = {
  imageUrl: "/app-logo.webp",
  imageWidth: 512,
  imageHeight: 512,
  imageAlt: "GRBPWR",
} as const;

export const GRBPWR_HOME_TITLE = "GRBPWR — Ready-to-wear & Archive";

export const GRBPWR_ICONS = {
  icon: "/favicon.ico",
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
};
