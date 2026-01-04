<script lang="ts">
  import { getLongDate, getShortDate, utcToLocal } from "../scripts/date";
  import { currentUserID, editingMessage } from "../scripts/globals.svelte";
  import type { MessageResponse } from "../scripts/schemas";
  import Avatar from "./Avatar.svelte";
  import MessageEditor from "./MessageEditor.svelte";
  import MessageText from "./MessageText.svelte";

  let props: { msg: MessageResponse; small?: boolean } = $props();
</script>

<li>
  {#if !props.small}
    <div
      class={[
        "flex px-4 hover-bg select-text hover:bg-white/5",
        props.msg.id === editingMessage.value ? "bg-white/5" : "",
      ]}
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
        <Avatar
          size="40"
          pic={props.msg.picture}
          name={props.msg.display_name}
        />
      </div>

      <div class="pl-3 grow">
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
          <span
            class="ml-2 text-xs text-white/50 content-center cursor-default"
          >
            {getLongDate(props.msg.id)}
          </span>
        </div>
        <!-- message -->
        {#if props.msg.id === editingMessage.value}
          <MessageEditor msg={props.msg} />
        {:else}
          <MessageText text={props.msg.message} edited={props.msg.edited} />
        {/if}
      </div>
    </div>
  {:else}
    <div
      class={[
        "flex flex-row px-2 select-text hover:bg-white/5 group align-baseline",
        props.msg.id === editingMessage.value ? "bg-white/5" : "",
      ]}
      data-ctx-type="message"
      data-ctx-message-id={props.msg.id}
      data-ctx-own={props.msg.sender_id === currentUserID}
    >
      <div class="flex flex-row pl-3 grow">
        <!-- date -->
        <div
          class="text-[10px] mr-3 text-white/50 flex items-center min-w-9 max-w-9 cursor-default invisible group-hover:visible"
        >
          {getShortDate(props.msg.id)}
        </div>
        <!-- message -->
        {#if props.msg.id === editingMessage.value}
          <MessageEditor msg={props.msg} />
        {:else}
          <div class="py-0.5">
            <MessageText text={props.msg.message} edited={props.msg.edited} />
          </div>
        {/if}
      </div>
    </div>
  {/if}
</li>
