<script lang="ts">
  import { onMount } from "svelte";
  import Settings from "../icons/Settings.svelte";
  import { settingsVisible, userData } from "../scripts/globals.svelte";
  import Avatar from "./Avatar.svelte";
  import UserPanelButton from "./UserPanelButton.svelte";

  onMount(async () => {
    const response = await fetch("/api/v1/user", { method: "GET" });
    if (!response.ok) {
      throw new Error(`${response.status} getting user info`);
    }
    userData.value = await response.json();
  });
</script>

{#if userData.value}
  <div class="flex h-full w-full px-2 pr-4 py-1">
    <button
      class="w-3/5 flex items-center hover:bg-white/5 hover:rounded-lg p-1 transition-all"
    >
      <Avatar
        size="36"
        pic={userData.value.picture}
        name={userData.value.display_name}
      />
      <div class="flex flex-col items-start ml-2">
        <span class="text-sm">{userData.value.display_name}</span>
        <span class="text-xs">Status</span>
      </div>
    </button>

    <div
      class="flex justify-end w-full gap-0.5 h-full align-middle items-center"
    >
      <UserPanelButton
        onclick={() => {
          settingsVisible.value = true;
        }}
      >
        <Settings />
      </UserPanelButton>
    </div>
  </div>
{/if}
