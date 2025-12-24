<script lang="ts">
  import type { Snippet } from "svelte";

  let props: { classValue?: string; children: Snippet } = $props();
</script>

<div class={["min-h-12 max-h-32 border-b border-color", props.classValue]}>
  {@render props.children?.()}
</div>
