import { get_user_id } from "./httpActions";
import type { ChannelSchema, ServerSchema } from "./schemas";
import type { SettingsType } from "./types";

export const currentUserID = await get_user_id();

let editingMessageState = $state<string | null>(null);
export const editingMessage = {
  get value() {
    return editingMessageState;
  },
  set value(newValue) {
    editingMessageState = newValue;
  },
};

let currentServerState = $state<ServerSchema>();
export const currentServer = {
  get value() {
    return currentServerState;
  },
  set value(newValue) {
    currentServerState = newValue;
  },
};

let currentChannelIDState = $state<ChannelSchema>();
export const currentChannel = {
  get value() {
    return currentChannelIDState;
  },
  set value(newValue) {
    currentChannelIDState = newValue;

    // reset editing message value
    editingMessage.value = null;

    // set last selected channel on a server
    if (currentServer.value && currentChannel.value) {
      localStorage.setItem(currentServer.value.id, currentChannel.value.id);
    }
  },
};

let settingsState = $state<SettingsType>({ mode: "off" });
export const settings = {
  get value() {
    return settingsState;
  },
  set value(newValue) {
    settingsState = newValue;
  },
};

let themeState = $state<string>("theme-diskord");
export const theme = {
  get value() {
    return themeState;
  },
  set value(newValue) {
    themeState = newValue;
  },
};
