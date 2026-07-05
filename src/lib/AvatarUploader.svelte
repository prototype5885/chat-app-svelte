<script lang="ts">
  import { onDestroy } from "svelte";
  import { Pencil } from "@lucide/svelte";
  import {
    upload_server_avatar,
    upload_user_avatar,
  } from "../scripts/httpActions";
  import { successToast, warningToast } from "../scripts/toast.svelte";

  const props: { preview?: string | null; serverID?: bigint } = $props();

  const allowedMimes = ["image/jpeg", "image/png"];
  const allowedExt = ".jpg,.jpeg,.png";

  let selectedFile = $state<File | null>(null);
  let preview = $derived<string>(
    props.preview ? `/avatars/${props.preview}` : "",
  );
  let lastBlobUrl = "";

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
      if (allowedMimes.includes(selectedFile.type)) {
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

  async function changeAvatar() {
    let name: string | null = null;
    if (props.serverID) {
      name = await upload_server_avatar(selectedFile, props.serverID);
      successToast("Server avatar changed!");
    } else {
      name = await upload_user_avatar(selectedFile);
      successToast("User avatar changed!");
    }

    preview = name ? `/avatars/${name}` : "";
    selectedFile = null;
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
      accept={allowedExt}
      onchange={handleFileSelect}
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
  </div>

  {#if selectedFile}
    <button
      onclick={changeAvatar}
      class="bg-blue-500 rounded disabled:bg-black/20 py-1 px-2"
    >
      Upload
    </button>
  {:else if preview}
    <button
      onclick={changeAvatar}
      class="bg-red-500 rounded disabled:bg-black/20 py-1 px-2"
    >
      Remove avatar
    </button>
  {/if}
</div>
