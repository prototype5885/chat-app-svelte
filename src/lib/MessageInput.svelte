<script lang="ts">
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { create_message, typing } from "../scripts/httpActions";
  import AutoResizeTextarea from "./AutoResizeTextarea.svelte";
  import Plus from "../icons/Plus.svelte";
  import { onDestroy } from "svelte";
  import Trash from "../icons/Trash.svelte";

  let chatInput = $state<string>("");
  let isTyping = false;

  async function sendMessage() {
    if (chatInput === "") return;
    if (!currentChannel.value) {
      errorToast("Can't send chat message, there is no channel selected");
      return;
    }

    await create_message(currentChannel.value.id, chatInput);

    chatInput = "";
  }

  async function typingValueChanged(value: "start" | "stop") {
    if (!currentChannel.value) {
      errorToast("Can't send typing, there is no channel selected");
      return;
    }
    await typing(currentChannel.value.id, value);
  }

  $effect(() => {
    chatInput;

    if (chatInput !== "" && !isTyping) {
      isTyping = true;
      typingValueChanged("start");
    } else if (chatInput === "" && isTyping) {
      isTyping = false;
      typingValueChanged("stop");
    }
  });

  // attachments
  interface Attachment {
    link: string | null;
    name: string;
    file: File;
  }

  let fileInput: HTMLInputElement | undefined = $state();
  let attachments = $state<Attachment[]>([]);

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        if (
          file.type === "image/apng" ||
          file.type === "image/avif" ||
          file.type === "image/gif" ||
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/svg+xml" ||
          file.type === "image/webp"
        ) {
          attachments.push({
            link: URL.createObjectURL(file),
            name: file.name,
            file: file,
          });
        } else {
          attachments.push({ link: null, name: file.name, file: file });
        }
      });
    }
  }

  function triggerFileInput() {
    fileInput!.click();
  }

  onDestroy(() => {
    attachments.forEach((attachment) => {
      if (attachment.link) {
        URL.revokeObjectURL(attachment.link);
      }
    });
  });
</script>

<div class="px-2 pb-2 relative w-full">
  <div
    class="flex rounded-lg bg-white/3 border border-color overflow-hidden px-2"
  >
    <div class="flex flex-col w-full">
      <!-- attachments preview list -->
      {#if attachments.length > 0}
        <div class="flex flex-row py-4 gap-4 border-b border-white/5">
          {#each attachments as attachment, index}
            <div
              class="group relative h-48 w-48 flex-none border border-white/10 rounded-md overflow-hidden bg-black/20"
            >
              <div class="h-full w-full flex items-center justify-center">
                {#if attachment.link}
                  <img
                    class="h-full w-full object-contain"
                    src={attachment.link}
                    alt={attachment.name}
                  />
                {:else}
                  <div class="text-white/40 text-sm">No Preview</div>
                {/if}
              </div>

              <div
                class="absolute bottom-0 left-0 right-0 bg-black/80 px-2 py-2 opacity-0 group-hover:opacity-100 pointer-events-none"
              >
                <p
                  class="text-center text-xs font-medium text-white truncate"
                  title={attachment.name}
                >
                  {attachment.name}
                </p>
              </div>
              <div
                class="absolute top-0 right-0 flex flex-row rounded-md overflow-hidden bg-black/80 opacity-0 group-hover:opacity-100"
              >
                <button
                  class="flex w-8 h-8 items-center justify-center hover:bg-white/10"
                  title=""
                  onclick={() => {
                    if (attachments[index].link) {
                      URL.revokeObjectURL(attachments[index].link);
                    }
                    attachments.splice(index, 1);
                  }}
                >
                  <Trash />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      <div class=""></div>
      <!-- chat message input -->
      <div class="flex flex-row w-full">
        <!-- attachment button -->
        <div class="flex justify-center items-center">
          <button
            class="hover:bg-white/10 m-1 rounded-lg cursor-pointer"
            onclick={triggerFileInput}
          >
            <Plus />
            <input
              bind:this={fileInput}
              type="file"
              class="hidden"
              onchange={handleFileSelect}
              multiple
              accept="image/*, .pdf, .doc, .docx"
            />
          </button>
        </div>
        <!-- text message input -->
        <AutoResizeTextarea
          bind:value={chatInput}
          onEnter={sendMessage}
          placeholder={`Message #${currentChannel.value?.name}`}
          maxRows={12}
        />
      </div>
    </div>
  </div>
</div>
