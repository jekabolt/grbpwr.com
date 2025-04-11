"use client";

import { RING_SIZE_CONVERSION, SHOES_SIZE_CONVERSION } from "@/constants";

import { Text } from "@/components/ui/text";

type SizeConversionType = "shoe" | "ring";

type SizeData = {
  id: number;
  name: string;
};

type SizesTableProps = {
  availableSizeData: SizeData[];
  conversionType: SizeConversionType;
  handleSelectSize: (sizeId: number) => void;
};

export function SizesTable({
  availableSizeData,
  conversionType,
  handleSelectSize,
}: SizesTableProps) {
  const sizeData = formatSizeData(availableSizeData, conversionType);
  const hideCM = conversionType === "ring";
  const headerCells = hideCM ? ["EU", "US", "UK"] : ["EU", "US", "UK", "CM"];

  return (
    <div className="h-full w-full overflow-auto">
      <table className="group w-full border-collapse">
        <thead>
          <tr className="sticky top-0 bg-white">
            {headerCells.map((cell) => (
              <th className="p-2 text-center font-normal" key={cell}>
                <Text variant="uppercase">{cell}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizeData.map((row) => (
            <tr
              key={row?.id}
              className="cursor-pointer even:bg-textInactiveColor hover:bg-highlightColor"
              onClick={() => handleSelectSize(row?.id || 0)}
            >
              <td className="p-2 text-center">
                <Text>{row?.eu}</Text>
              </td>
              <td className="p-2 text-center">
                <Text>{row?.us}</Text>
              </td>
              <td className="p-2 text-center">
                <Text>{row?.uk}</Text>
              </td>
              {!hideCM && (
                <td className="p-2 text-center">
                  <Text>{row?.cm}</Text>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatSizeData(
  availableSizeData: SizeData[],
  conversionType: SizeConversionType,
) {
  const conversionTable =
    conversionType === "shoe" ? SHOES_SIZE_CONVERSION : RING_SIZE_CONVERSION;

  const formattedData = availableSizeData.map((sizeData) => {
    const conversionData = Object.values(conversionTable).find(
      (data) => data.EU === sizeData.name,
    );

    if (!conversionData) return null;

    return {
      id: sizeData.id,
      eu: conversionData.EU,
      us: conversionData.US,
      uk: conversionData.UK,
      cm: conversionData.CM,
    };
  });

  return formattedData.sort(
    (a, b) => parseFloat(a?.eu || "") - parseFloat(b?.eu || ""),
  );
}
