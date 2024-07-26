export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50  bg-black">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 cursor-pointer text-2xl text-white"
      >
        [closeIcon]
      </button>
      <div className="h-full w-full pt-20">{children}</div>
    </div>
  );
}
