<script lang="ts">
  import { z } from "zod";
  import { onDestroy, onMount, tick } from "svelte";
  import { currentChannel } from "../scripts/globals.svelte";
  import Message from "./Message.svelte";
  import {
    getMediumDate,
    isOlderThanFiveMins,
    isSameDay,
  } from "../scripts/date";
  import { errorToast } from "../scripts/toast.svelte";
  import { get_messages } from "../scripts/httpActions";
  import { MessageSchema, UserEditResponseSchema } from "../scripts/schemas";
  import MessageTyping from "./MessageTyping.svelte";
  import { sseConnected, subscribeSSE } from "../scripts/session.svelte";
  import { JSONParse } from "json-with-bigint";

  // these will happen if the scroll distance from bottom is above this:
  // won't autoscroll down on new message
  // will display button about viewing older messages
  // will display how many new messages were received
  const OLD_ABOVE_THIS = 1000;

  const MESSAGE_LIST_LIMIT = 100; // maximum messages allowed in list
  const OFFSET = 15; // delete old ones if exceeding it by this

  const props: { channelName: string } = $props();

  let messageList = $state<z.infer<ReturnType<typeof MessageSchema.array>>>([]);
  let msgList: HTMLUListElement | undefined = $state();

  let reachedBeginning = $state<boolean>(false);
  let newMessagesCount = $state<number>(0);
  let isViewingOlder = $state<boolean>(false);

  let scrollBottom = 0;
  let requestInProgress = false;
  let abortController: AbortController | null = null;

  onMount(async () => {
    if (!currentChannel.value) {
      errorToast("Can't fetch chat messages, there is no channel selected");
      return;
    }

    abortController = new AbortController();
    messageList = (
      await get_messages(
        currentChannel.value.id,
        null,
        null,
        abortController.signal,
      )
    ).reverse();
    if (messageList.length === 0) {
      // if chat is empty
      reachedBeginning = true;
    }

    initialDisplayMessages();

    await tick();
    const canScroll = msgList!.scrollHeight > msgList!.clientHeight;
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

  $effect(() => {
    subscribeSSE("create_message", (e: any) => {
      messageList.push(JSONParse(e.data));
      if (scrollBottom < OLD_ABOVE_THIS) {
        scrollToBottom("instant");
      } else {
        newMessagesCount += 1;
      }
    });

    subscribeSSE("edit_message", (e: any) => {
      const message = JSONParse(e.data);

      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].id === message.id) {
          messageList[i].message = message.message;
          messageList[i].edited = message.edited;
          return;
        }
      }
    });

    subscribeSSE("delete_message", (e: any) => {
      const messageID = BigInt(e.data);
      for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].id === messageID) {
          messageList.splice(i, 1);
          return;
        }
      }
    });

    subscribeSSE("user_info", (e: any) => {
      const user = UserEditResponseSchema.parse(JSONParse(e.data));

      messageList.forEach((msg) => {
        if (msg.sender_id === user.id) {
          if (user.picture) {
            msg.picture = user.picture;
          }
          if (user.display_name) {
            msg.display_name = user.display_name;
          }
        }
      });
    });
  });

  const scrollToBottom = async (behavior: ScrollBehavior) => {
    await tick();
    if (msgList) {
      msgList.scroll({ top: msgList.scrollHeight, behavior: behavior });
    }
  };

  function trimOldMessages() {
    if (messageList.length > MESSAGE_LIST_LIMIT + OFFSET) {
      const previousLength = messageList.length;
      messageList = messageList.slice(-MESSAGE_LIST_LIMIT);
      reachedBeginning = false;
      console.log(
        `Deleted old chat messages, count before: '${previousLength}', after: '${messageList.length}'`,
      );
    }
  }

  function initialDisplayMessages() {
    scrollToBottom("instant");
  }

  async function requestRelativeMessages(
    channelID: bigint,
    messageID: bigint,
    direction: "before" | "after",
  ) {
    requestInProgress = true;
    abortController = new AbortController();
    const messages = await get_messages(
      channelID,
      messageID,
      direction,
      abortController.signal,
    );

    if (messages.length === 0) {
      reachedBeginning = true;
    } else {
      if (direction === "before") {
        messageList = [...messages.reverse(), ...messageList];
      } else {
        messageList = [...messageList, ...messages];
      }
    }
    requestInProgress = false;
  }

  async function onDivScroll() {
    if (!msgList) return;

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

    // trim old messages if reached bottom
    if (scrollBottom < 1) {
      trimOldMessages();
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

  onDestroy(() => {
    if (abortController) {
      abortController.abort();
    }
  });
</script>

<div class="relative w-full overflow-hidden">
  {#if sseConnected.value}
    <ul
      class="h-full overflow-y-auto py-3"
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
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-10 px-2">
      <MessageTyping />
    </div>
    {#if newMessagesCount !== 0 || isViewingOlder}
      <div
        class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col"
      >
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
  {:else}
    <div>Connecting to SSE...</div>
  {/if}
</div>
