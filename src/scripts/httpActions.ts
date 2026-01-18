import type * as s from "./schemas";
import { errorToast } from "./toast.svelte";

async function fetchWrapper(endpoint: string, options: RequestInit) {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (response.redirected) {
    window.location.href = response.url;
    return;
  }

  if (!response.ok) {
    const errJson = await response.json();
    errorToast(JSON.stringify(errJson), response.status.toString());
  }

  const contentType = response.headers.get("content-type");

  if (contentType) {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    if (contentType.includes("text/plain")) {
      return await response.text();
    }

    errorToast(`Unknown content-type: '${contentType}'`);
  }
}

export async function get_user_id(): Promise<string> {
  return await fetchWrapper("/api/v1/user_id", { method: "GET" });
}

export async function get_user_info(): Promise<s.UserSchema> {
  return await fetchWrapper("/api/v1/user", { method: "GET" });
}

export async function update_user_info(
  formData: FormData,
): Promise<s.UserEditResponse> {
  return await fetchWrapper("/api/v1/user", {
    method: "PATCH",
    body: formData,
  });
}

export async function upload_user_avatar(
  file: File | null,
): Promise<string | null> {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }

  return await fetchWrapper("/api/v1/user/upload/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function create_server(name: string): Promise<s.ServerSchema> {
  return await fetchWrapper("/api/v1/server", {
    method: "POST",
    body: JSON.stringify({ name: name }),
  });
}

export async function get_server_info(
  serverID: string,
): Promise<s.ServerSchema> {
  return await fetchWrapper(`/api/v1/server/${serverID}`, { method: "GET" });
}

export async function update_server_info(
  formData: FormData,
  serverID: string,
): Promise<s.ServerSchema> {
  return await fetchWrapper(`/api/v1/server/${serverID}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function upload_server_avatar(
  file: File | null,
  serverID: string,
): Promise<string | null> {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }

  return await fetchWrapper(`/api/v1/server/${serverID}/upload/avatar`, {
    method: "POST",
    body: formData,
  });
}

export async function get_servers(): Promise<s.ServerSchema[]> {
  return await fetchWrapper("/api/v1/servers", { method: "GET" });
}

export async function delete_server(serverID: string) {
  await fetchWrapper(`/api/v1/server/${serverID}`, {
    method: "DELETE",
  });

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID);

  // Websocket response
}

export async function create_channel(serverID: string, name: string) {
  await fetchWrapper(`/api/v1/server/${serverID}/channel`, {
    method: "POST",
    body: JSON.stringify({ name: name }),
  });

  // Websocket response
}

export async function get_channel_info(
  channelID: string,
): Promise<s.ChannelSchema> {
  return await fetchWrapper(`/api/v1/channel/${channelID}`, {
    method: "GET",
  });
}

export async function update_channel_info(
  formData: FormData,
  channelID: string,
) {
  await fetchWrapper(`/api/v1/channel/${channelID}`, {
    method: "PATCH",
    body: formData,
  });

  // Websocket response
}

export async function get_channels(
  serverID: string,
): Promise<s.ChannelSchema[]> {
  return await fetchWrapper(`/api/v1/server/${serverID}/channels`, {
    method: "GET",
  });
}

export async function delete_channel(channelID: string) {
  await fetchWrapper(`/api/v1/channel/${channelID}`, {
    method: "DELETE",
  });

  // Websocket response
}

export async function get_members(serverID: string): Promise<s.UserSchema[]> {
  return await fetchWrapper(`/api/v1/server/${serverID}/members`, {
    method: "GET",
  });
}

export async function create_message(channelID: string, message: string) {
  await fetchWrapper(`/api/v1/channel/${channelID}/message`, {
    method: "POST",
    body: JSON.stringify({ message: message }),
  });

  // Websocket response
}

export async function edit_message(messageID: string, message: string) {
  await fetchWrapper(`/api/v1/message/${messageID}`, {
    method: "PATCH",
    body: JSON.stringify({ message: message }),
  });

  // Websocket response
}

export async function get_messages(
  channelID: string,
  messageID: string | null = null,
  direction: "before" | "after" | null = null,
): Promise<s.MessageResponse[]> {
  const params = new URLSearchParams();
  if (messageID) params.append("message_id", messageID);
  if (direction) params.append("direction", direction);

  let url = `/api/v1/channel/${channelID}/messages`;
  if (params.size !== 0) {
    url += `?${params}`;
  }

  return await fetchWrapper(url, {
    method: "GET",
  });
}

export async function delete_message(messageID: string) {
  await fetchWrapper(`/api/v1/message/${messageID}`, { method: "DELETE" });

  // Websocket response
}

export async function typing(channelID: string, value: "start" | "stop") {
  await fetchWrapper(`/api/v1/channel/${channelID}/typing/${value}`, {
    method: "POST",
  });

  // Websocket response
}
