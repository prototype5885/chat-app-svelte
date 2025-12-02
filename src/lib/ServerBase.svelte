<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    children,
    selected = false,
    ...attributes
  }: {
    children: Snippet;
    selected?: boolean;
  } & HTMLButtonAttributes = $props();
</script>

<button
  class={[
    "flex justify-center items-center w-12 h-12 my-1 bg-cover bg-center transition-all cursor-pointer",
    `${
      selected
        ? "rounded-[35%] bg-blue-500"
        : "rounded-[50%] hover:rounded-[35%] hover:bg-blue-500 bg-white/7"
    }`,
  ]}
  {...attributes}
>
  {@render children?.()}
</button>
