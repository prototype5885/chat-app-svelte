import { z } from "zod";
import type { ChannelSchema, ServerSchema } from "./schemas";
import type { SettingsType } from "./types";

let _currentUserID = $state<bigint>();
export const currentUserID = {
  get value() {
    return _currentUserID;
  },
  set value(newValue) {
    _currentUserID = newValue;
    console.log(`User ID is: ${_currentUserID}`);
  },
};

let _editingMessage = $state<bigint | null>(null);
export const editingMessage = {
  get value() {
    return _editingMessage;
  },
  set value(newValue) {
    _editingMessage = newValue;
  },
};

let _currentServer = $state<z.infer<typeof ServerSchema>>();
export const currentServer = {
  get value() {
    return _currentServer;
  },
  set value(newValue) {
    _currentServer = newValue;
    console.log(`Current server ID is: ${_currentServer?.id}`);
  },
};

let _currentChannel = $state<z.infer<typeof ChannelSchema>>();
export const currentChannel = {
  get value() {
    return _currentChannel;
  },
  set value(newValue) {
    _currentChannel = newValue;

    // reset editing message value
    editingMessage.value = null;

    // set last selected channel on a server
    if (currentServer.value && currentChannel.value) {
      localStorage.setItem(
        currentServer.value.id.toString(),
        currentChannel.value.id.toString(),
      );
    }
    console.log(`Current channel ID is: ${_currentChannel?.id}`);
  },
};

let _settings = $state<SettingsType>({ mode: "off" });
export const settings = {
  get value() {
    return _settings;
  },
  set value(newValue) {
    _settings = newValue;
  },
};

let _theme = $state<string>("theme-diskord");
export const theme = {
  get value() {
    return _theme;
  },
  set value(newValue) {
    _theme = newValue;
  },
};
