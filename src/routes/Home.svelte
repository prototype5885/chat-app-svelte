<script lang="ts">
  import { onMount } from "svelte";
  import { currentUserID } from "../scripts/globals.svelte";
  import { navigate } from "../router";

  onMount(async () => {
    const response = await fetch("/api/v1/test_auth");
    currentUserID.value = await response.text();

    if (response.status === 200 && currentUserID.value) {
      navigate("/chat");
    } else {
      navigate("/auth");
    }
  });
</script>
