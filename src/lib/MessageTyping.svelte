<script lang="ts">
  import { currentUserID } from "../scripts/globals.svelte";
  import { subscribeSSE } from "../scripts/session.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { JSONParse } from "json-with-bigint";

  let usersTyping = $state(new Map<bigint, string>());
  let usersTypingText = $state<string>("");
  let isAreTypingText = $state<string>("");

  subscribeSSE("typing", (e: any) => {
    const data = e.data;
    const firstSpace = data.indexOf(" ");
    const secondSpace = data.indexOf(" ", firstSpace + 1); // will be -1 if STOP action is received

    const action = Number(data.slice(0, firstSpace));
    const userID =
      secondSpace !== -1
        ? BigInt(data.slice(firstSpace + 1, secondSpace))
        : BigInt(data.slice(firstSpace + 1));
    const displayName = secondSpace !== -1 ? data.slice(secondSpace + 1) : null;

    // don't show own typing indicator
    if (data.id === currentUserID.value) {
      return;
    }

    if (action === 1) {
      // if START
      usersTyping.set(userID, displayName);
    } else {
      if (!usersTyping.delete(userID)) {
        errorToast(
          `stop typing event received, but user ID '${userID}' was not found in usersTyping`,
        );
      }
    }

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
