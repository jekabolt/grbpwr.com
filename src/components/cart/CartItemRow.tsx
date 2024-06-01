export default function CartItemRow() {
  return (
    <div className="flex justify-between text-textColor">
      <div className="flex w-1/2 gap-6">
        <div className="h-full w-28 bg-white"></div>
        <div className="space-y-2">
          <p className="text-md">Scarf sous cropped</p>
          <p className="text-sm">Olive</p>
          <p className="text-xs">xs</p>
        </div>
      </div>
      <div className="flex w-1/2 flex-col items-end space-y-2">
        <p className="text-md">BTC 0.000015</p>
        <p className="text-xs line-through">BTC 0.000015</p>
      </div>
    </div>
  );
}
