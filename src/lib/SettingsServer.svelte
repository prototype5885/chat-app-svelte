<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import { get_server_info, update_server_info } from "../scripts/httpActions";
  import { successToast } from "../scripts/toast.svelte";
  import { settings } from "../scripts/globals.svelte";
  import { ServerNameSchema, ServerSchema } from "../scripts/schemas";
  import AvatarUploader from "./AvatarUploader.svelte";
  import FormField from "./FormField.svelte";

  let serverData = $state<z.infer<typeof ServerSchema>>();

  let modifiedServerName = $state<string>("");
  let modifiedPicture: File | null = null;

  onMount(async () => {
    serverData = await get_server_info(settings.value.serverID!);
    modifiedServerName = serverData!.name;
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

    serverData = await update_server_info(formData, settings.value.serverID!);

    successToast("Updated server info!");
  }
</script>

{#if serverData}
  <div>
    <AvatarUploader preview={serverData.picture} serverID={serverData.id} />
    <br />
    <form class="flex flex-col w-lg" onsubmit={handleSubmit}>
      <FormField
        label="Server Name"
        id="name"
        maxlength={ServerNameSchema.maxLength}
        required
        bind:value={modifiedServerName}
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
