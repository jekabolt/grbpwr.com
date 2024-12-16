"use client";

import { useState } from "react";
import { Slot } from "@radix-ui/react-slot";

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
        <div className="absolute left-0 top-0 z-50 h-full w-full ">
          <button
            onClick={closeModal}
            className="absolute right-0 top-0 cursor-pointer"
          >
            [X]
          </button>
          {/* @ts-ignore */}
          <Slot setModalOpen={setModalOpen}>{children}</Slot>
        </div>
      )}
    </div>
  );
}
