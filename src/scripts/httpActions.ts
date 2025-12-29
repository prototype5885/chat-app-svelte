import * as m from "./models";
import { errorToast } from "./toast.svelte";
import * as z from "zod/mini";

async function fetchWrapper(
  endpoint: string,
  options: RequestInit,
): Promise<void>;

async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit,
  schema?: z.ZodMiniType<T>,
): Promise<T>;

async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit,
  schema?: z.ZodMiniType<T> | undefined,
): Promise<void | T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errJson = await response.json();
    errorToast(errJson.detail, response.status.toString());
  }

  if (!schema) {
    return;
  }

  const json = await response.json();

  const result = schema.safeParse(json);
  if (!result.success) {
    errorToast(result.error.message, result.error.name, false);
    throw result.error;
  }

  return result.data;
}

export async function get_user_id() {
  const response = await fetch("/api/v1/user_id", { method: "GET" });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "./login.html";
      return;
    }
    errorToast(response.statusText, response.status.toString());
  }

  return await response.text();
}

export async function get_user_info() {
  return await fetchWrapper("/api/v1/user", { method: "GET" }, m.UserSchema);
}

export async function update_user_info(formData: FormData) {
  return await fetchWrapper(
    "/api/v1/user",
    {
      method: "PATCH",
      body: formData,
    },
    m.UpdateUserInfoSchema,
  );
}

export async function create_server(name: string) {
  return await fetchWrapper(
    "/api/v1/server",
    {
      method: "POST",
      body: JSON.stringify({ name: name }),
    },
    m.ServerSchema,
  );
}

export async function get_server_info(serverID: string) {
  return await fetchWrapper(
    `/api/v1/server/${serverID}`,
    { method: "GET" },
    m.ServerSchema,
  );
}

export async function update_server_info(formData: FormData, serverID: string) {
  return await fetchWrapper(
    `/api/v1/server/${serverID}`,
    {
      method: "PATCH",
      body: formData,
    },
    m.UpdateServerInfoSchema,
  );
}

export async function get_servers() {
  return await fetchWrapper(
    "/api/v1/servers",
    { method: "GET" },
    z.array(m.ServerSchema),
  );
}

export async function delete_server(serverID: string) {
  await fetchWrapper(`/api/v1/server/${serverID}`, {
    method: "DELETE",
  });

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID);

  // socket.io response
}

export async function create_channel(serverID: string, name: string) {
  await fetchWrapper(`/api/v1/server/${serverID}/channel`, {
    method: "POST",
    body: JSON.stringify({ name: name }),
  });

  // socket.io response
}

export async function get_channel_info(channelID: string) {
  return await fetchWrapper(
    `/api/v1/channel/${channelID}`,
    {
      method: "GET",
    },
    m.ChannelSchema,
  );
}

export async function update_channel_info(
  formData: FormData,
  channelID: string,
) {
  return await fetchWrapper(
    `/api/v1/channel/${channelID}`,
    {
      method: "PATCH",
      body: formData,
    },
    m.UpdateChannelInfoSchema,
  );

  // socket.io response
}

export async function get_channels(serverID: string) {
  return await fetchWrapper(
    `/api/v1/server/${serverID}/channels`,
    { method: "GET" },
    z.array(m.ChannelSchema),
  );
}

export async function delete_channel(channelID: string) {
  await fetchWrapper(`/api/v1/channel/${channelID}`, {
    method: "DELETE",
  });

  // socket.io response
}

export async function get_members(serverID: string) {
  return await fetchWrapper(
    `/api/v1/server/${serverID}/members`,
    { method: "GET" },
    z.array(m.UserDisplaySchema),
  );
}

export async function create_message(channelID: string, message: string) {
  await fetchWrapper(`/api/v1/channel/${channelID}/message`, {
    method: "POST",
    body: JSON.stringify({ message: message }),
  });

  // socket.io response
}

export async function edit_message(messageID: string, message: string) {
  await fetchWrapper(`/api/v1/message/${messageID}`, {
    method: "PATCH",
    body: JSON.stringify({ message: message }),
  });

  // socket.io response
}

export async function get_messages(channelID: string) {
  return await fetchWrapper(
    `/api/v1/channel/${channelID}/messages`,
    { method: "GET" },
    z.array(m.MessageSchema),
  );
}

export async function delete_message(messageID: string) {
  await fetchWrapper(`/api/v1/message/${messageID}`, { method: "DELETE" });

  // socket.io response
}

export async function typing(channelID: string, value: "start" | "stop") {
  await fetchWrapper(`/api/v1/channel/${channelID}/typing/${value}`, {
    method: "POST",
  });

  // socket.io response
}
