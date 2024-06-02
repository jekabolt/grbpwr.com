export default function CartProductsSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4, 5].map((v) => (
        <div
          className="h-32 w-full animate-pulse rounded-lg bg-gray-200"
          key={v}
        ></div>
      ))}
    </div>
  );
}
