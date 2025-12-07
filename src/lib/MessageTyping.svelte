<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    socket,
    start_typing,
    stop_typing,
  } from "../scripts/socketio.svelte";
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { typing } from "../scripts/httpActions";

  let props: { chatInput: string } = $props();
  let isTyping = false;

  let usersTyping = new Set<string>([]);
  let usersTypingText = $state<string>("");
  let isAreTypingText = $state<string>("");
  let events: string[] = [];

  onMount(async () => {
    socket.on(start_typing, (userID: string) => {
      events.push(start_typing);
      usersTyping.add(userID);
      values_changed();
    });

    socket.on(stop_typing, (userID: string) => {
      events.push(stop_typing);
      usersTyping.delete(userID);
      values_changed();
    });
  });

  function values_changed() {
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
    if (!currentServer.value) {
      errorToast("Can't send typing, there is no server selected");
      return;
    }
    if (!currentChannel.value) {
      errorToast("Can't send typing, there is no channel selected");
      return;
    }
    await typing(currentServer.value.id, currentChannel.value.id, value);
  }

  $effect(() => {
    props.chatInput;

    if (props.chatInput !== "" && !isTyping) {
      isTyping = true;
      typingValueChanged("start");
    } else if (props.chatInput === "") {
      isTyping = false;
      typingValueChanged("stop");
    }
  });

  onDestroy(() => {
    events.forEach((event) => {
      socket.off(event);
    });
  });
</script>

<div class="px-2 h-8 flex items-center">
  {#if usersTypingText !== ""}
    <div class="flex flex-row">
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
  {/if}
</div>

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
