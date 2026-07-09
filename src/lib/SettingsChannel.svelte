<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import { successToast } from "../scripts/toast.svelte";
  import { settings } from "../scripts/globals.svelte";
  import {
    get_channel_info,
    update_channel_info,
  } from "../scripts/httpActions";
  import { ChannelNameSchema, ChannelSchema } from "../scripts/schemas";
  import FormField from "./FormField.svelte";

  let channelData = $state<z.infer<typeof ChannelSchema>>();

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

    const data = await update_channel_info(formData, settings.value.channelID!);
    if (data.name !== undefined) {
      channelData.name = data.name;
    }

    successToast("Updated channel info!");
  }
</script>

{#if channelData}
  <div>
    <form class="flex flex-col w-lg" onsubmit={handleSubmit}>
      <FormField
        label="Channel Name"
        id="name"
        maxlength={ChannelNameSchema.maxLength}
        required
        bind:value={modifiedName}
      />
      <br />
      <button
        disabled={!wasAnythingChanged()}
        type="submit"
        class="button-default"
      >
        Submit
      </button>
    </form>
  </div>
{/if}
