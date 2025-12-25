<script lang="ts">
  import { onMount } from "svelte";
  import type { ServerModel } from "../scripts/models";
  import ServerBase from "./ServerBase.svelte";
  import {
    currentChannel,
    currentServer,
    currentUserID,
  } from "../scripts/globals.svelte";
  import Mail from "../icons/Mail.svelte";
  import Plus from "../icons/Plus.svelte";
  import { create_server, get_servers } from "../scripts/httpActions";
  import Tooltip from "./Tooltip.svelte";

  let serverList = $state<ServerModel[]>([]);

  onMount(async () => {
    serverList = await get_servers();

    if (serverList.length > 0) {
      currentServer.value = serverList[0];
    }

    // remove server IDs of left/deleted servers from localStorage
    Object.keys(localStorage).forEach((lastServerID) => {
      const foundServer = serverList.find(
        (server) => server.id === lastServerID,
      );
      if (!foundServer) {
        localStorage.removeItem(lastServerID);
      }
    });
  });

  function selectServer(server: ServerModel) {
    currentServer.value = server;
    currentChannel.value = undefined;
  }

  async function createServer(name: string) {
    const newServer: ServerModel = await create_server(name);
    serverList.push(newServer);

    selectServer(newServer);
  }
</script>

<ul class="flex flex-col items-center py-2" style="scrollbar-width: none;">
  <!-- DM -->
  <Tooltip text="Direct Messages" position="right">
    <ServerBase onclick={() => {}}>
      <Mail />
    </ServerBase>
  </Tooltip>

  {#if serverList.length > 0}
    {@render ServerSeparator()}
  {/if}

  <!-- Server List -->
  {#each serverList as server}
    <Tooltip text={server.name} position="right">
      <ServerBase
        onclick={() => selectServer(server)}
        selected={server.id === currentServer.value?.id}
        data-ctx-type="server"
        data-ctx-server-id={server.id}
        data-ctx-own={server.owner_id === currentUserID}
      >
        {#if server.picture}
          <img
            src={`/server/icons/${server.picture}.webp`}
            alt={server.name[0].toUpperCase()}
          />
        {:else}
          <span>{server.name[0].toUpperCase()}</span>
        {/if}
      </ServerBase>
    </Tooltip>
  {/each}

  {@render ServerSeparator()}

  <!-- Add Server -->
  <Tooltip text="Create a Server" position="right">
    <ServerBase onclick={() => createServer("Server")}>
      <Plus />
    </ServerBase>
  </Tooltip>
</ul>

{#snippet ServerSeparator()}
  <div class="w-8 py-2">
    <div class="h-px bg-white/25"></div>
  </div>
{/snippet}
