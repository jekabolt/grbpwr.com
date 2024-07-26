"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function ModalContent({
  children,
  modalChildren,
}: {
  children: React.ReactNode;
  modalChildren: React.ReactNode;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div onClick={openModal}>{children}</div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalChildren}
      </Modal>
    </div>
  );
}
