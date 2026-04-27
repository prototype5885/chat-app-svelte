<script lang="ts">
  import { navigate } from "../router";
</script>

<div>
  <button onclick={() => navigate("/auth/login")}>Login</button>
  <button onclick={() => navigate("/auth/registration")}>Registration</button>
</div>
