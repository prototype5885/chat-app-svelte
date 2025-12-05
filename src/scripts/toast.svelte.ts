export type ToastType = "info" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  message: string | undefined;
  type: ToastType;
  code: number | undefined;
}

export const toasts = $state<Toast[]>([]);

export function infoToast(message: string) {
  showToast(message, "info");
  console.log(message);
}

export function successToast(message: string) {
  showToast(message, "success");
  console.log(message);
}

export function errorToast(
  message: string,
  code: number | undefined = undefined
) {
  showToast(message, "error", code);
  console.error(message);
}

export function warningToast(message: string) {
  showToast(message, "warning");
  console.warn(message);
}

function showToast(
  message: string | undefined = undefined,
  type: ToastType,
  code: number | undefined = undefined
) {
  const id = Math.random().toString(36).substring(2);
  toasts.push({ id, message, type, code });

  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) toasts.splice(index, 1);
  }, 5000);
}
