<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { ChannelModel } from "../scripts/models";
  import Channel from "./Channel.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import {
    create_channel,
    delete_channel,
    socket,
  } from "../scripts/socketio.svelte";
  import ChannelAdd from "./ChannelAdd.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_channels } from "../scripts/httpActions";

  let channelList = $state<ChannelModel[]>([]);
  let events: string[] = [];

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch channels, there is no server selected");
      return;
    }
    if (!socket.id) {
      errorToast("Can't fetch channels, not connected to Socket.IO");
      return;
    }

    channelList = await get_channels(currentServer.value.id, socket.id);

    if (channelList.length > 0) {
      // select the channel found in localStorage, or just select the first one
      const lastChannelID = localStorage.getItem(currentServer.value.id);
      const lastChannel = channelList.find(
        (channel) => channel.id === lastChannelID
      );
      currentChannel.value = lastChannel || channelList[0];
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

<div class="flex flex-col p-2 overflow-y-auto scrollbar-hover text-white/50">
  <ChannelAdd />
  <ul>
    {#each channelList as channel}
      <Channel {channel} />
    {/each}
  </ul>
</div>
