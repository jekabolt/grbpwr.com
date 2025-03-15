export function Loader() {
  return (
    <div className="flex w-full justify-center p-2">
      <div className="relative h-[0.5px] w-full overflow-hidden bg-gray-200/20 lg:w-[175px]">
        <div className="absolute left-0 top-0 h-full w-full animate-[loading_1s_ease-out_forwards] bg-textColor" />
      </div>
    </div>
  );
}
