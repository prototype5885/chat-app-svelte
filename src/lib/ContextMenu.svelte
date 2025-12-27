<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    delete_channel,
    delete_message,
    delete_server,
  } from "../scripts/httpActions";
  import { errorToast, infoToast } from "../scripts/toast.svelte";
  import { editingMessage, settings } from "../scripts/globals.svelte";

  interface CtxMenuItemBase {
    type: "item" | "separator";
    hide?: boolean;
  }

  interface CtxMenuItemItem extends CtxMenuItemBase {
    type: "item";
    label: string;
    color: "default" | "red";
    action: () => void;
  }

  interface CtxMenuItemSeparator extends CtxMenuItemBase {
    type: "separator";
  }

  type CtxMenuItem = CtxMenuItemItem | CtxMenuItemSeparator;

  interface Position {
    x: number;
    y: number;
  }

  let menuItems = $state<CtxMenuItem[]>([]);

  let visible = $state<boolean>(false);
  let position = $state<Position>({ x: 0, y: 0 });
  let ctxMenu = $state<HTMLElement | null>(null);

  function hideContextMenu() {
    visible = false;
    menuItems = [];
  }

  function showContextMenu(event: MouseEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const element = target.closest("[data-ctx-type]");
    const type = element?.getAttribute("data-ctx-type");
    const userID = element?.getAttribute("data-ctx-user-id") || undefined;
    const serverID = element?.getAttribute("data-ctx-server-id") || undefined;
    const channelID = element?.getAttribute("data-ctx-channel-id") || undefined;
    const messageID = element?.getAttribute("data-ctx-message-id") || undefined;

    const owner = element?.hasAttribute("data-ctx-own")
      ? element.getAttribute("data-ctx-own") === "true"
      : false;

    menuItems = [];

    switch (type) {
      case "user": {
        if (!userID) {
          errorToast(`User ID is '${userID}' in context menu type '${type}'`);
          return;
        }
        menuItems = [
          {
            type: "item",
            label: "Add user",
            color: "default",
            action: () => {
              infoToast(`TODO Adding user ID ${userID}`);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Remove user",
            color: "red",
            action: () => {
              infoToast(`TODO Removing user ID ${userID}`);
            },
          },
          {
            type: "item",
            label: "Block User",
            color: "red",
            action: () => {
              infoToast(`TODO Blocking user ID ${userID}`);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Copy user ID",
            color: "default",
            action: () => {
              navigator.clipboard.writeText(userID!);
              infoToast(`Copied user ID ${userID} to clipboard`);
            },
          },
        ];
        break;
      }
      case "server": {
        if (!serverID) {
          errorToast(
            `Server ID is '${serverID}' in context menu type '${type}'`,
          );
          return;
        }
        menuItems = [
          {
            type: "item",
            label: "Edit server",
            hide: !owner,
            color: "default",
            action: async () => {
              settings.value = { mode: "server", serverID: serverID };
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Delete server",
            hide: !owner,
            color: "red",
            action: async () => {
              await delete_server(serverID);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Copy server ID",
            color: "default",
            action: () => {
              navigator.clipboard.writeText(serverID!);
              infoToast(`Copied server ID ${serverID} to clipboard`);
            },
          },
        ];
        break;
      }
      case "channel": {
        if (!serverID) {
          errorToast(
            `Server ID is '${serverID}' in context menu type '${type}'`,
          );
          return;
        }
        if (!channelID) {
          errorToast(
            `Channel ID is '${channelID}' in context menu type '${type}'`,
          );
          return;
        }
        menuItems = [
          {
            type: "item",
            label: "Edit channel",
            color: "default",
            action: async () => {
              settings.value = {
                mode: "channel",
                serverID: serverID,
                channelID: channelID,
              };
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Delete channel",
            color: "red",
            action: async () => {
              await delete_channel(serverID, channelID);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Copy channel ID",
            color: "default",
            action: () => {
              navigator.clipboard.writeText(channelID!);
              infoToast(`Copied channel ID ${channelID} to clipboard`);
            },
          },
        ];
        break;
      }
      case "message": {
        if (!messageID) {
          errorToast(
            `Message ID is '${messageID}' in context menu type '${type}'`,
          );
          return;
        }
        menuItems = [
          {
            type: "item",
            label: "Edit message",
            hide: !owner,
            color: "default",
            action: () => {
              editingMessage.value = messageID;
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Delete message",
            hide: !owner,
            color: "red",
            action: async () => {
              await delete_message(messageID);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Copy message ID",
            color: "default",
            action: () => {
              navigator.clipboard.writeText(messageID!);
              infoToast(`Copied message ID ${messageID} to clipboard`);
            },
          },
        ];
        break;
      }
      default: // if something was clicked that doesn't have ctx menu
        hideContextMenu();
        return;
    }

    position = {
      x: event.clientX,
      y: event.clientY,
    };

    // remove hidden menu items
    menuItems = menuItems.filter((item) => !item.hide);

    visible = true;
  }

  onMount(() => {
    document.addEventListener("contextmenu", showContextMenu);
    document.addEventListener("click", hideContextMenu);
  });

  onDestroy(() => {
    document.removeEventListener("contextmenu", showContextMenu);
    document.removeEventListener("click", hideContextMenu);
  });
</script>

{#if visible}
  <div class="w-full h-full absolute z-50">
    <div
      class="fixed min-w-36 shadow-lg/35 bg-black/40 shadow-black border border-white/10 p-2 backdrop-blur-sm rounded-lg"
      bind:this={ctxMenu}
      style="top: {position.y}px; left: {position.x}px"
    >
      <ul class="m-0 p-0 list-none">
        {#each menuItems as item, index}
          {#if item.type === "item"}
            <li>
              <button
                class={[
                  "w-full px-2 py-2 text-sm rounded text-left",
                  `${
                    item.color == "red"
                      ? "text-red-500 hover:bg-red-500 hover:text-white"
                      : "text-white hover:bg-blue-500"
                  }`,
                ]}
                onclick={() => {
                  item.action();
                  visible = false;
                }}>{item.label}</button
              >
            </li>
          {/if}

          <!-- don't add separator if index is either the first or last, or if previous was also a separator -->
          {#if item.type === "separator" && index > 0 && index < menuItems.length - 1 && menuItems[index - 1].type !== "separator"}
            <div class="h-px my-1 mx-2 bg-white/25"></div>
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}
