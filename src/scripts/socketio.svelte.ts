import { io } from "socket.io-client";
import { errorToast } from "./toast.svelte";

export const create_server = "create_server";
export const delete_server = "delete_server";

export const create_channel = "create_channel";
export const delete_channel = "delete_channel";

export const create_message = "create_message";
export const delete_message = "delete_message";

export const start_typing = "start_typing";
export const stop_typing = "stop_typing";

export const user_status = "user_status";

export const subscribe_to_channel_list = "subscribe_to_channel_list";
export const subscribe_to_message_list = "subscribe_to_message_list";

export type socketIOstate = "connected" | "disconnected" | "connecting";

export const socket = io();

let connectionState = $state<socketIOstate>("connecting");
export const sioConnection = {
  get value() {
    return connectionState;
  },
  set value(newValue) {
    connectionState = newValue;
  },
};

let sioReconnectAttemptsState = $state<number>(0);
export const sioReconnectAttempts = {
  get value() {
    return sioReconnectAttemptsState;
  },
  set value(newValue) {
    sioReconnectAttemptsState = newValue;
  },
};

socket.on("connect", () => {
  sioConnection.value = "connected";
  sioReconnectAttempts.value = 0;
  console.log(`Socket.IO connected, sid: ${socket.id}`);
});

socket.on("disconnect", () => {
  sioConnection.value = "disconnected";
  console.log("Socket.IO disconnected");
});

socket.io.on("reconnect_attempt", () => {
  sioConnection.value = "connecting";
  sioReconnectAttempts.value += 1;
  console.log("Socket.IO reconnecting...");
});

socket.io.on("reconnect", () => {
  console.log("Socket.IO reconnected!");
});
