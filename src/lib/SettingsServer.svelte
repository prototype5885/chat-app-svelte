<script lang="ts">
  import { onMount } from "svelte";
  import { get_server_info, update_server_info } from "../scripts/httpActions";
  import { successToast } from "../scripts/toast.svelte";
  import type { ServerModel } from "../scripts/models";
  import { settings } from "../scripts/globals.svelte";

  let serverData = $state<ServerModel>();

  let modifiedServerName = $state<string>("");
  let modifiedPicture: File | null = null;

  onMount(async () => {
    serverData = await get_server_info(settings.value.serverID!);
    modifiedServerName = serverData.name;
  });

  function wasNameChanged(): boolean {
    if (modifiedServerName !== serverData!.name) {
      return true;
    }
    return false;
  }

  function wasAnythingChanged(): boolean {
    if (wasNameChanged()) {
      return true;
    }
    return false;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!serverData) {
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let hasData = false;
    if (wasNameChanged()) {
      formData.set("name", modifiedServerName);
      hasData = true;
    }

    if (hasData === false) {
      return;
    }

    await update_server_info(formData, settings.value.serverID!);
    successToast("Updated server info!");
  }
</script>

{#if serverData}
  <div>
    <form class="flex flex-col" onsubmit={handleSubmit}>
      <label for="name">Server name</label>
      <input
        type="text"
        id="name"
        maxlength="32"
        required
        class="outline-1"
        bind:value={modifiedServerName}
      />
      <br />
      <button
        disabled={!wasAnythingChanged()}
        type="submit"
        class="bg-blue-500 rounded disabled:bg-black/20"
      >
        Submit
      </button>
    </form>
  </div>
{/if}
