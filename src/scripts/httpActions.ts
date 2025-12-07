import { errorToast } from "./toast.svelte";

export async function get_user_info() {
  const response = await fetch("/api/v1/user", { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  return await response.json();
}

export async function update_user_info(formData: FormData) {
  const response = await fetch("/api/v1/user", {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  return await response.json();
}

export async function create_server(name: string) {
  const params = new URLSearchParams({
    name: name,
  });

  const response = await fetch(`/api/v1/server?${params}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  return await response.json();
}

export async function get_servers() {
  const response = await fetch("/api/v1/server", { method: "GET" });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  return await response.json();
}

export async function delete_server(serverID: string) {
  const params = new URLSearchParams({
    server_id: serverID,
  });

  const response = await fetch(`/api/v1/server?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID);
}

export async function create_channel(serverID: string, name: string) {
  const params = new URLSearchParams({
    server_id: serverID,
    name: name,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);
}

export async function get_channels(serverID: string, sid: string) {
  const params = new URLSearchParams({
    server_id: serverID,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "GET",
    headers: { Sid: sid },
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  return await response.json();
}

export async function delete_channel(serverID: string, channelID: string) {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);
}

export async function create_message(
  serverID: string,
  channelID: string,
  message: string
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

  if (!response.ok) errorToast(response.statusText, response.status, true);
}

export async function get_messages(
  serverID: string,
  channelID: string,
  sid: string
) {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/message?${params}`, {
    method: "GET",
    headers: { Sid: sid },
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);

  return await response.json();
}

export async function delete_message(messageID: string) {
  const params = new URLSearchParams({
    message_id: messageID,
  });

  const response = await fetch(`/api/v1/message?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);
}

export async function typing(
  serverID: string,
  channelID: string,
  value: "start" | "stop"
) {
  const params = new URLSearchParams({
    server_id: serverID,
    channel_id: channelID,
    value: value,
  });

  const response = await fetch(`/api/v1/typing?${params}`, {
    method: "POST",
  });

  if (!response.ok) errorToast(response.statusText, response.status, true);
}
