import { io } from "socket.io-client";

export const create_server = "create_server";
export const delete_server = "delete_server";

export const create_channel = "create_channel";
export const delete_channel = "delete_channel";

export const create_message = "create_message";
export const delete_message = "delete_message";

export const socket = io();

socket.on("connect", () => {
  console.log(`socket.io ID: ${socket.id}`);
});
