declare module "*.webp" {
  const image: import("next/image").StaticImageData;
  export default image;
}
