<script lang="ts">
  import { onMount } from "svelte";
  import { successToast } from "../scripts/toast.svelte";
  import { settings } from "../scripts/globals.svelte";
  import {
    get_channel_info,
    update_channel_info,
  } from "../scripts/httpActions";
  import type { ChannelSchema } from "../scripts/schemas";

  let channelData = $state<ChannelSchema>();

  let modifiedName = $state<string>("");

  onMount(async () => {
    channelData = await get_channel_info(settings.value.channelID!);
    modifiedName = channelData!.name;
  });

  function wasNameChanged(): boolean {
    if (modifiedName !== channelData!.name) {
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

    if (!channelData) {
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let hasData = false;
    if (wasNameChanged()) {
      formData.set("name", modifiedName);
      hasData = true;
    }

    if (hasData === false) {
      return;
    }

    await update_channel_info(formData, settings.value.channelID!);
    successToast("Updated channel info!");
  }
</script>

{#if channelData}
  <div>
    <form class="flex flex-col" onsubmit={handleSubmit}>
      <label for="name">Channel name</label>
      <input
        type="text"
        id="name"
        maxlength="32"
        required
        class="outline-1"
        bind:value={modifiedName}
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
