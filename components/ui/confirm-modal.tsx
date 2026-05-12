"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-xl text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">{description}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`h-10 rounded-xl px-4 text-sm font-semibold text-white transition ${
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
