<script lang="ts">
  import Hash from "../icons/Hash.svelte";
  import { currentChannel } from "../scripts/globals.svelte";
  import type { ChannelModel } from "../scripts/models";

  let props: { channel: ChannelModel } = $props();
</script>

<li>
  <button
    class={[
      "w-full flex items-center h-9 px-2 rounded-lg hover:text-white",
      `${props.channel.id === currentChannel.value?.id ? " bg-white/8 text-white" : "hover:bg-white/5 text-white/50"}`,
    ]}
    onclick={() => {
      currentChannel.value = props.channel;
    }}
    data-ctx-type="channel"
    data-ctx-id={props.channel.id}
  >
    <Hash />
    <span class="ml-2">{props.channel.name}<span> </span></span>
  </button>
</li>
