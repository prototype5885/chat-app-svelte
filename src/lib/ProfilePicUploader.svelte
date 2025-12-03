<script lang="ts">
  import { onDestroy } from "svelte";
  import Pencil from "../icons/Pencil.svelte";

  const props: { picture?: string } = $props();

  let preview = $state<string>("");
  if (props.picture) {
    preview = `"/cdn/avatars/${props.picture}"`;
  }

  // const selectedPicture

  let lastBlobUrl = "";

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp"
      ) {
        if (lastBlobUrl) {
          URL.revokeObjectURL(lastBlobUrl);
        }
        lastBlobUrl = URL.createObjectURL(file);
        preview = lastBlobUrl;
        // selectedPicture = file;
      } else {
        console.warn("Unsupported file format");
      }
    }
  }

  onDestroy(() => {
    if (lastBlobUrl) {
      URL.revokeObjectURL(lastBlobUrl);
    }
  });
</script>

<div class="relative h-32 w-32 rounded-full overflow-hidden group">
  <div class="absolute inset-0 bg-center bg-cover"></div>
  <div
    class="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 duration-200 pointer-events-none"
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
