<script lang="ts">
  import { navigate } from "../router";
</script>

<div
  class="flex flex-col justify-center items-center h-screen select-none theme-diskord"
>
  <span class="text-3xl">Hallo</span>
  <div class="flex flex-col w-64 gap-2 my-6">
    <button class="button-default" onclick={() => navigate("/auth/login")}>
      Login
    </button>
    <button
      class="button-default"
      onclick={() => navigate("/auth/registration")}
    >
      Registration
    </button>
  </div>
</div>
