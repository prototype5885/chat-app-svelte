<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { currentChannel } from "../scripts/globals.svelte";
  import Message from "./Message.svelte";
  import {
    create_message,
    delete_message,
    edit_message,
    socket,
    subscribe_to_message_list,
  } from "../scripts/socketio.svelte";
  import {
    getMediumDate,
    isOlderThanFiveMins,
    isSameDay,
  } from "../scripts/date";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_messages } from "../scripts/httpActions";
  import type { MessageResponse } from "../scripts/schemas";

  // these will happen if distance from bottom is above this:
  // won't autoscroll down on new message
  // will display button about viewing older messages
  // will display how many new messages were received
  const OLD_ABOVE_THIS = 1000;

  const props: { channelName: string } = $props();

  let messageList: MessageResponse[] = $state([]);
  let msgList: HTMLUListElement;

  let reachedBeginning = $state<boolean>(false);
  let newMessagesCount = $state<number>(0);
  let isViewingOlder = $state<boolean>(false);

  let scrollBottom = 0;
  let requestInProgress = false;

  onMount(async () => {
    if (!currentChannel.value) {
      errorToast("Can't fetch chat messages, there is no channel selected");
      return;
    }

    const event = subscribe_to_message_list;
    const issue = await socket.emitWithAck(event, currentChannel.value.id);
    if (issue) {
      errorToast(`'${event}' event returned ack '${issue}''`);
    }

    messageList = (await get_messages(currentChannel.value.id)).reverse();
    if (messageList.length === 0) {
      // if chat is empty
      reachedBeginning = true;
    }

    scrollToBottom("instant");

    socket.on(create_message, (message: MessageResponse) => {
      messageList.push(message);

      if (scrollBottom < OLD_ABOVE_THIS) {
        scrollToBottom("instant");
      } else {
        newMessagesCount += 1;
      }
    });

    socket.on(edit_message, (editedMessage: MessageResponse) => {
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].id === editedMessage.id) {
          messageList[i].message = editedMessage.message;
          messageList[i].edited = editedMessage.edited;
          return;
        }
      }
      errorToast(
        `'${edit_message}' event received, but message ID '${editedMessage.id}' was not found`,
      );
    });

    socket.on(delete_message, (messageID: string) => {
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].id === messageID) {
          messageList.splice(i, 1);
          return;
        }
      }
      errorToast(
        `'${delete_message}' event received, but message ID '${messageID}' was not found`,
      );
    });

    await tick();
    const canScroll = msgList.scrollHeight > msgList.clientHeight;
    if (!canScroll) {
      // since message list isn't scrollable, it most likely means chat is still very new
      // this would also trigger if chat is zoomed out and all 50 message can fit in without scrolling
      // so as safety measure, request older messages just to be sure there really are no more messages
      if (messageList.length > 0) {
        await requestRelativeMessages(
          currentChannel.value.id,
          messageList[0].id,
          "before",
        );
      }
    }
  });

  onDestroy(() => {
    socket.off(create_message);
    socket.off(edit_message);
    socket.off(delete_message);
  });

  const scrollToBottom = async (behavior: ScrollBehavior) => {
    await tick();
    if (msgList) {
      msgList.scroll({ top: msgList.scrollHeight, behavior: behavior });
    }
  };

  async function requestRelativeMessages(
    channelID: string,
    messageID: string,
    direction: "before" | "after",
  ) {
    requestInProgress = true;
    const result = await get_messages(channelID, messageID, direction, 100);

    if (result.length === 0) {
      reachedBeginning = true;
    } else {
      messageList = [...result.reverse(), ...messageList];
    }
    requestInProgress = false;
  }

  async function onDivScroll() {
    const max = msgList.scrollHeight - msgList.clientHeight;
    scrollBottom = max - msgList.scrollTop;

    // remove the new messages counter notification if scrolled down
    if (scrollBottom < 50) {
      newMessagesCount = 0;
    }
    if (scrollBottom > OLD_ABOVE_THIS) {
      isViewingOlder = true;
    } else {
      isViewingOlder = false;
    }

    // request new messages if distance is less than 500 from top
    if (!requestInProgress && !reachedBeginning && msgList.scrollTop < 500) {
      if (!currentChannel.value) return;

      const oldScrollHeight = msgList.scrollHeight;

      await requestRelativeMessages(
        currentChannel.value.id,
        messageList[0].id,
        "before",
      );

      await tick();
      msgList.scrollTop += msgList.scrollHeight - oldScrollHeight;
    }
  }
</script>

<div class="relative w-full overflow-hidden">
  <ul
    class="h-full overflow-y-auto py-3 scrollbar-hover"
    style="overflow-anchor: none;"
    bind:this={msgList}
    onscroll={onDivScroll}
  >
    {#if reachedBeginning}
      <b class="items-center py-8 px-4 text-3xl">
        This is the beginning of #{props.channelName} channel
      </b>
    {/if}
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
        <Message {msg} small={true} />
      {:else}
        {#if sameDay}
          <div class="h-4"></div>
        {/if}
        <Message {msg}></Message>
      {/if}
    {/each}
    <div class="h-6"></div>
  </ul>
  {#if newMessagesCount !== 0 || isViewingOlder}
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col">
      {#if newMessagesCount !== 0}
        <span
          class=" bg-blue-500 mb-4 px-4 mx-20 py-1 flex justify-center rounded"
        >
          {newMessagesCount} new messages received
        </span>
      {/if}
      {#if isViewingOlder}
        <button
          class="bg-black/50 p-4 flex flex-row items-center backdrop-blur-xs rounded-2xl"
          onclick={() => scrollToBottom("instant")}
        >
          <span>You are viewing older messages</span>
          <div class="w-2"></div>
          <span class="bg-blue-500 p-2 rounded-md">Jump to present</span>
        </button>
      {/if}
    </div>
  {/if}
</div>
