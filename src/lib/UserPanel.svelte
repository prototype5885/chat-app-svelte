<script lang="ts">
  import { onMount } from "svelte";
  import Settings from "../icons/Settings.svelte";
  import { settings } from "../scripts/globals.svelte";
  import Avatar from "./Avatar.svelte";
  import UserPanelButton from "./UserPanelButton.svelte";
  import { get_user_info } from "../scripts/httpActions";
  import type { UserModel } from "../scripts/models";

  let userData = $state<UserModel>();

  onMount(async () => {
    userData = await get_user_info();
  });
</script>

{#if userData}
  <div class="flex h-full w-full px-2 pr-4 py-1">
    <button
      class="w-3/5 flex items-center hover:bg-white/5 hover:rounded-lg p-1 transition-all"
    >
      <Avatar size="36" pic={userData.picture} name={userData.display_name} />
      <div class="flex flex-col items-start ml-2">
        <span class="text-sm">{userData.display_name}</span>
        <span class="text-xs">Status</span>
      </div>
    </button>

    <div
      class="flex justify-end w-full gap-0.5 h-full align-middle items-center"
    >
      <UserPanelButton
        onclick={() => {
          settings.value = { mode: "user" };
        }}
      >
        <Settings />
      </UserPanelButton>
    </div>
  </div>
{/if}
