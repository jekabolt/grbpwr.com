"use client";

import Category from "./Category";
import Size from "./Size";
import Sort from "./Sort";

export default function Filters() {
  return (
    <div className="flex flex-col items-start gap-6 pb-3 lg:flex-row lg:justify-between lg:pb-8">
      <Category />
      <div className="flex w-auto gap-24">
        <Sort />
        <Size />
      </div>
    </div>
  );
}
