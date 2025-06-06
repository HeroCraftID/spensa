"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { setModalHandler } from "@/lib/modal";

type ModalType = "success" | "error" | "makesure" | "loading";

const iconMap: Record<ModalType, React.ReactNode> = {
  success: (
    <CheckCircle className="text-green-400 w-10 h-10 animate-bounce" />
  ),
  error: <XCircle className="text-red-400 w-10 h-10 animate-pulse" />,
  makesure: (
    <AlertTriangle className="text-yellow-400 w-10 h-10 animate-pulse" />
  ),
  loading: (
    <Loader2 className="animate-spin text-blue-400 w-10 h-10" />
  ),
};

export default function GlobalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<{
    title?: string;
    message?: string;
    type: ModalType;
    confirmText?: string;
    cancelText?: string;
    showCancelButton?: boolean;
    resolve?: (result: boolean) => void;
  }>({
    title: "",
    message: "",
    type: "makesure",
  });

  useEffect(() => {
    setModalHandler((opts, resolve) => {
      setOptions({ ...opts, resolve });
      setIsOpen(true);
    });
  }, []);

  const close = (result: boolean) => {
    options.resolve?.(result);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 text-white rounded-2xl shadow-xl p-6 max-w-md w-full
                      border border-zinc-700
                      animate-scaleIn">
        <div className="flex items-center gap-4 mb-4">
          {iconMap[options.type]}
          <h2 className="text-2xl font-bold">{options.title}</h2>
        </div>
        <div className="text-gray-300 text-sm">{options.message}</div>

        {options.type !== "loading" && (
          <div className="mt-6 flex justify-end gap-3">
            {options.showCancelButton && (
              <button
                onClick={() => close(false)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-5 py-2 rounded-xl transition"
              >
                {options.cancelText ?? "Cancel"}
              </button>
            )}
            <button
              onClick={() => close(true)}
              className={`px-5 py-2 rounded-xl text-white transition
              ${
                options.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : options.type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {options.confirmText ?? "OK"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
