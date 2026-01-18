<script lang="ts">
  import { onMount } from "svelte";
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
  import type { ServerSchema } from "../scripts/schemas";
  import {
    delete_server,
    sendWs,
    server_info,
    subscribe_to_server,
    subscribe_to_server_list,
    wsSubscribe,
  } from "../scripts/websocket.svelte";

  let serverList = $state<ServerSchema[]>([]);

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

    // subscribe to servers to receive real time changes
    sendWs(subscribe_to_server_list, null);
  });

  $effect(() => {
    wsSubscribe(server_info, (event: Event) => {
      const { detail } = event as CustomEvent;
      const server: ServerSchema = JSON.parse(detail);

      updateServerInfo(server);
    });

    wsSubscribe(delete_server, (event: Event) => {
      const { detail } = event as CustomEvent;
      const serverID: string = detail;

      for (let i = 0; i < serverList.length; i++) {
        if (serverList[i].id === serverID) {
          serverList.splice(i, 1);
          return;
        }
      }
    });
  });

  function selectServer(server: ServerSchema) {
    currentServer.value = server;
    currentChannel.value = undefined;
  }

  async function createServer(name: string) {
    const newServer: ServerSchema = await create_server(name);
    serverList.push(newServer);

    selectServer(newServer);

    // subscribe to this new server to receive real time changes
    sendWs(subscribe_to_server, newServer.id);
  }

  function updateServerInfo(data: ServerSchema) {
    for (let i = 0; i < serverList.length; i++) {
      if (serverList[i].id === data.id) {
        serverList[i] = data;
        return;
      }
    }
  }
</script>

<ul class="flex flex-col py-2" style="scrollbar-width: none;">
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
        notification={false}
        data-ctx-type="server"
        data-ctx-server-id={server.id}
        data-ctx-own={server.owner_id === currentUserID}
      >
        {#if server.picture}
          <img
            src={`/avatars/${server.picture}.webp?size=96`}
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
    <ServerBase onclick={() => createServer("Server")} indicator={false}>
      <Plus />
    </ServerBase>
  </Tooltip>
</ul>

{#snippet ServerSeparator()}
  <div class="flex justify-center py-2">
    <div class="h-px bg-white/25 w-8"></div>
  </div>
{/snippet}
