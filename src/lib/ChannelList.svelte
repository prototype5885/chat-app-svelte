<script lang="ts">
  import { onMount } from "svelte";
  import type { ChannelSchema, ServerSchema } from "../scripts/schemas";
  import Channel from "./Channel.svelte";
  import {
    currentChannel,
    currentServer,
    currentUserID,
  } from "../scripts/globals.svelte";
  import {
    create_channel,
    delete_channel,
    modify_channel,
    sendWs,
    subscribe_to_channel_list,
    wsSubscribe,
  } from "../scripts/websocket.svelte";
  import ChannelAdd from "./ChannelAdd.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_channels } from "../scripts/httpActions";

  let props: { server: ServerSchema } = $props();
  const owned = props.server.owner_id === currentUserID;

  let channelList = $state<ChannelSchema[]>([]);

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch channels, there is no server selected");
      return;
    }

    const event = subscribe_to_channel_list;
    sendWs(event, currentServer.value.id);

    channelList = await get_channels(currentServer.value.id);

    if (channelList.length > 0) {
      // select the channel found in localStorage, or just select the first one
      const lastChannelID = localStorage.getItem(currentServer.value.id);
      const lastChannel = channelList.find(
        (channel) => channel.id === lastChannelID,
      );
      currentChannel.value = lastChannel || channelList[0];
    }
  });

  $effect(() => {
    wsSubscribe(create_channel, (event: Event) => {
      const { detail: channel } = event as CustomEvent<ChannelSchema>;
      channelList.push(channel);
    });

    wsSubscribe(modify_channel, (event: Event) => {
      const { detail: channel } = event as CustomEvent<ChannelSchema>;

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

    wsSubscribe(delete_channel, (event: Event) => {
      interface ChannelToDelete {
        id: string;
      }

      const { detail: channel } = event as CustomEvent<ChannelToDelete>;

      for (let i = 0; i < channelList.length; i++) {
        if (channelList[i].id === channel.id) {
          channelList.splice(i, 1);
          if (currentChannel.value!.id === channel.id) {
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
        `'${delete_channel}' event received, but channel ID '${channel.id}' was not found`,
      );
    });
  });
</script>

<div class="flex flex-col p-2 overflow-y-auto scrollbar-hover text-white/50">
  <ChannelAdd />
  <ul>
    {#each channelList as channel}
      <Channel {channel} {owned} />
    {/each}
  </ul>
</div>
