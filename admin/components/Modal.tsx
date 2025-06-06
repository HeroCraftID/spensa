import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

type ModalType = "success" | "error" | "makesure" | "loading";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  type?: ModalType;
};

const iconMap: Record<ModalType, React.ReactNode> = {
  success: <CheckCircle className="text-green-500 w-8 h-8" />,
  error: <XCircle className="text-red-500 w-8 h-8" />,
  makesure: <AlertTriangle className="text-yellow-500 w-8 h-8" />,
  loading: <Loader2 className="animate-spin text-blue-500 w-8 h-8" />,
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = "makesure",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          {iconMap[type]}
          {title && <h2 className="text-xl font-bold">{title}</h2>}
        </div>
        <div className="text-sm">{children}</div>

        {type !== "loading" && (
          <div className="mt-6 flex justify-end gap-2">
            {type === "makesure" && (
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700 text-black dark:text-white px-4 py-2 rounded-xl"
              >
                Batal
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-white ${
                type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {type === "makesure" ? "Lanjutkan" : "Tutup"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
