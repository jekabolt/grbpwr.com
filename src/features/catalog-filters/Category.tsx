"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";
import GenericPopover from "@/components/ui/popover";
import useFilterQueryParams from "./useFilterQueryParams";
import FilterOptionButtons from "./FilterOptionButtons";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return <div>{defaultValue}</div>;
}

export default function Category() {
  const { dictionary } = useHeroContext();
  const {
    defaultValue: defaultCategory,
    handleFilterChange: handleCategoryChange,
  } = useFilterQueryParams("category");
  const {
    defaultValue: defaultGender,
    handleFilterChange: handleGenderChange,
  } = useFilterQueryParams("gender");

  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "start",
      }}
      title="categories"
      openElement={
        <Trigger
          defaultValue={`${defaultCategory || "all categories"} / ${defaultGender || "all genders"}`}
        />
      }
    >
      <div className="mb-8">
        <FilterOptionButtons
          defaultOptionText="all"
          defaultValue={defaultCategory || ""}
          handleFilterChange={handleCategoryChange}
          values={dictionary?.categories || []}
        />
      </div>

      <div className="mb-8">
        <div className="mb-4">gender</div>
        <FilterOptionButtons
          defaultValue={defaultGender || ""}
          handleFilterChange={handleGenderChange}
          values={dictionary?.genders || []}
          defaultOptionText="all"
        />
      </div>
    </GenericPopover>
  );
}
