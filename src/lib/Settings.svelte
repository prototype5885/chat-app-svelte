<script lang="ts">
  import CircleX from "../icons/CircleX.svelte";
  import { settingsVisible, theme } from "../scripts/globals.svelte";
  import SettingsAccount from "./SettingsAccount.svelte";
  import SettingsLanguage from "./SettingsLanguage.svelte";
  import SettingsUser from "./SettingsUser.svelte";

  interface SettingsElement {
    label: string;
    component: any;
  }

  interface SettingsGroup {
    label: string;
    children: SettingsElement[];
  }

  const elements: SettingsGroup[] = [
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

  let selectedLabel = elements[0]?.children[0]?.label ?? "";
  let SelectedComp = elements[0]?.children[0]?.component ?? null;
</script>

<div class={["fixed flex h-full w-full select-none", theme.value]}>
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
                     {selectedLabel === child.label
                ? 'bg-white/8 text-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}"
              on:click={() => {
                selectedLabel = child.label;
                SelectedComp = child.component;
              }}
            >
              {child.label}
            </button>
          {/each}
        {/if}
      {/each}
    </div>
  </div>

  <!-- middle part -->
  <div class="w-2/5">
    <h1 class="p-8">{selectedLabel}</h1>
    {@render SelectedComp()}
  </div>

  <!-- right side -->
  <div>
    <button
      on:click={() => {
        settingsVisible.value = false;
      }}
      class="rounded-full p-2 transition-all hover:bg-white/10"
    >
      <CircleX />
    </button>
  </div>
</div>
