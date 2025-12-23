import * as m from "./models";
import { errorToast } from "./toast.svelte";
import * as z from "zod/mini";

export async function get_user_id() {
  const response = await fetch("/api/v1/user_id", { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.statusText);

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
  const params = new URLSearchParams({
    name: name,
  });

  const response = await fetch(`/api/v1/server?${params}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = m.ServerSchema.safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function get_servers(): Promise<m.ServerModel[]> {
  const response = await fetch("/api/v1/server", { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.ServerSchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function delete_server(serverID: string) {
  const params = new URLSearchParams({
    server_id: serverID,
  });

  const response = await fetch(`/api/v1/server?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID);

  // socket.io response
}

export async function create_channel(serverID: string, name: string) {
  const params = new URLSearchParams({
    server_id: serverID,
    name: name,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function get_channels(
  serverID: string,
): Promise<m.ChannelModel[]> {
  const params = new URLSearchParams({
    server_id: serverID,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "GET",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.ChannelSchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function delete_channel(serverID: string, channelID: string) {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function get_members(
  serverID: string,
  channelID: string,
): Promise<m.UserDisplayModel[]> {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/member?${params}`, {
    method: "GET",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.UserDisplaySchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function create_message(
  serverID: string,
  channelID: string,
  message: string,
) {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/message?${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function get_messages(
  serverID: string,
  channelID: string,
): Promise<m.MessageModel[]> {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/message?${params}`, {
    method: "GET",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  const result = z.array(m.MessageSchema).safeParse(await response.json());
  if (!result.success) errorToast(result.error.message, result.error.name);

  return result.data!;
}

export async function delete_message(messageID: string) {
  const params = new URLSearchParams({
    message_id: messageID,
  });

  const response = await fetch(`/api/v1/message?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}

export async function typing(
  serverID: string,
  channelID: string,
  value: "start" | "stop",
) {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
    value: value,
  });

  const response = await fetch(`/api/v1/typing?${params}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.statusText);

  // socket.io response
}
