"use client";

import type { common_ProductSize } from "@/api/proto-http/frontend";

import { formatSizeData } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

type SizesTableProps = {
  sizes: common_ProductSize[];
  type: "shoe" | "ring";
  handleSelectSize: (sizeId: number) => void;
};

type HeaderCell = "eu" | "us" | "uk" | "cm";

export function SizesTable({ sizes, type, handleSelectSize }: SizesTableProps) {
  const { dictionary } = useDataContext();

  const sizeData = formatSizeData(sizes, type, dictionary?.sizes || []);
  const hideCM = type === "ring";

  const headerCells: HeaderCell[] = hideCM
    ? ["eu", "us", "uk"]
    : ["eu", "us", "uk", "cm"];

  return (
    <div className="h-full w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="sticky top-0 bg-bgColor">
            {headerCells.map((cell, id) => (
              <th className="p-2 text-center" key={id}>
                <Text variant="uppercase">{cell}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizeData.map((row, id) => (
            <tr
              key={`${row?.id}-${id}`}
              className="cursor-pointer odd:bg-textInactiveColor hover:bg-highlightColor"
              onClick={() => handleSelectSize(row?.id || 0)}
            >
              {headerCells.map((cell, id) => (
                <td key={id} className="p-2 text-center">
                  <Text>{row?.[cell]}</Text>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
