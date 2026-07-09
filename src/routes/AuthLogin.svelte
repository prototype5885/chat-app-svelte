<script lang="ts">
  import { z } from "zod";
  import FormField from "../lib/FormField.svelte";
  import { ValidationIssue } from "../scripts/schemas";

  let username = $state<string>("");
  let password = $state<string>("");

  let usernameIssues = $state<string[] | undefined>();
  let passwordIssues = $state<string[] | undefined>();

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

    usernameIssues = undefined;
    passwordIssues = undefined;

    if (response.status === 200) {
      window.location.href = "#/chat";
    } else if (response.status === 400) {
      const rawIssues = await response.json();
      const issues = z.array(ValidationIssue).parse(rawIssues);

      issues.forEach((issue) => {
        if (issue.field === "username") {
          usernameIssues = issue.issues;
        } else if (issue.field === "password") {
          passwordIssues = issue.issues;
        }
      });
    } else if (response.status === 401) {
      const text = await response.text();
      usernameIssues = [text];
      passwordIssues = [text];
    }
  }
</script>

<div
  class="flex flex-col justify-center items-center h-screen select-non theme-diskord"
>
  <span class="mb-2 text-xl">Login</span>
  <FormField
    label="Username"
    bind:value={username}
    bind:issues={usernameIssues}
  />
  <FormField
    label="Password"
    bind:value={password}
    bind:issues={passwordIssues}
    type="password"
  />
  <button class="button-default w-48 my-4" onclick={handleSubmit}>Login</button>
  <a href="#/auth/registration">No account? Register</a>
</div>
