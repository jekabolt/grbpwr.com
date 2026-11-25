import FilterOptionButtons from "./FilterOptionButtons";
import { useFilterSelection } from "./useFilterSelection";
import { useSizeFiltering } from "./useSizeFiltering";

export function Sizes({ gender }: { gender: string }) {
  const { sizeOptions } = useSizeFiltering();
  const { selectedValues, handleToggle } = useFilterSelection({
    filterKey: "size",
    multiSelect: true,
  });

  return (
    <FilterOptionButtons
      selectedValues={selectedValues}
      handleFilterChange={handleToggle}
      values={sizeOptions || []}
      showSeparated={true}
      gender={gender}
    />
  );
}
