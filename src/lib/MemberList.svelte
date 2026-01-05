<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { get_members } from "../scripts/httpActions";
  import { currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import Avatar from "./Avatar.svelte";
  import type { AvatarChanged, UserSchema } from "../scripts/schemas";
  import { socket, user_avatar_changed } from "../scripts/socketio.svelte";

  let members = $state<UserSchema[]>([]);

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch members, there is no server selected");
      return;
    }

    members = await get_members(currentServer.value.id);

    socket.on(user_avatar_changed, (data: AvatarChanged) => {
      members.forEach((member) => {
        if (member.id === data.id) {
          member.picture = data.picture;
          return;
        }
      });
    });
  });

  onDestroy(() => {
    socket.off(user_avatar_changed);
  });
</script>

<ul class="flex flex-col grow overflow-x-hidden gap-0.5 m-2">
  {#each members as member}
    <li
      class="flex p-1 cursor-pointer hover:bg-white/5 rounded-xl"
      data-ctx-type="user"
      data-ctx-user-id={member.id}
    >
      <Avatar size="36" pic={member.picture} name={member.display_name} />
      <span class="ml-2 text-ellipsis whitespace-nowrap overflow-x-hidden"
        >{member.display_name}</span
      >
    </li>
  {/each}
</ul>
