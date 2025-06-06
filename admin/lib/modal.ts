// lib/modal.ts
type ModalOptions = {
  title?: string;
  message?: string;
  type: "success" | "error" | "makesure" | "loading";
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
};

let modalHandler: (
  options: ModalOptions,
  resolve: (result: boolean) => void
) => void = () => {};

export function setModalHandler(
  handler: (
    options: ModalOptions,
    resolve: (result: boolean) => void
  ) => void
) {
  modalHandler = handler;
}

export function modal(options: ModalOptions): Promise<boolean> {
  return new Promise((resolve) => {
    modalHandler(options, resolve);
  });
}
