<script lang="ts">
  import Mail from "../icons/Mail.svelte";
  import Plus from "../icons/Plus.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import type { ServerModel } from "../scripts/models";

  export let type: "dm" | "server" | "add-server";
  export let server: ServerModel | undefined = undefined;

  function selectServer() {
    currentServer.value = server;
    currentChannel.value = undefined;
  }

  function createServer() {}
</script>

<main>
  <li>
    <button
      class={`flex justify-center items-center w-12 h-12 my-1 bg-cover bg-center transition-all cursor-pointer
        ${
          type !== "add-server" && currentServer.value === server
            ? "rounded-[35%] bg-blue-500"
            : "rounded-[50%] hover:rounded-[35%] hover:bg-blue-500 bg-white/7"
        }`}
      data-ctx-type={`${type === "server" ? "server" : ""}`}
      data-ctx-id={`${type === "server" ? server?.id : ""}`}
      onclick={() => {
        if (type !== "add-server") selectServer();
        else createServer();
      }}
    >
      {#if type === "dm"}
        <Mail />
      {:else if type === "add-server"}
        <Plus />
      {:else if type === "server" && server && !server.picture && server.name.length > 0}
        <span>{server.name[0].toUpperCase()}</span>
      {/if}
    </button>
  </li>
</main>
