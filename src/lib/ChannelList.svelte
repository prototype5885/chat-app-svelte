<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { ChannelModel } from "../scripts/models";
  import Channel from "./Channel.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import { create_channel, delete_channel, socket } from "../scripts/socketio";

  let channelList = $state<ChannelModel[]>([]);
  let events: string[] = [];

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

    socket.on(create_channel, (newChannel: ChannelModel) => {
      events.push(create_channel);
      channelList.push(newChannel);
    });

    socket.on(delete_channel, (channelID: string) => {
      events.push(delete_channel);
      for (let i = 0; i < channelList.length; i++) {
        if (channelList[i].id === channelID) {
          channelList.splice(i, 1);
          if (currentChannel.value!.id === channelID) {
            if (channelList.length > 0) {
              currentChannel.value = channelList[0];
            } else {
              currentChannel.value = undefined;
            }
          }
          return;
        }
      }
    });
  });

  onDestroy(() => {
    events.forEach((event) => {
      socket.off(event);
    });
  });
</script>

<ul class="flex flex-col p-2 overflow-y-auto scrollbar-hover">
  {#each channelList as channel}
    <Channel {channel} />
  {/each}
</ul>
