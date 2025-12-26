<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    children,
    selected = false,
    indicator = true,
    notification = false,
    ...attributes
  }: {
    children: Snippet;
    selected?: boolean;
    indicator?: boolean;
    notification?: boolean;
  } & HTMLButtonAttributes = $props();
</script>

<div class="flex flex-row items-center justify-between group my-1">
  <div class="w-1">
    {#if indicator}
      <div
        class={[
          "bg-white rounded-r transition-all group-hover:opacity-100",
          `${selected ? "h-10 opacity-100" : "group-hover:h-5"}`,
          `${!selected && notification ? "h-2" : "h-0 opacity-0"}`,
        ]}
      ></div>
    {/if}
  </div>
  <button
    class={[
      "flex justify-center items-center min-w-12 max-w-12 min-h-12 max-h-12 overflow-hidden bg-cover bg-center transition-all",
      `${
        selected
          ? "rounded-[35%] bg-blue-500"
          : "rounded-[50%] group-hover:rounded-[35%] group-hover:bg-blue-500 bg-white/7"
      }`,
    ]}
    {...attributes}
  >
    {@render children?.()}
  </button>
  <div class="w-1"></div>
</div>
