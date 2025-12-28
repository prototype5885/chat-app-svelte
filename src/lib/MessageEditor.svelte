<script lang="ts">
  import {
    currentChannel,
    currentServer,
    editingMessage,
  } from "../scripts/globals.svelte";
  import { edit_message } from "../scripts/httpActions";
  import type { MessageModel } from "../scripts/models";
  import { errorToast } from "../scripts/toast.svelte";
  import AutoResizeTextarea from "./AutoResizeTextarea.svelte";

  const props: { msg: MessageModel } = $props();
  let editedMessage = $state<string>(props.msg.message);

  async function editMessage() {
    if (props.msg.message === editedMessage) return;
    if (!currentChannel.value) {
      errorToast("Can't edit chat message, there is no channel selected");
      return;
    }

    await edit_message(props.msg.id, editedMessage);

    cancel();
  }
  function cancel() {
    editingMessage.value = null;
  }
</script>

<div class="flex flex-col my-2 grow">
  <div class="flex rounded-lg bg-black/20 border border-color overflow-hidden">
    <AutoResizeTextarea
      bind:value={editedMessage}
      onEnter={editMessage}
      onEscape={cancel}
      placeholder=""
      maxRows={12}
    />
  </div>
  <div class="text-[11px] select-none text-white">
    <span>escape to </span>
    <button
      onclick={cancel}
      class="hover:underline cursor-pointer text-blue-300"
    >
      cancel
    </button>
    <span>enter to </span>
    <button
      onclick={editMessage}
      class="hover:underline cursor-pointer text-blue-300"
    >
      save
    </button>
  </div>
</div>
