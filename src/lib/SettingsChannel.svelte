<script lang="ts">
  import { settings } from "../scripts/globals.svelte";
</script>

<div>
  <span>
    server id: {settings.value.serverID}
  </span>
  <br />
  <span>
    channel id: {settings.value.channelID}
  </span>
</div>
