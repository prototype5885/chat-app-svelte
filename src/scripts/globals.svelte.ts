import type { ChannelModel, ServerModel, UserModel } from "./models";
import type { SettingsType } from "./types";

let userDataState = $state<UserModel>();
export const userData = {
  get value() {
    return userDataState;
  },
  set value(newValue) {
    userDataState = newValue;
  },
};

let currentServerState = $state<ServerModel>();
export const currentServer = {
  get value() {
    return currentServerState;
  },
  set value(newValue) {
    currentServerState = newValue;
  },
};

let currentChannelIDState = $state<ChannelModel>();
export const currentChannel = {
  get value() {
    return currentChannelIDState;
  },
  set value(newValue) {
    currentChannelIDState = newValue;

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
