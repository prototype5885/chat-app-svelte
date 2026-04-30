import { toast } from "@zerodevx/svelte-toast";

export type ToastType = "info" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  message: string | undefined;
  type: ToastType;
  name: string | undefined;
}

export function infoToast(message: string) {
  toast.push(message, {
    duration: 5_000,
    pausable: true,
    theme: {
      "--toastBackground": "rgb(29 78 216)",
      "--toastBarBackground": "white",
    },
  });
  console.log(message);
}

export function successToast(message: string) {
  toast.push(message, {
    duration: 5_000,
    pausable: true,
    theme: {
      "--toastBackground": "rgb(21 128 61)",
      "--toastBarBackground": "white",
    },
  });
  console.log(message);
}

export function errorToast(message: string, throwError: boolean = true) {
  toast.push(message, {
    duration: 5_000,
    pausable: true,
    theme: {
      "--toastBackground": "rgb(185 28 28)",
      "--toastBarBackground": "white",
    },
  });
  if (throwError) {
    throw new Error(message);
  }
}

export function warningToast(message: string) {
  toast.push(message, {
    duration: 5_000,
    pausable: true,
    theme: {
      "--toastBackground": "rgb(250 204 21)",
      "--toastBarBackground": "black",
      "--toastColor": "black",
    },
  });
  console.warn(message);
}
