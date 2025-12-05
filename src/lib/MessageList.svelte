<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import type { MessageModel } from "../scripts/models";
  import { currentServer, currentChannel } from "../scripts/globals.svelte";
  import Message from "./Message.svelte";
  import {
    create_message,
    delete_message,
    socket,
  } from "../scripts/socketio.svelte";
  import {
    getMediumDate,
    isOlderThanFiveMins,
    isSameDay,
  } from "../scripts/date";
  import MessageSmall from "./MessageSmall.svelte";

  let messageList: MessageModel[] = $state([]);
  let element: HTMLUListElement;
  let events: string[] = [];

  onMount(async () => {
    if (!currentServer.value || !currentChannel.value) return;
    if (!socket.id) return;

    const params = new URLSearchParams({
      server_id: currentServer.value.id,
      channel_id: currentChannel.value.id,
    });

    const response = await fetch(`/api/v1/message?${params}`, {
      method: "GET",
      headers: { Sid: socket.id },
    });
    if (!response.ok) {
      throw new Error(`${response.status} getting message list`);
    }

    const receivedList: MessageModel[] = await response.json();
    messageList = receivedList.reverse();

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
    if (element) {
      element.scroll({ top: element.scrollHeight, behavior: behavior });
    }
  };
</script>

<ul class="grow overflow-y-auto py-3 scrollbar-hover" bind:this={element}>
  {#each messageList as msg, index}
    {@const sameDay =
      index !== 0 ? isSameDay(messageList[index - 1].id, msg.id) : false}

    <!-- insert separator if previous message is from a previous day -->
    {#if !sameDay}
      <div class="flex flex-row justify-center items-center py-4">
        <div class="grow h-px ml-4 bg-white/10"></div>
        <h1 class="text-center mx-1 text-white/50 text-xs">
          {getMediumDate(msg.id)}
        </h1>
        <div class="grow h-px mr-4 bg-white/10"></div>
      </div>
    {/if}

    <!-- show message in small format if previous message is less than five minutes old -->
    {#if sameDay && !isOlderThanFiveMins(messageList[index - 1].id, msg.id)}
      <MessageSmall {msg} />
    {:else}
      {#if sameDay}
        <div class="h-4"></div>
      {/if}
      <Message {msg}></Message>
    {/if}
  {/each}
  <div class="h-4"></div>
</ul>
