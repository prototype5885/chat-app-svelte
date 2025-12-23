<script lang="ts">
  import type { Snippet } from "svelte";
  import { errorToast } from "../scripts/toast.svelte";

  const {
    children,
    text,
    position = "top",
  }: {
    children: Snippet;
    text: string;
    position?: "top" | "bottom" | "left" | "right";
  } = $props();

  let visible = $state(false);
  let triggerArea = $state<HTMLElement | null>(null);
  let coords = $state({ top: 0, left: 0 });

  function setPosition() {
    if (!triggerArea) {
      errorToast(`triggerArea is '${triggerArea}' in Tooltip.svelte'`);
      return;
    }
    const rect = triggerArea.getBoundingClientRect();

    switch (position) {
      case "top":
        coords = {
          top: rect.top,
          left: rect.left + rect.width / 2,
        };
        break;
      case "bottom":
        coords = {
          top: rect.bottom,
          left: rect.left + rect.width / 2,
        };
        break;
      case "left":
        coords = {
          top: rect.top + rect.height / 2,
          left: rect.left,
        };
        break;
      case "right":
        coords = {
          top: rect.top + rect.height / 2,
          left: rect.right,
        };
        break;
    }
  }
</script>

<span
  bind:this={triggerArea}
  onmouseenter={() => {
    visible = true;
    setPosition();
  }}
  onmouseleave={() => {
    visible = false;
  }}
  role="presentation"
>
  {@render children?.()}
</span>

{#if visible}
  <div
    role="tooltip"
    class={[
      "fixed z-50 wrap-break-word bg-black/40 text-white backdrop-blur-sm px-2 py-1 rounded-md max-w-48",
      position,
    ]}
    style="top: {coords.top}px; left: {coords.left}px;"
  >
    {text}
  </div>
{/if}

<style>
  .top {
    transform: translate(-50%, -100%) translateY(-10px);
  }
  .bottom {
    transform: translate(-50%, 10px);
  }
  .left {
    transform: translate(-100%, -50%) translateX(-10px);
  }
  .right {
    transform: translate(10px, -50%);
  }
</style>
