import { StorefrontColorway } from "@/api/proto-http/frontend";

// Model-wears info (height + size) is not part of the lean storefront colourway
// projection (R3), so the "model is 180cm and wears size M" line degrades to
// absent. Kept as a hook so callers keep their shape.
export function useModelInfo(_: { product: StorefrontColorway }) {
  return {
    modelWear: "",
  };
}
