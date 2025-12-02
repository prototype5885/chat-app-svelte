<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    deleteChannel,
    deleteMessage,
    deleteServer,
  } from "../scripts/httpActions";

  interface CtxMenuItemBase {
    type: "item" | "separator";
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
    const id = element?.getAttribute("data-ctx-id");

    switch (type) {
      case "user": {
        menuItems = [
          {
            type: "item",
            label: "Add user",
            color: "default",
            action: () => {
              console.log(`TODO Adding user ID ${id}`);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Remove user",
            color: "red",
            action: () => {
              console.log(`TODO Removing user ID ${id}`);
            },
          },
          {
            type: "item",
            label: "Block User",
            color: "red",
            action: () => {
              console.log(`TODO Blocking user ID ${id}`);
            },
          },
          { type: "separator" },
          {
            type: "item",
            label: "Copy user ID",
            color: "default",
            action: () => {
              navigator.clipboard.writeText(id!);
              console.log(`Copied user ID ${id} to clipboard`);
            },
          },
        ];
        break;
      }
      case "server": {
        menuItems = [
          {
            type: "item",
            label: "Edit server",
            color: "default",
            action: async () => {
              console.log(`TODO Editing server ID ${id}`);
            },
          },
          {
            type: "separator",
          },
          {
            type: "item",
            label: "Delete server",
            color: "red",
            action: async () => {
              await deleteServer(id!);
            },
          },
        ];
        break;
      }
      case "channel": {
        menuItems = [
          {
            type: "item",
            label: "Edit channel",
            color: "default",
            action: async () => {
              console.log(`TODO Renaming channel ID ${id}`);
            },
          },
          {
            type: "separator",
          },
          {
            type: "item",
            label: "Delete channel",
            color: "red",
            action: async () => {
              await deleteChannel(id!);
            },
          },
        ];
        break;
      }
      case "message": {
        menuItems = [
          {
            type: "item",
            label: "Edit message",
            color: "default",
            action: () => {
              console.log(`TODO Editing message ID ${id}`);
            },
          },
          {
            type: "item",
            label: "Delete message",
            color: "red",
            action: async () => {
              await deleteMessage(id!);
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
  <div
    class="fixed z-50 min-w-36 shadow-lg/35 bg-black/40 shadow-black border border-white/10 p-2 backdrop-blur-sm rounded-lg"
    bind:this={ctxMenu}
    style="top: {position.y}px; left: {position.x}px"
  >
    <ul class="m-0 p-0 list-none">
      {#each menuItems as item}
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
        {#if item.type === "separator"}
          <div class="h-px my-1 mx-2 bg-white/25"></div>
        {/if}
      {/each}
    </ul>
  </div>
{/if}
