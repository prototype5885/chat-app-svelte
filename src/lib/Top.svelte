<script lang="ts">
  import type { Snippet } from "svelte";

  export let classValue: string | undefined = undefined;
  export let children: Snippet;
</script>

<div class={["min-h-12 max-h-12 border-b border-color", classValue]}>
  {@render children?.()}
</div>
