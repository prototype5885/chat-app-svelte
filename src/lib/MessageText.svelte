<script lang="ts">
  import { marked } from "marked";
  import Tooltip from "./Tooltip.svelte";
  import { utcToLocal } from "../scripts/date";

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  let props: { text: string; edited: string | null } = $props();

  const htmlContent = $derived(marked.parse(props.text));
</script>

<div
  class="text-gray-300 max-w-none
    prose prose-sm prose-invert
    prose-a:text-blue-400
    prose-blockquote:border-gray-500
    prose-li:marker:text-white"
>
  {@html htmlContent}
</div>

{#if props.edited}
  <Tooltip text={utcToLocal(props.edited)}>
    <span class="text-xs text-gray-400 select-none pl-0.5">(edited)</span>
  </Tooltip>
{/if}
