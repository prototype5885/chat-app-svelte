<script lang="ts">
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { create_message, typing } from "../scripts/httpActions";
  import MessageTyping from "./MessageTyping.svelte";
  import AutoResizeTextarea from "./AutoResizeTextarea.svelte";
  import Plus from "../icons/Plus.svelte";

  let chatInput = $state<string>("");
  let isTyping = false;

  async function sendMessage() {
    if (chatInput === "") return;
    if (!currentChannel.value) {
      errorToast("Can't send chat message, there is no channel selected");
      return;
    }

    await create_message(currentChannel.value.id, chatInput);

    chatInput = "";
  }

  async function typingValueChanged(value: "start" | "stop") {
    if (!currentChannel.value) {
      errorToast("Can't send typing, there is no channel selected");
      return;
    }
    await typing(currentChannel.value.id, value);
  }

  $effect(() => {
    chatInput;

    if (chatInput !== "" && !isTyping) {
      isTyping = true;
      typingValueChanged("start");
    } else if (chatInput === "" && isTyping) {
      isTyping = false;
      typingValueChanged("stop");
    }
  });
</script>

<div class="px-2 pb-2 relative w-full">
  <div
    class="flex rounded-lg bg-white/3 border border-color overflow-hidden px-2"
  >
    <div class="flex justify-center items-center">
      <button class="hover:bg-white/10 m-1 rounded-lg">
        <Plus />
      </button>
    </div>
    <AutoResizeTextarea
      bind:value={chatInput}
      onEnter={sendMessage}
      placeholder={`Message #${currentChannel.value?.name}`}
      maxRows={12}
    />
  </div>
</div>
