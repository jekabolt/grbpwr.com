import { common_ProductFull } from "@/api/proto-http/frontend";
import { CARE_INSTRUCTIONS_MAP } from "@/constants";

export function useGarmentInfo({ product }: { product: common_ProductFull }) {
  const productBody =
    product.product?.productDisplay?.productBody?.productBodyInsert;

  const { formatted: composition, structured: compositionStructured } =
    formatCompositionBySections(productBody?.composition || "");

  const careCodes = productBody?.careInstructions
    ?.split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const care = careCodes?.map((code) => CARE_INSTRUCTIONS_MAP[code] || code);

  return {
    composition,
    compositionStructured,
    careCodes,
    care,
  };
}

export type CompositionItem = { code: string; percent: number };
export type CompositionSections = Record<string, CompositionItem[]>;

function formatCompositionBySections(jsonString: string): {
  formatted: string;
  structured: CompositionSections | null;
} {
  try {
    const data = JSON.parse(jsonString) as CompositionSections;

    const sectionNames: Record<string, string> = {
      body: "Body",
      part: "Part",
      trim: "Trim",
      lining: "Lining",
      drawcord: "Drawcord",
      pocket_bag: "Pocket bag",
      interlining: "Interlining",
      facing: "Facing",
    };

    const formattedSections: string[] = [];

    Object.keys(data).forEach((key) => {
      const items = (data[key] || []).filter((item) => item.percent > 0);
      if (items.length > 0) {
        const materials = items
          .map((item) => `${item.code} ${item.percent}%`)
          .join(", ");
        const sectionName = sectionNames[key] || key;
        formattedSections.push(`${sectionName}: ${materials}`);
      }
    });

    return { formatted: formattedSections.join("\n"), structured: data };
  } catch (error) {
    return { formatted: jsonString, structured: null };
  }
}
