<script lang="ts">
  import { onMount, tick } from "svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";

  let chatInput = "";
  let typing = false;
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
    if (!currentServer.value || !currentChannel.value) return;

    const params = new URLSearchParams({
      channel_id: currentChannel.value.id,
      server_id: currentServer.value.id,
    });

    const response = await fetch(`/api/v1/message?${params}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput }),
    });
    if (!response.ok) {
      throw new Error(`${response.status} sending chat message`);
    }
    chatInput = "";
  }

  $: chatInput, tick().then(autoResize); // run when value changes

  function autoResize() {
    textareaRef.style.height = "auto";
    const currentRows = Math.floor(textareaRef.scrollHeight / lineHeight);
    const rows = Math.max(minRows, Math.min(currentRows, maxRows));
    textareaRef.style.height = `${rows * lineHeight}px`;
    textareaRef.style.overflowY = rows >= maxRows ? "auto" : "hidden";
  }
</script>

<div class="flex flex-col px-2 pb-2">
  <div class="flex rounded-lg bg-white/3 border border-color overflow-hidden">
    <textarea
      bind:this={textareaRef}
      bind:value={chatInput}
      class="resize-none overflow-y-hidden box-border grow my-4 outline-0 mx-2"
      rows="1"
      {placeholder}
      on:keydown={handleKeyDown}
    ></textarea>
  </div>
</div>
