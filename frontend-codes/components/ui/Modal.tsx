"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          rounded-xl
          border
          border-border
          bg-background
          p-6
          shadow-xl
          text-foreground
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="
            absolute
            right-3
            top-3
            rounded-md
            p-1
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
            transition
          "
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};