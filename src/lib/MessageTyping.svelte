<script lang="ts">
  import { currentChannel } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { typing } from "../scripts/httpActions";
  import {
    start_typing,
    stop_typing,
    wsSubscribe,
  } from "../scripts/websocket.svelte";

  let props: { chatInput: string } = $props();
  let isTyping = false;

  interface UserTyping {
    id: string;
    display_name: string | null;
  }

  let usersTyping = $state(new Map<string, string>());

  let usersTypingText = $state<string>("");
  let isAreTypingText = $state<string>("");

  $effect(() => {
    wsSubscribe(start_typing, (event: Event) => {
      const { detail: userTyping } = event as CustomEvent<UserTyping>;

      usersTyping.set(userTyping.id, userTyping.display_name!);
      valuesChanged();
    });

    wsSubscribe(stop_typing, (event: Event) => {
      const { detail: userTyping } = event as CustomEvent<UserTyping>;

      if (!usersTyping.delete(userTyping.id)) {
        errorToast(
          `'${stop_typing}' event received, but user ID '${userTyping.id}' was not found in usersTyping`,
        );
      }
      valuesChanged();
    });
  });

  function valuesChanged() {
    usersTypingText = "";
    let i = 0;
    usersTyping.forEach((user) => {
      usersTypingText += user;
      i++;
      if (usersTyping.size !== i) {
        usersTypingText += ", ";
      } else {
        if (usersTyping.size > 1) {
          isAreTypingText = " are typing...";
        } else {
          isAreTypingText = " is typing...";
        }
      }
    });
  }

  async function typingValueChanged(value: "start" | "stop") {
    if (!currentChannel.value) {
      errorToast("Can't send typing, there is no channel selected");
      return;
    }
    await typing(currentChannel.value.id, value);
  }

  $effect(() => {
    props.chatInput;

    if (props.chatInput !== "" && !isTyping) {
      isTyping = true;
      typingValueChanged("start");
    } else if (props.chatInput === "" && isTyping) {
      isTyping = false;
      typingValueChanged("stop");
    }
  });
</script>

{#if usersTypingText !== ""}
  <div class="h-8 flex items-center">
    <div class="flex flex-row rounded px-2 backdrop-blur-xl">
      <div id="svg-container" class="flex items-center">
        <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
        <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
        <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
      </div>
      <div class="ml-2">
        <span class="text-white text-xs">{usersTypingText}</span>
        <span class="text-white/75 text-xs">{isAreTypingText}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  #svg-container svg:nth-child(1) {
    animation-delay: 0s;
  }

  #svg-container svg:nth-child(2) {
    animation-delay: 0.25s;
  }

  #svg-container svg:nth-child(3) {
    animation-delay: 0.5s;
  }

  #svg-container svg {
    margin-left: 2px;
    margin-right: 2px;
    animation: size-change 1.5s infinite;
  }

  @keyframes size-change {
    0%,
    100% {
      transform: scale(1);
      fill-opacity: 0.5;
    }

    33% {
      transform: scale(1.5);
      fill-opacity: 1;
    }

    66% {
      transform: scale(1);
      fill-opacity: 0.5;
    }
  }
</style>
