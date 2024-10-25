"use client";

import Category from "./Category";
import Order from "./Order";
import Size from "./Size";
import Sort from "./Sort";

export default function Filters() {
  return (
    <div>
      <div className="flex w-full justify-between pb-8 pt-4">
        <Category />
        <div className="flex gap-8 lg:gap-24">
          <Order />
          <Sort />
          <Size sizeId={1} />
        </div>
      </div>
    </div>
  );
}
