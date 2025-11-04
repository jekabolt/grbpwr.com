import FilterOptionButtons from "./FilterOptionButtons";
import { useFilterSelection } from "./useFilterSelection";
import { useSizeFiltering } from "./useSizeFiltering";

export function Sizes({ topCategoryId, gender }: Props) {
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
      topCategoryId={topCategoryId?.toString()}
      showSeparated={true}
      gender={gender}
    />
  );
}

interface Props {
  topCategoryId?: number;
  gender: string;
}
