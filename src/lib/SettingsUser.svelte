<script lang="ts">
  import { onMount } from "svelte";
  import { get_user_info, update_user_info } from "../scripts/httpActions";
  import { successToast } from "../scripts/toast.svelte";
  import type { UserSchema } from "../scripts/schemas";
  import AvatarUploader from "./AvatarUploader.svelte";

  let userData = $state<UserSchema>();

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
    if (data.display_name !== undefined) {
      userData.display_name = data.display_name;
    }
    if (data.custom_status !== undefined) {
      userData.custom_status = data.custom_status;
    }
    successToast("Updated user info!");
  }
</script>

{#if userData}
  <div>
    <AvatarUploader preview={userData.picture} />
    <br />
    <form class="flex flex-col" onsubmit={handleSubmit}>
      <label for="display_name">Display name</label>
      <input
        type="text"
        id="display_name"
        maxlength="32"
        required
        class="outline-1"
        bind:value={modifiedDisplayName}
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
