<script lang="ts">
  import { getShortDate } from "../scripts/date";
  import type { MessageModel } from "../scripts/models";

  let props: { msg: MessageModel } = $props();
</script>

<li>
  <div
    class="flex flex-row px-1 select-text hover:bg-white/5 group align-baseline"
    data-ctx-type="message"
    data-ctx-message-id={props.msg.id}
  >
    <div class="flex flex-row pl-3">
      <!-- date -->
      <div
        class="text-[10px] mr-3 text-white/50 flex items-center min-w-9 max-w-9 cursor-default invisible group-hover:visible"
      >
        {getShortDate(props.msg.id)}
      </div>
      <!-- message -->
      <span class="break-all py-0.5">{props.msg.message}</span>
    </div>
  </div>
</li>
