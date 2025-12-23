<script lang="ts">
  import { onMount } from "svelte";
  import { get_user_info, update_user_info } from "../scripts/httpActions";
  import { successToast } from "../scripts/toast.svelte";
  import type { UserModel } from "../scripts/models";

  let userData = $state<UserModel>();

  let modifiedDisplayName = $state<string>("");
  let modifiedPicture: File | null = null;

  onMount(async () => {
    userData = await get_user_info();
    modifiedDisplayName = userData.display_name;
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

    const newData = await update_user_info(formData);
    if (newData.display_name) {
      userData.display_name = newData.display_name;
    }
    if (newData.picture) {
      userData.picture = newData.picture;
    }

    successToast("Updated user info!");
  }
</script>

{#if userData}
  <div>
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
