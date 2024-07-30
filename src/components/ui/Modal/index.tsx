"use client";

import { useState } from "react";

export default function Modal({
  children,
  openElement,
}: {
  children: React.ReactNode;
  openElement: React.ReactNode;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div onClick={openModal}>{openElement}</div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-textColor">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 cursor-pointer text-buttonTextColor"
          >
            [closeIcon]
          </button>
          {children}
        </div>
      )}
    </div>
  );
}
