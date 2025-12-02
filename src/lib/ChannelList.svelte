<script lang="ts">
  import { onMount } from "svelte";
  import type { ChannelModel } from "../scripts/models";
  import Top from "./Top.svelte";
  import Channel from "./Channel.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";

  let channelList = $state<ChannelModel[]>([]);

  onMount(async () => {
    if (!currentServer.value) return;

    const params = new URLSearchParams({
      server_id: currentServer.value.id,
    });

    const response = await fetch(`/api/v1/channel?${params}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`${response.status} getting channel list`);
    }

    channelList = await response.json();

    if (channelList.length > 0) {
      currentChannel.value = channelList[0];
    }
  });
</script>

<ul class="flex flex-col p-2 overflow-y-auto scrollbar-hover">
  {#each channelList as channel}
    <Channel {channel} />
  {/each}
</ul>
