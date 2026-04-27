<script lang="ts">
  let username = $state<string>("");
  let password = $state<string>("");

  async function handleSubmit() {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch("/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (response.status === 200) {
      window.location.href = "#/chat";
    }
  }
</script>

<div>
  <div>
    <div>
      <h1>Login</h1>
    </div>
    <div>
      <div>
        <span>Username</span>
        <input bind:value={username} type="text" />
      </div>

      <div>
        <span>Password</span>
        <input bind:value={password} type="password" />
      </div>

      <button onclick={handleSubmit}>Login</button>

      <div>
        <a href="#/auth/registration">No account? Register</a>
      </div>
    </div>
  </div>
</div>
