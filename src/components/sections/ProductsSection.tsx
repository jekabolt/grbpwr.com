import ProductsSectionItem from "./ProductsSectionItem";

export default function GridWithEmptySpots({ products }: { products?: any[] }) {
  const gridItems = [];
  let insertedEmptyCount = 0;

  if (!products) return null;
  for (let i = 0; i < products.length; i++) {
    if (shouldInsertEmpty(i + insertedEmptyCount)) {
      insertedEmptyCount++;
      gridItems.push(<div key={`empty-${i}`} className="col-span-1"></div>);
    }
    gridItems.push(
      <div key={i} className="relative col-span-1">
        <ProductsSectionItem product={products[i]} />
      </div>,
    );
  }

  return <div className="grid grid-cols-4 gap-5">{gridItems}</div>;
}

function shouldInsertEmpty(index: number) {
  const row = Math.floor(index / 4) % 6;
  const column = index % 4;
  switch (row) {
    case 0:
      if (column === 2) {
        return true;
      }
      break;
    case 1:
      if (column === 1) {
        return true;
      }
      break;
    case 2:
      if (column === 0) {
        return true;
      }
      break;
    case 3:
      if (column === 1) {
        return true;
      }
      break;
    case 4:
      if (column === 2) {
        return true;
      }
      break;
    case 5:
      if (column === 3) {
        return true;
      }
      break;
  }
  return false;
}
