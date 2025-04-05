import { useEffect, useState } from "react";

const CustomCursor = ({
  onClose,
  containerRef,
}: {
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        setIsVisible(isInside);
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, [containerRef]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        fontSize: "var(--text-base)",
        color: "var(--text)",
      }}
      onClick={onClose}
    >
      [x]
    </div>
  );
};

export default CustomCursor;
