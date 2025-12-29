import * as m from "./models";
import { errorToast } from "./toast.svelte";
import * as z from "zod/mini";

const JSON_HEADER = { "Content-Type": "application/json" };

export async function get_user_id() {
  const response = await fetch("/api/v1/user_id", { method: "GET" });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "./login.html";
      return;
    }
    errorToast(response.statusText, response.statusText);
  }

  return await response.text();
}

export async function get_user_info() {
  const response = await fetch("/api/v1/user", { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.UserSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function update_user_info(
  formData: FormData,
): Promise<m.UpdateUserInfoModel> {
  const response = await fetch("/api/v1/user", {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.UpdateUserInfoSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function create_server(name: string): Promise<m.ServerModel> {
  const response = await fetch("/api/v1/server", {
    method: "POST",
    headers: JSON_HEADER,
    body: JSON.stringify({ name: name }),
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.ServerSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function get_server_info(
  serverID: string,
): Promise<m.ServerModel> {
  const response = await fetch(`/api/v1/server/${serverID}`, { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.ServerSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function update_server_info(
  formData: FormData,
  serverID: string,
): Promise<m.UpdateServerInfoModel> {
  const response = await fetch(`/api/v1/server/${serverID}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.UpdateServerInfoSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function get_servers(): Promise<m.ServerModel[]> {
  const response = await fetch("/api/v1/servers", { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.ServerSchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function delete_server(serverID: string) {
  const response = await fetch(`/api/v1/server/${serverID}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID);

  // socket.io response
}

export async function create_channel(serverID: string, name: string) {
  const response = await fetch(`/api/v1/server/${serverID}/channel`, {
    method: "POST",
    headers: JSON_HEADER,
    body: JSON.stringify({ name: name }),
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function get_channel_info(
  serverID: string,
  channelID: string,
): Promise<m.ChannelModel> {
  const response = await fetch(
    `/api/v1/server/${serverID}/channel/${channelID}`,
    { method: "GET" },
  );

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.ChannelSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function update_channel_info(
  formData: FormData,
  serverID: string,
  channelID: string,
): Promise<m.UpdateChannelInfoModel> {
  const response = await fetch(
    `/api/v1/server/${serverID}/channel/${channelID}`,
    {
      method: "PATCH",
      body: formData,
    },
  );

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.UpdateChannelInfoSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function get_channels(
  serverID: string,
): Promise<m.ChannelModel[]> {
  const response = await fetch(`/api/v1/server/${serverID}/channels`, {
    method: "GET",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.ChannelSchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function delete_channel(serverID: string, channelID: string) {
  const response = await fetch(
    `/api/v1/server/${serverID}/channel/${channelID}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function get_members(
  serverID: string,
): Promise<m.UserDisplayModel[]> {
  const response = await fetch(`/api/v1/server/${serverID}/members`, {
    method: "GET",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.UserDisplaySchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function create_message(channelID: string, message: string) {
  const response = await fetch(`/api/v1/channel/${channelID}/message`, {
    method: "POST",
    headers: JSON_HEADER,
    body: JSON.stringify({ message: message }),
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function edit_message(messageID: string, message: string) {
  const response = await fetch(`/api/v1/message/${messageID}`, {
    method: "PATCH",
    headers: JSON_HEADER,
    body: JSON.stringify({ message: message }),
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function get_messages(
  channelID: string,
): Promise<m.MessageModel[]> {
  const response = await fetch(`/api/v1/channel/${channelID}/messages`, {
    method: "GET",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.MessageSchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function delete_message(messageID: string) {
  const response = await fetch(`/api/v1/message/${messageID}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function typing(channelID: string, value: "start" | "stop") {
  const response = await fetch(`/api/v1/channel/${channelID}/typing/${value}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}
