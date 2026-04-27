import { createRouter } from "sv-router";
import Home from "./routes/Home.svelte";
import Chat from "./routes/Chat.svelte";
import Auth from "./routes/Auth.svelte";
import AuthRegistration from "./routes/AuthRegistration.svelte";
import AuthLogin from "./routes/AuthLogin.svelte";
import NotFound from "./routes/NotFound.svelte";

export const { p, navigate, isActive, preload, route } = createRouter({
  "/": Home,
  "/auth": {
    "/": Auth,
    "/login": AuthLogin,
    "/registration": AuthRegistration,
  },
  "/chat": Chat,
  "*notfound": NotFound,
});
