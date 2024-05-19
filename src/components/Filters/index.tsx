import GenericPopover from "@/components/ui/Popover";

export default function Filters() {
  return (
    <div>
      <div className="flex w-full justify-between pb-8 pt-4">
        <CategoryGilter />
        <div className="flex gap-8 lg:gap-24">
          <SortFilter />
          <SizeFilter />
        </div>
      </div>
    </div>
  );
}

function CategoryFilterTrigger() {
  return (
    <div className="flex gap-2">
      <span className="underline">a11</span>
      {" / "}
      <span>man</span>
      {" / "}
      <span>women</span>
    </div>
  );
}

function CategoryGilter() {
  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "start",
      }}
      title="women / men"
      openElement={<CategoryFilterTrigger />}
    >
      <div className="space-y-2 px-12 pb-7">clothing / accessoires options</div>
    </GenericPopover>
  );
}

function SortFilterTrigger() {
  return (
    <div>
      sort_by <span className="underline">latest arrival</span>
    </div>
  );
}

function SortFilter() {
  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "end",
      }}
      title="sort_by"
      openElement={<SortFilterTrigger />}
    >
      <div className="min-w-36 text-small space-y-2 px-8 pb-5">
        <p>price: low to high</p>
        <p>price: high to low</p>
        <p>on sale</p>
        <p>latest arrivals</p>
        <p>trending</p>
      </div>
    </GenericPopover>
  );
}

function SizeFilterTrigger() {
  return <div>filter +</div>;
}

function SizeFilter() {
  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "end",
      }}
      title="filter"
      openElement={<SizeFilterTrigger />}
    >
      <div className="min-w-36 text-small space-y-2 px-8 pb-5">
        <p className="mb-2">size:</p>
        <p>xxs</p>
        <p>xs</p>
        <p>s</p>
        <p>m</p>
        <p>l</p>
        <p>lg</p>
        <p>xl</p>
        <p>xxl</p>
        <p>os</p>
      </div>
    </GenericPopover>
  );
}
