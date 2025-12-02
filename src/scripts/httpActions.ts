import { currentServer } from "./globals.svelte";

export async function deleteServer(serverID: string) {
  console.log(`Deleting server ID ${serverID}`);

  const params = new URLSearchParams({
    server_id: serverID,
  });

  const response = await fetch(`/api/v1/server?${params}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`${response.status} deleting server ID ${serverID}`);
  }
}

export async function deleteChannel(channelID: string) {
  console.log(`Deleting channel ID ${channelID}`);

  if (!currentServer.value) {
    throw new Error("No current server set");
  }

  const params = new URLSearchParams({
    server_id: currentServer.value.id,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`${response.status} deleting channel ID ${channelID}`);
  }
}

export async function deleteMessage(messageID: string) {
  console.log(`Deleting message ID ${messageID}`);

  const params = new URLSearchParams({
    message_id: messageID,
  });

  const response = await fetch(`/api/v1/message?${params}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`${response.status} deleting message ID ${messageID}`);
  }
}
