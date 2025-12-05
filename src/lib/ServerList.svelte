<script lang="ts">
  import { onMount } from "svelte";
  import type { ServerModel } from "../scripts/models";
  import ServerBase from "./ServerBase.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import Mail from "../icons/Mail.svelte";
  import Plus from "../icons/Plus.svelte";
  import { errorToast } from "../scripts/toast.svelte";

  let serverList = $state<ServerModel[]>([]);

  onMount(async () => {
    const response = await fetch("/api/v1/server", { method: "GET" });
    if (!response.ok) {
      errorToast(response.statusText, response.status);
      return;
    }

    serverList = await response.json();

    if (serverList.length > 0) {
      currentServer.value = serverList[0];
    }

    // remove server IDs of left/deleted servers from localStorage
    Object.keys(localStorage).forEach((lastServerID) => {
      const foundServer = serverList.find(
        (server) => server.id === lastServerID
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
    const params = new URLSearchParams({
      name: name,
    });

    const response = await fetch(`/api/v1/server?${params}`, {
      method: "POST",
    });

    if (!response.ok) {
      errorToast(response.statusText, response.status);
      return;
    }

    const newServer: ServerModel = await response.json();
    serverList.push(newServer);

    selectServer(newServer);
  }
</script>

<ul class="flex flex-col items-center py-2" style="scrollbar-width: none;">
  <!-- DM -->
  <ServerBase onclick={() => {}}>
    <Mail />
  </ServerBase>

  {#if serverList.length > 0}
    {@render ServerSeparator()}
  {/if}

  <!-- Server List -->
  {#each serverList as server}
    <ServerBase
      onclick={() => selectServer(server)}
      selected={server.id === currentServer.value?.id}
      data-ctx-type="server"
      data-ctx-id={server.id}
    >
      <span>{server.name[0].toUpperCase()}</span>
    </ServerBase>
  {/each}

  {@render ServerSeparator()}

  <!-- Add Server -->
  <ServerBase onclick={() => createServer("Server")}>
    <Plus />
  </ServerBase>
</ul>

{#snippet ServerSeparator()}
  <div class="w-8 py-2">
    <div class="h-px bg-white/25"></div>
  </div>
{/snippet}
