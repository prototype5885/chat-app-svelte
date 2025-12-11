<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { MessageSchema, type MessageModel } from "../scripts/models";
  import { currentServer, currentChannel } from "../scripts/globals.svelte";
  import Message from "./Message.svelte";
  import {
    create_message,
    delete_message,
    socket,
    subscribe_to_message_list,
  } from "../scripts/socketio.svelte";
  import {
    getMediumDate,
    isOlderThanFiveMins,
    isSameDay,
  } from "../scripts/date";
  import MessageSmall from "./MessageSmall.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_messages } from "../scripts/httpActions";

  let messageList: MessageModel[] = $state([]);
  let element: HTMLUListElement;

  onMount(async () => {
    if (!currentServer.value) {
      errorToast("Can't fetch chat messages, there is no server selected");
      return;
    }
    if (!currentChannel.value) {
      errorToast("Can't fetch chat messages, there is no channel selected");
      return;
    }

    const event = subscribe_to_message_list;
    const issue = await socket.emitWithAck(
      event,
      currentServer.value.id,
      currentChannel.value.id
    );
    if (issue) {
      errorToast(`'${event}' event returned ack '${issue}''`);
    }

    const receivedList = await get_messages(
      currentServer.value.id,
      currentChannel.value.id
    );
    messageList = receivedList.reverse();

    scrollToBottom("instant");

    socket.on(create_message, (data) => {
      const result = MessageSchema.safeParse(data);
      if (!result.success) errorToast(result.error.message, result.error.name);

      messageList.push(result.data!);
      scrollToBottom("smooth");
    });

    socket.on(delete_message, (messageID: string) => {
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].id === messageID) {
          messageList.splice(i, 1);
          return;
        }
      }
      errorToast(
        `'${delete_message}' event received, but message ID '${messageID}' was not found`
      );
    });
  });

  onDestroy(() => {
    socket.off(create_message);
    socket.off(delete_message);
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
    {#if sameDay && !isOlderThanFiveMins(messageList[index - 1].id, msg.id) && messageList[index - 1].sender_id === msg.sender_id}
      <MessageSmall {msg} />
    {:else}
      {#if sameDay}
        <div class="h-4"></div>
      {/if}
      <Message {msg}></Message>
    {/if}
  {/each}
  <!-- <div class="h-4"></div> -->
</ul>
