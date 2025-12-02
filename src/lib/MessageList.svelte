<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import type { MessageModel } from "../scripts/models";
  import { currentServer, currentChannel } from "../scripts/globals.svelte";
  import Message from "./Message.svelte";
  import { create_message, delete_message, socket } from "../scripts/socketio";

  let messageList: MessageModel[] = $state([]);
  let element: HTMLUListElement;
  let events: string[] = [];

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
    scrollToBottom("instant");

    socket.on(create_message, (newMessage: MessageModel) => {
      events.push(create_message);
      messageList.push(newMessage);
      scrollToBottom("smooth");
    });

    socket.on(delete_message, (messageID: string) => {
      events.push(delete_message);
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].id === messageID) {
          messageList.splice(i, 1);
          return;
        }
      }
    });
  });

  onDestroy(() => {
    events.forEach((event) => {
      socket.off(event);
    });
  });

  const scrollToBottom = async (behavior: ScrollBehavior) => {
    await tick();
    element.scroll({ top: element.scrollHeight, behavior: behavior });
  };
</script>

<ul class="grow overflow-y-auto py-3 scrollbar-hover" bind:this={element}>
  {#each messageList as msg}
    <Message {msg}></Message>
  {/each}
</ul>
