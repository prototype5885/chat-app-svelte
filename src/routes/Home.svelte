<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "../router";

  onMount(async () => {
    const response = await fetch("/api/v1/test_auth");

    if (response.status === 200) {
      navigate("/chat");
    } else {
      navigate("/auth");
    }
  });
</script>
