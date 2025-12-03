import type { ChannelModel, ServerModel, UserModel } from "./models";

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
  },
};

let settingsVisibleState = $state<boolean>(false);
export const settingsVisible = {
  get value() {
    return settingsVisibleState;
  },
  set value(newValue) {
    settingsVisibleState = newValue;
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
