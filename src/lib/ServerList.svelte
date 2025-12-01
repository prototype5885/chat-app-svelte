<script lang="ts">
  import { onMount } from "svelte";
  import type { ServerModel } from "../scripts/models";
  import ServerBase from "./ServerBase.svelte";
  import { currentServer } from "../scripts/globals.svelte";

  let serverList = $state<ServerModel[]>([]);

  onMount(async () => {
    const response = await fetch("/api/v1/server", { method: "GET" });
    if (!response.ok) {
      throw new Error(`${response.status} getting server list`);
    }

    serverList = await response.json();

    if (serverList.length > 0) {
      currentServer.value = serverList[0];
    }
  });
</script>

<ul class="flex flex-col items-center py-2">
  <ServerBase type="dm" />
  {#if serverList.length > 0}
    {@render ServerSeparator()}
  {/if}
  {#each serverList as server}
    <ServerBase type="server" {server} />
  {/each}
  {@render ServerSeparator()}
  <ServerBase type="add-server" />
</ul>

{#snippet ServerSeparator()}
  <div class="w-8 py-2">
    <div class="h-px bg-white/25"></div>
  </div>
{/snippet}
