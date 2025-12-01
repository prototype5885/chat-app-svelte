<script lang="ts">
  import type { Snippet } from "svelte";

  export let classValue: string | undefined = undefined;
  export let children: Snippet;
</script>

<div class={["min-h-12 max-h-12 border-b border-black", classValue]}>
  {@render children?.()}
</div>
