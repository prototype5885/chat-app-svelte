<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { ChannelSchema } from "../scripts/schemas";
  import Channel from "./Channel.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import {
    create_channel,
    delete_channel,
    modify_channel,
    socket,
    subscribe_to_channel_list,
  } from "../scripts/socketio.svelte";
  import ChannelAdd from "./ChannelAdd.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_channels } from "../scripts/httpActions";

  let channelList = $state<ChannelSchema[]>([]);

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch channels, there is no server selected");
      return;
    }

    const event = subscribe_to_channel_list;
    const issue = await socket.emitWithAck(event, currentServer.value.id);
    if (issue) {
      errorToast(`'${event}' event returned ack '${issue}''`);
    }

    channelList = await get_channels(currentServer.value.id);

    if (channelList.length > 0) {
      // select the channel found in localStorage, or just select the first one
      const lastChannelID = localStorage.getItem(currentServer.value.id);
      const lastChannel = channelList.find(
        (channel) => channel.id === lastChannelID,
      );
      currentChannel.value = lastChannel || channelList[0];
    }

    socket.on(create_channel, (channel: ChannelSchema) => {
      channelList.push(channel);
    });

    socket.on(delete_channel, (channelID: string) => {
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
      errorToast(
        `'${delete_channel}' event received, but channel ID '${channelID}' was not found`,
      );
    });

    socket.on(modify_channel, (channel: ChannelSchema) => {
      for (let i = 0; i < channelList.length; i++) {
        if (channelList[i].id === channel.id) {
          channelList[i] = channel;
          return;
        }
      }
      errorToast(
        `'${modify_channel}' event received, but channel ID '${channel.id}' was not found`,
      );
    });
  });

  onDestroy(() => {
    socket.off(create_channel);
    socket.off(delete_channel);
    socket.off(modify_channel);
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
