<script lang="ts">
  let username = $state<string>("");
  let password = $state<string>("");
  let passwordRepeat = $state<string>("");

  async function handleSubmit() {
    if (password !== passwordRepeat) {
      alert("Passwords don't match");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("password_repeat", passwordRepeat);

    const response = await fetch("/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (response.status === 200) {
      window.location.href = "#/auth/login";
    }
  }
</script>

<div>
  <div>
    <div>
      <h1>Registration</h1>
    </div>

    <div>
      <span>Username</span>
      <input bind:value={username} type="text" />
    </div>

    <div>
      <span>Password</span>
      <input bind:value={password} type="password" />
    </div>

    <div>
      <span>Confirm Password</span>
      <input bind:value={passwordRepeat} type="password" />
    </div>

    <button onclick={handleSubmit}>Login</button>

    <div>
      <a href="#/auth/login">Already have an account?</a>
    </div>
  </div>
</div>
