<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { ChannelSchema, ServerSchema } from "../scripts/schemas";
  import Channel from "./Channel.svelte";
  import {
    currentChannel,
    currentServer,
    currentUserID,
  } from "../scripts/globals.svelte";
  import ChannelAdd from "./ChannelAdd.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_channels } from "../scripts/httpActions";
  import { subscribeSSE } from "../scripts/session.svelte";
  import { JSONParse } from "json-with-bigint";

  let props: { server: ServerSchema } = $props();
  const owned = $derived(props.server.owner_id === currentUserID.value);

  let channelList = $state<ChannelSchema[]>([]);

  let abortController: AbortController | null = null;

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch channels, there is no server selected");
      return;
    }

    abortController = new AbortController();
    channelList = await get_channels(
      currentServer.value.id,
      abortController.signal,
    );

    if (channelList.length > 0) {
      // select the channel found in localStorage, or just select the first one
      const lastChannelID = localStorage.getItem(
        currentServer.value.id.toString(),
      );
      if (lastChannelID) {
        const lastChannel = channelList.find(
          (channel) => channel.id === BigInt(lastChannelID),
        );
        currentChannel.value = lastChannel;
      } else {
        currentChannel.value = channelList[0];
      }
    }
  });

  $effect(() => {
    subscribeSSE("create_channel", (e: any) => {
      const channel = JSONParse(e.data) as ChannelSchema;
      channelList.push(channel);
    });

    subscribeSSE("modify_channel", (e: any) => {
      const channel = JSONParse(e.data) as ChannelSchema;

      for (let i = 0; i < channelList.length; i++) {
        if (channelList[i].id === channel.id) {
          channelList[i] = channel;
          return;
        }
      }
      errorToast(
        `modify_channel event received, but channel ID '${channel.id}' was not found`,
      );
    });

    subscribeSSE("delete_channel", (e: any) => {
      const channel = JSONParse(e.data) as { id: bigint };

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
        `delete_channel event received, but channel ID '${channel.id}' was not found`,
      );
    });
  });

  onDestroy(() => {
    if (abortController) {
      abortController.abort();
    }
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
