<script lang="ts">
  import { onMount, tick } from "svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { create_message } from "../scripts/httpActions";
  import MessageTyping from "./MessageTyping.svelte";

  let chatInput = $state<string>("");
  let minRows = 1;
  let maxRows = 12;
  let placeholder = "Message ...";

  let textareaRef: HTMLTextAreaElement;
  let lineHeight = 0;

  onMount(() => {
    const style = window.getComputedStyle(textareaRef);
    lineHeight = parseInt(style.lineHeight);
    autoResize();
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  async function sendMessage() {
    if (chatInput === "") return;
    if (!currentServer.value) {
      errorToast("Can't send chat message, there is no server selected");
      return;
    }
    if (!currentChannel.value) {
      errorToast("Can't send chat message, there is no channel selected");
      return;
    }

    await create_message(
      currentServer.value.id,
      currentChannel.value.id,
      chatInput
    );

    chatInput = "";
  }

  $effect(() => {
    chatInput;
    autoResize();
  });

  function autoResize() {
    textareaRef.style.height = "auto";
    const currentRows = Math.floor(textareaRef.scrollHeight / lineHeight);
    const rows = Math.max(minRows, Math.min(currentRows, maxRows));
    textareaRef.style.height = `${rows * lineHeight}px`;
    textareaRef.style.overflowY = rows >= maxRows ? "auto" : "hidden";
  }
</script>

<div class="flex flex-col px-2 pb-2 relative">
  <div class="absolute inset-x-2 bottom-full pointer-events-none">
    <MessageTyping {chatInput} />
  </div>
  <div class="flex rounded-lg bg-white/3 border border-color overflow-hidden">
    <textarea
      bind:this={textareaRef}
      bind:value={chatInput}
      class="resize-none overflow-y-hidden box-border grow my-4 outline-0 mx-2"
      rows="1"
      {placeholder}
      onkeydown={handleKeyDown}
    ></textarea>
  </div>
</div>
