<script lang="ts">
  import Plus from "../icons/Plus.svelte";
  import { currentServer } from "../scripts/globals.svelte";
  import { create_channel } from "../scripts/httpActions";
  import { errorToast } from "../scripts/toast.svelte";

  async function createChannel() {
    if (!currentServer.value) {
      errorToast("Can't create channel, there is no server selected");
      return;
    }

    await create_channel(currentServer.value.id, "New Channel");
  }
</script>

<div class="flex flex-row justify-between">
  <span class="hover:text-white cursor-pointer">Text Channels</span>
  <button class="hover:text-white" onclick={createChannel}>
    <Plus />
  </button>
</div>
