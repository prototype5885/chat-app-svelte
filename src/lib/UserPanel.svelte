<script lang="ts">
  import Settings from "../icons/Settings.svelte";
  import type { UserModel } from "../scripts/models";
  import Avatar from "./Avatar.svelte";
  import UserPanelButton from "./UserPanelButton.svelte";

  let props: { user: UserModel } = $props();
</script>

<div class="flex h-full w-full px-2 pr-4 py-1">
  <button
    class="w-3/5 flex items-center hover:bg-white/5 hover:rounded-lg p-1 transition-all"
  >
    <Avatar size="36" pic={props.user.picture} name={props.user.display_name} />
    <div class="flex flex-col items-start ml-2">
      <span class="text-sm">{props.user.display_name}</span>
      <span class="text-xs">Status</span>
    </div>
  </button>

  <div class="flex justify-end w-full gap-0.5 h-full align-middle items-center">
    <UserPanelButton
      onclick={() => {
        console.log("settings");
      }}
    >
      <Settings />
    </UserPanelButton>
  </div>
</div>
