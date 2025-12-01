<script lang="ts">
  import ChannelList from "./lib/ChannelList.svelte";
  import MessageInput from "./lib/MessageInput.svelte";
  import MessageList from "./lib/MessageList.svelte";
  import ServerList from "./lib/ServerList.svelte";
  import Top from "./lib/Top.svelte";
  import { currentChannel, currentServer } from "./scripts/globals.svelte";

  let theme: string = $state("theme-diskord");
</script>

<main>
  <div class={`flex flex-row h-screen select-none ${theme}`}>
    <!-- server list -->
    <div
      class="bg-black/45 min-w-18 max-w-18 overflow-y-auto"
      style="scrollbar-width: none;"
    >
      <ServerList />
    </div>

    <!-- channel/friend list -->
    <div class="flex flex-col min-w-60 max-w-60 h-screen grow">
      <!-- channel or friend list -->
      <div class="flex grow overflow-y-auto bg-black/20">
        {#if currentServer.value}
          {#key currentServer.value.id}
            <ChannelList />
          {/key}
        {/if}
      </div>
      <!-- user panel -->
      <div class="min-h-14 max-h-14 bg-black/35">
        <!-- <UserPanel /> -->
      </div>
    </div>

    <!-- chat area -->
    <div class="flex flex-col w-full h-full">
      <Top classValue="bg-black/10 flex items-center">
        {currentChannel.value?.name}
      </Top>
      {#key currentChannel.value}
        {#if currentChannel.value}
          <MessageList />
          <MessageInput />
        {/if}
      {/key}
    </div>
    <!-- member list -->
    <div class="min-w-64 max-w-64 flex flex-col">
      <Top classValue="bg-black/10">idk</Top>
      <div class="bg-black/20 flex-1"></div>
    </div>
  </div>
</main>
