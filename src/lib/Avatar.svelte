<script lang="ts">
  let props: { size: string; pic: string | null; name: string } = $props();
</script>

<div
  class="rounded-full overflow-hidden bg-black/15 select-none"
  style={`width: ${props.size}px; height: ${props.size}px;`}
>
  {#if props.pic}
    <img
      src={`/public/avatars/small/${props.pic}.webp`}
      alt={props.name[0]}
      class="w-full h-full object-cover"
    />
  {:else if props.name}
    <div class="w-full h-full flex items-center justify-center">
      <span>{props.name[0]}</span>
    </div>
  {/if}
</div>
