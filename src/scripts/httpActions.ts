import { z } from "zod";
import * as s from "./schemas";
import { sessionID } from "./session.svelte";
import { errorToast, warningToast } from "./toast.svelte";
import { JSONParse, JSONStringify } from "json-with-bigint";

async function fetchWrapper(
  endpoint: string,
  options: RequestInit,
  signal?: AbortSignal,
) {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  } else if (options.body instanceof FormData) {
    const hasFiles = [...options.body.values()].some((v) => v instanceof File);
    if (!hasFiles) {
      headers.set("Content-Type", "application/x-www-form-urlencoded");
      options.body = new URLSearchParams(options.body as any).toString();
    }
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    signal: signal,
  });

  if (response.redirected) {
    window.location.href = response.url;
    return;
  }

  if (response.status === 429) {
    warningToast("Being rate limited");
    return;
  }

  if (response.status === 413) {
    errorToast("Content too large");
  }

  if (!response.ok) {
    const errJson = await response.text();
    errorToast(errJson);
  }

  const contentType = response.headers.get("content-type");

  if (contentType) {
    if (contentType.includes("application/json")) {
      return JSONParse(await response.text());
    }

    if (contentType.includes("text/plain")) {
      return await response.text();
    }

    errorToast(`Unknown content-type: '${contentType}'`);
  }
}

export async function get_user_id(): Promise<bigint> {
  const data = await fetchWrapper("/api/v1/user_id", { method: "GET" });
  return BigInt(data);
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

export async function create_server(name: string) {
  const result = await fetchWrapper("/api/v1/server", {
    method: "POST",
    body: JSONStringify({ name: name }),
  });
  return await s.ServerSchema.parseAsync(result);
}

export async function get_server_info(serverID: bigint) {
  const result = await fetchWrapper(`/api/v1/server/${serverID}`, {
    method: "GET",
  });
  return await s.ServerSchema.parseAsync(result);
}

export async function update_server_info(formData: FormData, serverID: bigint) {
  const result = await fetchWrapper(`/api/v1/server/${serverID}`, {
    method: "PATCH",
    body: formData,
  });
  return await s.ServerSchema.parseAsync(result);
}

export async function upload_server_avatar(
  file: File | null,
  serverID: bigint,
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

export async function get_servers() {
  const result = await fetchWrapper("/api/v1/servers", { method: "GET" });
  return await z.array(s.ServerSchema).parseAsync(result);
}

export async function delete_server(serverID: bigint) {
  await fetchWrapper(`/api/v1/server/${serverID.toString()}`, {
    method: "DELETE",
  });

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID.toString());

  // SSE response
}

export async function create_channel(serverID: bigint, name: string) {
  await fetchWrapper(`/api/v1/server/${serverID}/channel`, {
    method: "POST",
    body: JSONStringify({ name: name }),
  });

  // SSE response
}

export async function get_channel_info(
  channelID: bigint,
): Promise<s.ChannelSchema> {
  return await fetchWrapper(`/api/v1/channel/${channelID}`, {
    method: "GET",
  });
}

export async function update_channel_info(
  formData: FormData,
  channelID: bigint,
): Promise<s.ChannelSchema> {
  return await fetchWrapper(`/api/v1/channel/${channelID}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function get_channels(
  serverID: bigint,
  signal: AbortSignal,
): Promise<s.ChannelSchema[]> {
  return await fetchWrapper(
    `/api/v1/server/${serverID}/channels`,
    {
      method: "GET",
      headers: { "Session-ID": sessionID },
    },
    signal,
  );
}

export async function delete_channel(channelID: bigint) {
  await fetchWrapper(`/api/v1/channel/${channelID.toString()}`, {
    method: "DELETE",
  });

  // SSE response
}

export async function get_members(serverID: bigint): Promise<s.UserSchema[]> {
  return await fetchWrapper(`/api/v1/server/${serverID}/members`, {
    method: "GET",
  });
}

export async function create_message(
  channelID: bigint,
  message: string,
  files: File[] = [],
) {
  const formData = new FormData();
  formData.append("message", message);
  files.forEach((file) => {
    formData.append("files", file);
  });

  await fetchWrapper(`/api/v1/channel/${channelID}/message`, {
    method: "POST",
    body: formData,
  });

  // SSE response
}

export async function edit_message(
  channelID: bigint,
  messageID: bigint,
  message: string,
) {
  await fetchWrapper(`/api/v1/channel/${channelID}/message/${messageID}`, {
    method: "PATCH",
    body: JSONStringify({ message: message }),
  });

  // SSE response
}

export async function get_messages(
  channelID: bigint,
  messageID: bigint | null = null,
  direction: "before" | "after" | null = null,
  signal: AbortSignal,
): Promise<s.MessageResponse[]> {
  const params = new URLSearchParams();
  if (messageID && direction) {
    params.append("messageID", messageID.toString());
    params.append("direction", direction);
  }

  let url = `/api/v1/channel/${channelID}/messages`;
  if (params.size !== 0) {
    url += `?${params}`;
  }

  return await fetchWrapper(
    url,
    {
      method: "GET",
      headers: { "Session-ID": sessionID },
    },
    signal,
  );
}

export async function delete_message(channelID: bigint, messageID: bigint) {
  await fetchWrapper(
    `/api/v1/channel/${channelID.toString()}/message/${messageID.toString()}`,
    {
      method: "DELETE",
    },
  );

  // SSE response
}

export async function typing(channelID: bigint, value: "start" | "stop") {
  await fetchWrapper(
    `/api/v1/channel/${channelID.toString()}/typing/${value}`,
    {
      method: "POST",
    },
  );

  // SSE response
}
