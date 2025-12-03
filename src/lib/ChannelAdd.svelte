<script lang="ts">
  import Plus from "../icons/Plus.svelte";
  import { currentServer } from "../scripts/globals.svelte";

  async function createChannel() {
    if (!currentServer.value) return;

    const params = new URLSearchParams({
      server_id: currentServer.value.id,
      name: "New Channel",
    });

    const response = await fetch(`/api/v1/channel?${params}`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`${response.status} creating channel`);
    }
  }
</script>

<div class="flex flex-row justify-between">
  <span class="hover:text-white cursor-pointer">Text Channels</span>
  <button class="hover:text-white" onclick={createChannel}>
    <Plus />
  </button>
</div>
