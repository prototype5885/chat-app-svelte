<script lang="ts">
  import { z } from "zod";
  import { File } from "@lucide/svelte";
  import { AttachmentSchema } from "../scripts/schemas";

  let {
    attachments,
  }: { attachments: z.infer<ReturnType<typeof AttachmentSchema.array>> } =
    $props();

  function isImage(url: string) {
    return /\.(jpg|jpeg|webp|png|gif)$/i.test(url);
  }
</script>

<div class="flex flex-wrap gap-1 mt-1">
  {#each attachments as attachment}
    {#if isImage(attachment.file)}
      <img
        src={`/attachments/${attachment.file}`}
        alt={attachment.name}
        class="rounded-md h-64 object-cover"
      />
    {:else}
      <a
        href={`/attachments/${attachment.file}`}
        target="_blank"
        class="flex items-center gap-2 px-3 py-2 rounded-md border border-color bg-white/5 hover:bg-white/10 text-sm max-w-64"
      >
        <File />
        <span class="truncate opacity-80">{attachment.name}</span>
      </a>
    {/if}
  {/each}
</div>
