<script lang="ts">
  import { getLongDate } from "../scripts/date";
  import { currentUserID } from "../scripts/globals.svelte";
  import type { MessageModel } from "../scripts/models";
  import Avatar from "./Avatar.svelte";

  let props: { msg: MessageModel } = $props();
</script>

<li>
  <div
    class="flex px-3 hover-bg select-text hover:bg-white/5"
    data-ctx-type="message"
    data-ctx-message-id={props.msg.id}
    data-ctx-own={props.msg.sender_id === currentUserID}
  >
    <!-- avatar -->
    <div
      class="pt-1"
      data-ctx-type="user"
      data-ctx-user-id={props.msg.sender_id}
    >
      <Avatar size="40" pic={props.msg.picture} name={props.msg.display_name} />
    </div>

    <div class="pl-3">
      <div class="flex">
        <!-- name -->
        <span
          class="font-bold cursor-pointer content-center hover:underline"
          data-ctx-type="user"
          data-ctx-user-id={props.msg.sender_id}
        >
          {props.msg.display_name}
        </span>
        <!-- date -->
        <span class="ml-2 text-xs text-white/50 content-center cursor-default">
          {getLongDate(props.msg.id)}
        </span>
      </div>
      <!-- message -->
      <span class="break-all">{props.msg.message}</span>
    </div>
  </div>
</li>
