<script lang="ts">
  import { currentChannel, currentServer } from "../scripts/globals.svelte";
  import { errorToast } from "../scripts/toast.svelte";
  import { create_message } from "../scripts/httpActions";
  import MessageTyping from "./MessageTyping.svelte";
  import AutoResizeTextarea from "./AutoResizeTextarea.svelte";

  let chatInput = $state<string>("");

  async function sendMessage() {
    if (chatInput === "") return;
    if (!currentServer.value) {
      errorToast("Can't send chat message, there is no server selected");
      return;
    }
    if (!currentChannel.value) {
      errorToast("Can't send chat message, there is no channel selected");
      return;
    }

    await create_message(
      currentServer.value.id,
      currentChannel.value.id,
      chatInput,
    );

    chatInput = "";
  }
</script>

<div class="px-2 pb-2 relative w-full">
  <div class="absolute bottom-full pointer-events-none">
    <MessageTyping {chatInput} />
  </div>
  <div class="flex rounded-lg bg-white/3 border border-color overflow-hidden">
    <AutoResizeTextarea
      bind:value={chatInput}
      onEnter={sendMessage}
      placeholder={`Message #${currentChannel.value?.name}`}
      maxRows={12}
    />
  </div>
</div>
