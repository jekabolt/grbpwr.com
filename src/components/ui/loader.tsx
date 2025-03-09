export function Loader() {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="h-[0.5px] w-[173px] bg-gray-200/20">
        <div className="h-full origin-left animate-[loading_0.5s_ease-out_forwards] bg-bgColor" />
      </div>
    </div>
  );
}
