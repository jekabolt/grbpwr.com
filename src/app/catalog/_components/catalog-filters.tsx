"use client";

import Category from "./Category";
import Size from "./Size";
import Sort from "./Sort";

export default function Filters() {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Category />
      </div>
      <div className="flex shrink-0 gap-24">
        <Sort />
        <Size />
      </div>
    </div>
  );
}
