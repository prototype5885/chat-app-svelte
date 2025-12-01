import type { ChannelModel, ServerModel } from "./models";

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
