"use client";

import { useState } from "react";
import type { common_ProductSize } from "@/api/proto-http/frontend";

import { cn, formatSizeData } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

type SizesTableProps = {
  sizes: common_ProductSize[];
  type: "shoe" | "ring";
  selectedSize?: number;
  handleSelectSize: (sizeId: number) => void;
};

type HeaderCell = "eu" | "us" | "uk" | "cm";

export function SizesTable({
  sizes,
  type,
  selectedSize,
  handleSelectSize,
}: SizesTableProps) {
  const { dictionary } = useDataContext();

  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const sizeData = formatSizeData(sizes, type, dictionary?.sizes || []);
  const hideCM = type === "ring";

  const headerCells: HeaderCell[] = hideCM
    ? ["eu", "us", "uk"]
    : ["eu", "us", "uk", "cm"];

  const handleMouseEnterColumn = (columnIndex: number) => {
    setHoveredCol(columnIndex);
  };

  const handleMouseLeaveTable = () => {
    setHoveredCol(null);
  };

  return (
    <table
      onMouseLeave={handleMouseLeaveTable}
      className="w-full border-separate border-spacing-0"
    >
      <thead>
        <tr className="sticky top-0 bg-bgColor">
          {headerCells.map((cell, colId) => (
            <th
              key={colId}
              className={cn(
                "border-x border-t border-transparent p-2 text-center",
                {
                  "border-highlightColor": hoveredCol === colId,
                },
              )}
              onMouseEnter={() => handleMouseEnterColumn(colId)}
            >
              <Text variant="uppercase">{cell}</Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sizeData.map((row, rowId) => {
          const isSelectedRow = row?.id === selectedSize;

          return (
            <tr
              key={`${row?.id}-${rowId}`}
              className={cn(
                "cursor-pointer odd:bg-textInactiveColor hover:bg-highlightColor",
                {
                  "bg-highlightColor odd:bg-highlightColor": isSelectedRow,
                },
              )}
              onClick={() => handleSelectSize(row?.id || 0)}
            >
              {headerCells.map((cell, colId) => (
                <td
                  key={colId}
                  className={cn("border-x border-transparent p-2 text-center", {
                    "border-highlightColor":
                      hoveredCol === colId || isSelectedRow,
                    "border-b":
                      (rowId === sizeData.length - 1 && hoveredCol === colId) ||
                      (rowId === sizeData.length - 1 && isSelectedRow),
                  })}
                  onMouseEnter={() => handleMouseEnterColumn(colId)}
                >
                  <Text>{row?.[cell]}</Text>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
