<script lang="ts">
  import { userData } from "../scripts/globals.svelte";
  import { update_user_info } from "../scripts/httpActions";
  import { successToast } from "../scripts/toast.svelte";

  interface UpdateUserSettingsForm {
    displayName: string;
    picture: File | null;
  }

  let updatedUserData = $state<UpdateUserSettingsForm>({
    displayName: userData.value!.display_name,
    picture: null,
  });

  function wasNameChanged(): boolean {
    if (updatedUserData.displayName !== userData.value!.display_name) {
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

    if (!userData.value) {
      return;
    }

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let hasData = false;
    if (wasNameChanged()) {
      formData.set("display_name", updatedUserData.displayName);
      hasData = true;
    }

    if (hasData === false) {
      return;
    }

    const newData = await update_user_info(formData);
    if (newData.display_name) {
      userData.value.display_name = newData.display_name;
    }
    if (newData.picture) {
      userData.value.picture = newData.picture;
    }

    successToast("Updated user data!");
  }
</script>

<div>
  <form class="flex flex-col" onsubmit={handleSubmit}>
    <label for="display_name">Display name</label>
    <input
      type="text"
      id="display_name"
      maxlength="32"
      required
      class="outline-1"
      bind:value={updatedUserData.displayName}
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
