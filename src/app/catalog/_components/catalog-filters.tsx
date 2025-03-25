"use client";

// import Category from "./Category";
import Size from "./Size";
import Sort from "./Sort";

export default function Filters() {
  return (
    <div className="flex flex-row items-start justify-between">
      {/* <Category /> */}
      <div className="flex w-auto gap-24">
        <Sort />
        <Size />
      </div>
    </div>
  );
}
