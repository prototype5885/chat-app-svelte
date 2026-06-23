<script lang="ts">
  import { Hash } from "@lucide/svelte";
  import ChannelList from "../lib/ChannelList.svelte";
  import ContextMenu from "../lib/ContextMenu.svelte";
  import MessageInput from "../lib/MessageInput.svelte";
  import MessageList from "../lib/MessageList.svelte";
  import ServerList from "../lib/ServerList.svelte";
  import Top from "../lib/Top.svelte";
  import {
    currentChannel,
    currentServer,
    currentUserID,
    settings,
    theme,
  } from "../scripts/globals.svelte";
  import UserPanel from "../lib/UserPanel.svelte";
  import Settings from "../lib/Settings.svelte";
  import MemberList from "../lib/MemberList.svelte";
  // npm check cries if there is no ts-ignore here
  // @ts-ignore
  import "@fontsource/inter";
  import {
    sseConnected,
    sseConnectionAttempts,
  } from "../scripts/session.svelte";
  import { get_user_id } from "../scripts/httpActions";
  import { onMount } from "svelte";

  onMount(async () => {
    const value = await get_user_id();
    try {
      currentUserID.value = BigInt(value);
    } catch {
      currentUserID.value = value;
    }
  });
</script>

<main>
  {#if !sseConnected.value}
    <div
      class={[
        "flex flex-col h-screen justify-center items-center select-none",
        theme.value,
      ]}
    >
      <b class="text-2x">Connecting...</b>
      {#if sseConnectionAttempts.value !== 0}
        <br />
        <b class="text-white">Attempts:</b>
        <b class="text-2xl">{sseConnectionAttempts.value}</b>
      {/if}
    </div>
  {:else}
    {#if settings.value.mode !== "off"}
      {#key settings.value}
        <Settings />
      {/key}
    {/if}
    <ContextMenu />
    <div class={["flex flex-row h-screen select-none", theme.value]}>
      <div class="flex flex-col h-screen bg-black/30">
        <div class="flex flex-row overflow-y-auto grow">
          <!-- server list -->
          <div
            class="min-w-18 max-w-18 overflow-y-auto"
            style="scrollbar-width: none;"
          >
            <ServerList />
          </div>

          <!-- channel/friend list -->
          <div class="flex flex-col min-w-60 max-w-60 border-l border-color">
            <Top classValue="flex items-center px-4">
              <span class="text-ellipsis overflow-x-hidden"
                >{currentServer.value?.name}</span
              >
            </Top>
            <!-- channel or friend list -->
            {#if currentServer.value}
              {#key currentServer.value.id}
                <ChannelList server={currentServer.value} />
              {/key}
            {/if}
          </div>
        </div>

        <!-- user panel -->
        <div class="min-h-[66px] max-h-[66px] px-2 pb-2 bg-transparent">
          <div class="h-full rounded-lg bg-white/4 border border-color">
            <UserPanel />
          </div>
        </div>
      </div>

      <!-- chat area -->
      <div class="flex flex-col w-full h-full bg-black/20">
        <Top classValue="flex items-center px-4">
          <Hash />
          <span class="ml-2">{currentChannel.value?.name}<span> </span></span>
        </Top>
        {#key currentChannel.value}
          {#if currentChannel.value}
            <div class="grow"></div>
            <MessageList channelName={currentChannel.value.name} />
            <MessageInput />
          {/if}
        {/key}
      </div>
      <!-- member list -->
      <div
        class="min-w-64 max-w-64 flex flex-col border-l border-color bg-black/20"
      >
        <Top classValue="flex items-center px-4">idk</Top>
        {#key currentServer.value}
          {#if currentServer.value && currentChannel.value}
            <MemberList />
          {/if}
        {/key}
      </div>
    </div>
  {/if}
</main>
