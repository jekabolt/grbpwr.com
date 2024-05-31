"use client";

type Props = {
  addItemToCookie: (slug: string) => Promise<void>;
  slug: string;
};

export default function AddToCartButton({ addItemToCookie, slug }: Props) {
  async function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await addItemToCookie(slug);
  }

  return (
    <button
      onClick={handleButtonClick}
      className="block w-36 bg-textColor px-1.5 text-center text-sm text-buttonTextColor"
    >
      add to cart
    </button>
  );
}
