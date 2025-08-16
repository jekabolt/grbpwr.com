"use client";

import type {
  common_ProductMeasurement,
  common_ProductSize,
} from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { SizesTable } from "./sizes-table";
import { MeasurementType } from "./utils/useMeasurementType";

export enum Unit {
  CM = "CM",
  INCHES = "INCHES",
}

export function MeasurementsTable({
  selectedSize,
  type,
  measurements,
  unit,
  sizes,
  handleSelectSize,
}: Props) {
  const { dictionary } = useDataContext();

  const measurementsWithNames = measurements.map((measurement) => {
    const name = dictionary?.measurements?.find(
      (m: any) => m.id === measurement.measurementNameId,
    )?.name;
    return {
      name,
      ...measurement,
    };
  });

  const measurementsForSelectedSize = measurementsWithNames
    .filter((m) => m.productSizeId === selectedSize)
    .map(({ name, measurementValue }) => ({
      name,
      value: getUnit(measurementValue?.value || "", unit),
    }));

  if (type === "clothing") {
    return measurementsForSelectedSize.map((m, index) => (
      <div
        key={index}
        className="flex items-center justify-between px-1 py-2.5 odd:bg-textInactiveColor"
      >
        <Text>{m.name}</Text>
        <Text>{m.value}</Text>
      </div>
    ));
  }

  if (type === "shoe" || type === "ring") {
    return (
      <div className="h-[calc(100vh-200px)] w-full">
        <SizesTable
          sizes={sizes}
          type={type}
          handleSelectSize={handleSelectSize}
        />
      </div>
    );
  }
}

function getUnit(value: string, unit: Unit) {
  if (unit === Unit.CM) {
    return `${value} CM`;
  }

  return `${(parseInt(value) * 0.393701).toFixed(1)} IN`;
}

type Props = {
  selectedSize?: number;
  unit: Unit;
  type: MeasurementType;
  measurements: common_ProductMeasurement[];
  sizes: common_ProductSize[];
  handleSelectSize: (sizeId: number) => void;
};
