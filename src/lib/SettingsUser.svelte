<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import { get_user_info, update_user_info } from "../scripts/httpActions";
  import { successToast } from "../scripts/toast.svelte";
  import { DisplayNameSchema, UserSchema } from "../scripts/schemas";
  import AvatarUploader from "./AvatarUploader.svelte";
  import FormField from "./FormField.svelte";

  let userData = $state<z.infer<typeof UserSchema>>();

  let modifiedDisplayName = $state<string>("");

  onMount(async () => {
    userData = await get_user_info();
    modifiedDisplayName = userData!.display_name;
  });

  function wasNameChanged(): boolean {
    if (modifiedDisplayName !== userData!.display_name) {
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

    if (!userData) {
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let hasData = false;
    if (wasNameChanged()) {
      formData.set("display_name", modifiedDisplayName);
      hasData = true;
    }

    if (hasData === false) {
      return;
    }

    const data = await update_user_info(formData);
    if (data.display_name) {
      userData.display_name = data.display_name;
    }
    if (data.custom_status) {
      userData.custom_status = data.custom_status;
    }
    successToast("Updated user info!");
  }
</script>

{#if userData}
  <div>
    <AvatarUploader preview={userData.picture} />
    <br />
    <form class="flex flex-col w-lg" onsubmit={handleSubmit}>
      <FormField
        label="Display name"
        id="display_name"
        maxlength={DisplayNameSchema.maxLength}
        required
        bind:value={modifiedDisplayName}
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
