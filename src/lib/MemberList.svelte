<script lang="ts">
  import { onMount } from "svelte";
  import { get_members } from "../scripts/httpActions";
  import { currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import Avatar from "./Avatar.svelte";
  import type {
    UserEditResponse,
    UserOnline,
    UserSchema,
  } from "../scripts/schemas";
  import {
    user_info,
    user_online,
    wsSubscribe,
  } from "../scripts/websocket.svelte";

  let members = $state<UserSchema[]>([]);
  let onlineMembers = $derived(
    members
      .filter((m) => m.online)
      .sort((a, b) =>
        a.display_name
          .toLowerCase()
          .localeCompare(b.display_name.toLowerCase()),
      ),
  );

  let offlineMembers = $derived(
    members
      .filter((m) => !m.online)
      .sort((a, b) =>
        a.display_name
          .toLowerCase()
          .localeCompare(b.display_name.toLowerCase()),
      ),
  );

  let onlineCount = $derived(onlineMembers.length);
  let offlineCount = $derived(offlineMembers.length);

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch members, there is no server selected");
      return;
    }

    members = await get_members(currentServer.value.id);
  });

  $effect(() => {
    wsSubscribe(user_info, (event: Event) => {
      const { detail: user } = event as CustomEvent<UserEditResponse>;

      members.forEach((member) => {
        if (member.id === user.id) {
          if (user.picture !== undefined) {
            member.picture = user.picture;
          }
          if (user.display_name !== undefined) {
            member.display_name = user.display_name;
          }
          if (user.custom_status !== undefined) {
            member.custom_status = user.custom_status;
          }
          return;
        }
      });
    });

    wsSubscribe(user_online, (event: Event) => {
      const { detail: user } = event as CustomEvent<UserOnline>;
      members.forEach((member) => {
        if (member.id === user.id) {
          member.online = user.online;
          return;
        }
      });
    });
  });
</script>

<ul class="flex flex-col grow overflow-x-hidden gap-0.5 m-2">
  <!-- online members -->
  {#if onlineCount > 0}
    <li
      class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
    >
      Online — {onlineCount}
    </li>

    {#each onlineMembers as member}
      <li
        class="flex p-1 cursor-pointer hover:bg-white/5 rounded-xl"
        data-ctx-type="user"
        data-ctx-user-id={member.id}
      >
        <Avatar
          size="36"
          pic={member.picture}
          name={member.display_name}
          online={member.online}
        />
        <span class="ml-2 text-ellipsis whitespace-nowrap overflow-x-hidden">
          {member.display_name}
        </span>
      </li>
    {/each}
  {/if}

  <!-- offline members -->
  {#if offlineCount > 0}
    <li
      class="px-3 py-2.5 mt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
    >
      Offline — {offlineCount}
    </li>

    {#each offlineMembers as member}
      <li
        class={[
          "flex p-1 cursor-pointer hover:bg-white/5 rounded-xl",
          "grayscale opacity-50 hover:grayscale-0 hover:opacity-100",
        ]}
        data-ctx-type="user"
        data-ctx-user-id={member.id}
      >
        <Avatar
          size="36"
          pic={member.picture}
          name={member.display_name}
          online={member.online}
        />
        <span
          class="ml-2 text-ellipsis whitespace-nowrap overflow-x-hidden text-gray-300"
        >
          {member.display_name}
        </span>
      </li>
    {/each}
  {/if}

  {#if members.length === 0}
    <li class="text-center text-gray-500 py-6 text-sm">No members</li>
  {/if}
</ul>
