<script lang="ts">
  export let size: string;
  export let pic: string | undefined = undefined;
  export let name: string;
</script>

<div
  class="rounded-full overflow-hidden bg-black/15 select-none"
  style={`width: ${size}px; height: ${size}px;`}
>
  {#if pic}
    <img
      src={`/cdn/avatars/${pic}`}
      alt={name[0]}
      class="w-full h-full object-cover"
    />
  {:else if name}
    <div class="w-full h-full flex items-center justify-center">
      <span>{name[0]}</span>
    </div>
  {/if}
</div>
