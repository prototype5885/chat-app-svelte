import { errorToast } from "./toast.svelte";

export const create_server = "create_server";
export const delete_server = "delete_server";

export const create_channel = "create_channel";
export const delete_channel = "delete_channel";
export const modify_channel = "modify_channel";

export const create_message = "create_message";
export const edit_message = "edit_message";
export const delete_message = "delete_message";

export const start_typing = "start_typing";
export const stop_typing = "stop_typing";

export const user_status = "user_status";

export const user_info = "user_info";
export const self_user_info = "self_user_info"; // this is only sent to a single user
export const server_info = "server_info";

export const subscribe_to_channel_list = "subscribe_to_channel_list";
export const subscribe_to_message_list = "subscribe_to_message_list";

export type websocketState = "connected" | "disconnected" | "connecting";

let connectionState = $state<websocketState>("connecting");
export const wsConnection = {
  get value() {
    return connectionState;
  },
};

let reconnectAttempts = $state<number>(0);
export const wsReconnectAttempts = {
  get value() {
    return reconnectAttempts;
  },
};

let errorText = $state<string>("");
export const wsErrorText = {
  get value() {
    return errorText;
  },
};

let socket: WebSocket | null = null;
const wsEvent = new EventTarget();

export function connect() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${window.location.host}/ws`;

  console.log("Connecting to Websocket...");
  connectionState = "connecting";
  socket = new WebSocket(url);

  socket.onopen = () => {
    connectionState = "connected";
    reconnectAttempts = 0;
    console.log("Websocket connected!");
  };

  socket.onmessage = (event) => {
    const firstSpace = event.data.indexOf(" ");
    if (firstSpace !== -1) {
      const eventName = event.data.slice(0, firstSpace);
      const eventData = event.data.slice(firstSpace + 1);

      if (eventName === "exception") {
        errorToast(eventData);
        return;
      }

      wsEvent.dispatchEvent(new CustomEvent(eventName, { detail: eventData }));
    } else {
      errorToast(`Server sent invalid message: '${event.data}'`);
    }
  };

  socket.onclose = () => {
    connectionState = "disconnected";

    console.log("Retrying reconnection to Websocket in 5 seconds...");
    reconnectAttempts++;
    setTimeout(connect, 5000);
  };

  socket.onerror = () => {
    errorText =
      "Websocket connection error, server is either offline or you tried to connect from too many tabs/clients";
    console.error(errorText);
    socket?.close();
  };
}

export function wsSubscribe(
  eventName: string,
  handler: EventListenerOrEventListenerObject,
) {
  $effect(() => {
    wsEvent.addEventListener(eventName, handler);
    return () => wsEvent.removeEventListener(eventName, handler);
  });
}

export function sendWs(event: string, msg: string | null = "{}") {
  if (socket?.readyState === WebSocket.OPEN) {
    if (!msg) msg = "{}";
    socket.send(`${event} ${msg}`);
  } else {
    console.warn("Tried to send message while Websocket was not OPEN.");
  }
}

connect();
