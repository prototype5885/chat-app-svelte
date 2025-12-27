<script lang="ts">
  import { onMount } from "svelte";

  let {
    value = $bindable(),
    placeholder = "Type a message...",
    minRows = 1,
    maxRows = 12,
    onEnter = () => {},
    onEscape = () => {},
  } = $props();

  let textareaRef = $state<HTMLTextAreaElement>();
  let lineHeight = 0;

  onMount(() => {
    if (textareaRef) {
      const style = window.getComputedStyle(textareaRef);
      lineHeight = parseInt(style.lineHeight) || 24;
      autoResize();
      textareaRef.focus();
    }
  });

  $effect(() => {
    value;
    autoResize();
  });

  function autoResize() {
    if (!textareaRef || !lineHeight) return;

    textareaRef.style.height = "auto";
    const currentRows = Math.floor(textareaRef.scrollHeight / lineHeight);
    const rows = Math.max(minRows, Math.min(currentRows, maxRows));

    textareaRef.style.height = `${rows * lineHeight}px`;
    textareaRef.style.overflowY = rows >= maxRows ? "auto" : "hidden";
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onEscape();
    }
  }
</script>

<textarea
  bind:this={textareaRef}
  bind:value
  class="resize-none overflow-y-hidden box-border my-4 outline-0 mx-2 grow"
  rows="1"
  {placeholder}
  onkeydown={handleKeyDown}
></textarea>
