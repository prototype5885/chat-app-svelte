<script lang="ts">
  let props: {
    size: string;
    pic: string | null;
    name: string;
    online: boolean | null;
  } = $props();
</script>

<div
  class="relative inline-block"
  style={`width: ${props.size}px; height: ${props.size}px;`}
>
  <div
    class="rounded-full overflow-hidden bg-black/15 select-none w-full h-full"
  >
    {#if props.pic}
      <img
        src={`/avatars/${props.pic}?size=80`}
        alt={props.name[0]}
        class="w-full h-full object-cover"
      />
    {:else if props.name}
      <div class="w-full h-full flex items-center justify-center">
        <span>{props.name[0]}</span>
      </div>
    {/if}
  </div>

  {#if props.online}
    {@const size = Math.max(0, parseInt(props.size) * 0.35)}
    <div
      class="absolute bottom-0 right-0 rounded-full bg-emerald-500 border-2 border-white"
      style={`width: ${size}px; height: ${size}px;`}
    ></div>
  {/if}
  <!-- {#if props.online}
    <div class="absolute inset-0 rounded-full ring-2 ring-emerald-500"></div>
  {/if} -->
</div>
