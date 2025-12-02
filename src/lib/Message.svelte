<script lang="ts">
  import { extractTime } from "../scripts/extractDate";
  import type { MessageModel } from "../scripts/models";
  import Avatar from "./Avatar.svelte";

  export let msg: MessageModel;
</script>

<li>
  <div
    class="flex flex-row px-3 py-1 hover-bg select-text hover:bg-white/5"
    data-ctx-type="message"
    data-ctx-id={msg.id}
  >
    <!-- avatar -->
    <div data-ctx-type="user" data-ctx-id={msg.sender_id}>
      <Avatar size="40" pic={msg.picture} name={msg.display_name} />
    </div>

    <div class="flex flex-col pl-3">
      <div class="flex flex-row">
        <!-- name -->
        <span
          class="font-bold cursor-pointer content-center hover:underline"
          data-ctx-type="user"
          data-ctx-id={msg.sender_id}
        >
          {msg.display_name}
        </span>
        <!-- date -->
        <span class="ml-2 text-xs text-white/50 content-center cursor-default">
          {extractTime(msg.id, "long")}
        </span>
      </div>
      <!-- message -->
      <span class="break-all">{msg.message}</span>
    </div>
  </div>
</li>
