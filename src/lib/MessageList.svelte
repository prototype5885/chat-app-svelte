<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { MessageModel } from "../scripts/models";
  import { currentServer, currentChannel } from "../scripts/globals.svelte";
  import Message from "./Message.svelte";
  import { socket } from "../scripts/socketio";

  let messageList: MessageModel[] = $state([]);

  onMount(async () => {
    if (!currentServer.value || !currentChannel.value) {
      return;
    }

    const params = new URLSearchParams({
      server_id: currentServer.value.id,
      channel_id: currentChannel.value.id,
    });

    const response = await fetch(`/api/v1/message?${params}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`${response.status} getting message list`);
    }

    messageList = await response.json();

    socket.on("new_message", (data: MessageModel) => {
      messageList.push(data);
    });
  });

  onDestroy(() => {
    socket.off("new_message");
  });
</script>

<div class="grow overflow-y-auto py-3">
  <ul>
    {#each messageList as msg}
      <Message {msg}></Message>
    {/each}
  </ul>
</div>
