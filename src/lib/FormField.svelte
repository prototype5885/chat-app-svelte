<script lang="ts">
  import type { FullAutoFill, HTMLInputTypeAttribute } from "svelte/elements";

  let {
    label,
    type = "text",
    value = $bindable(""),
    required = false,
    disabled = false,
    autocomplete = undefined,
    issues = $bindable(),
    ...rest
  }: {
    label: string;
    type?: HTMLInputTypeAttribute;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: FullAutoFill;
    issues?: string[];
  } = $props();

  let focused = $state(false);

  let hasValue = $derived(
    value !== "" && value !== null && value !== undefined,
  );
  let floated = $derived(focused || hasValue);
</script>

<div class="py-3.5">
  <div class="relative">
    <input
      {type}
      {required}
      {disabled}
      {autocomplete}
      bind:value
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      class="peer w-full bg-black/20 border rounded-md px-4 py-2 text-gray-200 outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
           {issues
        ? 'border-red-500'
        : focused
          ? 'border-blue-400'
          : 'border-gray-600'}"
      {...rest}
    />
    <label
      for={label}
      class="absolute px-1 transition-all duration-150 pointer-events-none
           {floated ? '-top-6 left-0' : 'top-2.5 left-3 text-base'}
           {issues ? 'text-red-500' : focused ? 'text-white' : 'text-gray-200'}"
    >
      {label}{required ? " *" : ""}
    </label>

    {#if issues}
      <p class="mt-1 text-xs text-red-500">{issues}</p>
    {/if}
  </div>
</div>
