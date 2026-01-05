<script lang="ts">
  import { onDestroy } from "svelte";
  import Pencil from "../icons/Pencil.svelte";
  import {
    upload_server_avatar,
    upload_user_avatar,
  } from "../scripts/httpActions";
  import { successToast, warningToast } from "../scripts/toast.svelte";

  const props: { preview?: string | null; serverID?: string } = $props();

  let selectedFile = $state<File | null>(null);
  let preview = $state<string>("");
  let lastBlobUrl = "";

  if (props.preview) {
    preview = `/avatars/${props.preview}.webp`;
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
      if (
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/webp"
      ) {
        if (lastBlobUrl) {
          URL.revokeObjectURL(lastBlobUrl);
        }
        lastBlobUrl = URL.createObjectURL(selectedFile);
        preview = lastBlobUrl;
      } else {
        warningToast("Unsupported file format");
      }
    }
  }

  async function uploadAvatar() {
    if (!selectedFile) return;

    if (props.serverID) {
      await upload_server_avatar(selectedFile, props.serverID);
      successToast("Server avatar changed!");
    } else {
      await upload_user_avatar(selectedFile);
      successToast("User avatar changed!");
    }

    selectedFile = null;
  }

  async function removeAvatar() {
    if (props.serverID) {
      await upload_server_avatar(null, props.serverID);
      successToast("Server avatar removed!");
    } else {
      await upload_user_avatar(null);
      successToast("User avatar removed!");
    }
    preview = "";
  }

  onDestroy(() => {
    if (lastBlobUrl) {
      URL.revokeObjectURL(lastBlobUrl);
    }
  });
</script>

<div class="flex flex-col items-center gap-4">
  <div
    class="relative h-32 w-32 rounded-full overflow-hidden group border-2 border-blue-500"
  >
    <img
      src={preview}
      alt=" "
      class="aspect-square h-full w-full object-cover
        flex justify-center items-center bg-black/25
        group-hover:brightness-60 brightness-100"
    />

    <div
      class={[
        "absolute inset-0 flex items-center justify-center pointer-events-none text-white",
        `${!preview ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
      ]}
    >
      <Pencil />
    </div>
    <input
      type="file"
      accept=".jpg,.jpeg,.png,.webp"
      onchange={handleFileSelect}
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
  </div>

  {#if selectedFile}
    <button
      onclick={uploadAvatar}
      class="bg-blue-500 rounded disabled:bg-black/20 py-1 px-2"
    >
      Upload
    </button>
  {:else if preview}
    <button
      onclick={removeAvatar}
      class="bg-red-500 rounded disabled:bg-black/20 py-1 px-2"
    >
      Remove avatar
    </button>
  {/if}
</div>
