<script lang="ts">
  import { onMount } from "svelte";
  import Settings from "../icons/Settings.svelte";
  import { settings } from "../scripts/globals.svelte";
  import Avatar from "./Avatar.svelte";
  import UserPanelButton from "./UserPanelButton.svelte";
  import { get_user_info } from "../scripts/httpActions";
  import Tooltip from "./Tooltip.svelte";
  import type { UserEditResponse, UserSchema } from "../scripts/schemas";
  import { self_user_info, wsSubscribe } from "../scripts/websocket.svelte";

  let userData = $state<UserSchema>();

  onMount(async () => {
    userData = await get_user_info();
  });

  $effect(() => {
    wsSubscribe(self_user_info, (event: Event) => {
      const { detail: user } = event as CustomEvent<UserEditResponse>;

      if (user.id !== userData?.id) {
        return;
      }

      if (user.picture !== undefined) {
        userData.picture = user.picture;
      }
      if (user.display_name !== undefined) {
        userData.display_name = user.display_name;
      }
      if (user.custom_status !== undefined) {
        userData.custom_status = user.custom_status;
      }
      return;
    });
  });
</script>

{#if userData}
  <div class="flex h-full w-full px-2 pr-4 py-1">
    <button
      class="w-3/5 flex items-center hover:bg-white/5 hover:rounded-lg p-1"
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
      <Tooltip text="User Settings">
        <UserPanelButton
          onclick={() => {
            settings.value = { mode: "user" };
          }}
        >
          <Settings />
        </UserPanelButton>
      </Tooltip>
    </div>
  </div>
{/if}
