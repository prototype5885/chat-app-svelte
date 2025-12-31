<script lang="ts">
  import { onMount } from "svelte";
  import { get_members } from "../scripts/httpActions";
  import { currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import Avatar from "./Avatar.svelte";
  import type { UserMemberResponse } from "../scripts/schemas";

  let members = $state<UserMemberResponse[]>([]);

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch members, there is no server selected");
      return;
    }

    members = await get_members(currentServer.value.id);
  });
</script>

<ul class="flex flex-col grow overflow-x-hidden gap-0.5 m-2">
  {#each members as member}
    <li
      class="flex p-1 cursor-pointer hover:bg-white/5 rounded-xl"
      data-ctx-type="user"
      data-ctx-user-id={member.user_id}
    >
      <Avatar size="36" pic={member.picture} name={member.display_name} />
      <span class="ml-2 text-ellipsis whitespace-nowrap overflow-x-hidden"
        >{member.display_name}</span
      >
    </li>
  {/each}
</ul>
