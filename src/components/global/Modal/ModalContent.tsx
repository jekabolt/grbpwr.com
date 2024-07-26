"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function ModalContent({
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {children}
      </Modal>
    </div>
  );
}
