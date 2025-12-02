<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  let {
    children,
    ...attributes
  }: { children: Snippet } & HTMLButtonAttributes = $props();
</script>

<button
  class="flex hover:bg-white/5 hover:rounded-lg items-center p-1.5"
  {...attributes}
>
  {@render children?.()}
</button>
