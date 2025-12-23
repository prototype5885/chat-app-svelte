<script lang="ts">
  import { type Component } from "svelte";
  import CircleX from "../icons/CircleX.svelte";
  import { settings, theme } from "../scripts/globals.svelte";
  import SettingsAccount from "./SettingsAccount.svelte";
  import SettingsLanguage from "./SettingsLanguage.svelte";
  import SettingsUser from "./SettingsUser.svelte";
  import SettingsServer from "./SettingsServer.svelte";
  import SettingsChannel from "./SettingsChannel.svelte";

  interface SettingsElement {
    label: string;
    component: Component | null;
  }

  interface SettingsGroup {
    label: string;
    children: SettingsElement[];
  }

  const elements = $derived.by<SettingsGroup[]>(() => {
    switch (settings.value.mode) {
      case "user":
        return [
          {
            label: "User Settings",
            children: [
              { label: "Profile", component: SettingsUser },
              { label: "My Account", component: SettingsAccount },
            ],
          },
          {
            label: "App Settings",
            children: [{ label: "Language", component: SettingsLanguage }],
          },
        ];
      case "server":
        return [
          {
            label: "Server Settings",
            children: [{ label: "Server Profile", component: SettingsServer }],
          },
        ];
      case "channel":
        return [
          {
            label: "Channel Settings",
            children: [
              { label: "Channel Profile", component: SettingsChannel },
            ],
          },
        ];
      default:
        return [
          { label: "Error", children: [{ label: "Error", component: null }] },
        ];
    }
  });

  let selected = $derived<SettingsElement>(elements[0].children[0]);
</script>

<div class={["fixed flex h-full w-full select-none z-10", theme.value]}>
  <!-- left side -->
  <div class="bg-black/20 flex justify-end w-1/3 p-2">
    <div>
      {#each elements as element}
        <h1 class="ml-2 pt-4 text-sm uppercase text-white/50">
          {element.label}
        </h1>

        {#if element.children}
          {#each element.children as child (child.label)}
            <button
              class="w-full rounded-md p-2 text-left
                     {selected?.label === child.label
                ? 'bg-white/8 text-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}"
              onclick={() => {
                selected = child;
              }}
            >
              {child.label}
            </button>
          {/each}
        {/if}
      {/each}
    </div>
  </div>

  <!-- right side -->
  <div class="w-2/5">
    <h1 class="p-8">{selected?.label}</h1>
    {#if selected}
      {@const Selected = selected.component}
      <Selected />
    {/if}
  </div>

  <!-- far right side (close button) -->
  <div>
    <button
      onclick={() => {
        settings.value = { mode: "off" };
      }}
      class="rounded-full p-2 transition-all hover:bg-white/10"
    >
      <CircleX />
    </button>
  </div>
</div>
