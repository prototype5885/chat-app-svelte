<script lang="ts">
  import { toasts } from "../scripts/toast.svelte";

  function toastType(type: string) {
    switch (type) {
      case "error":
        return "bg-red-700 text-white";
      case "info":
        return "bg-blue-700 text-white";
      case "success":
        return "bg-green-700 text-white";
      case "warning":
        return "bg-yellow-400 text-black";
    }
  }
</script>

<div class="fixed bottom-5 right-5 flex flex-col gap-2.5 z-50 w-72">
  {#each toasts as toast (toast.id)}
    <div class={["px-5 py-3 rounded-md flex flex-col", toastType(toast.type)]}>
      {#if toast.code}
        <b class="mb-2">Status code: {toast.code}</b>
      {/if}
      {#if toast.message}
        <span>{toast.message}</span>
      {/if}
    </div>
  {/each}
</div>
