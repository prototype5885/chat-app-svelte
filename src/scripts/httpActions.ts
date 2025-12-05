import { currentServer } from "./globals.svelte";
import { errorToast } from "./toast.svelte";

export async function deleteServer(serverID: string) {
  console.log(`Deleting server ID ${serverID}`);

  const params = new URLSearchParams({
    server_id: serverID,
  });

  const response = await fetch(`/api/v1/server?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    errorToast(response.statusText, response.status);
    return;
  }

  // no need to store last channel ID of this server anymore
  localStorage.removeItem(serverID);
}

export async function deleteChannel(channelID: string) {
  console.log(`Deleting channel ID ${channelID}`);

  if (!currentServer.value) {
    errorToast("Can't delete channel, there is no server selected");
    return;
  }

  const params = new URLSearchParams({
    server_id: currentServer.value.id,
    channel_id: channelID,
  });

  const response = await fetch(`/api/v1/channel?${params}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    errorToast(response.statusText, response.status);
    return;
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
    errorToast(response.statusText, response.status);
    return;
  }
}
