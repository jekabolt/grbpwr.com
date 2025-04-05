"use client";

import type { common_ProductMeasurement } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/DataContext";
import { Text } from "@/components/ui/text";

export enum Unit {
  CM = "CM",
  INCHES = "INCHES",
}

export function MeasurementsTable({
  selectedSize,
  type,
  measurements,
  unit,
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
    if (!selectedSize) {
      return <div>mock table when no size selected</div>;
    }

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

  if (type === "shoe") {
    return <div>MeasurementsTable</div>;
  }

  if (type === "ring") {
    return <div>MeasurementsTable</div>;
  }

  return <div>MeasurementsTable</div>;
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
  type: "shoe" | "clothing" | "ring";
  measurements: common_ProductMeasurement[];
};
