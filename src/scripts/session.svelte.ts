// export const create_server = "create_server";
// export const delete_server = "delete_server";

// export const create_channel = "create_channel";
// export const delete_channel = "delete_channel";
// export const modify_channel = "modify_channel";

// export const create_message = "create_message";
// export const edit_message = "edit_message";
// export const delete_message = "delete_message";

// export const start_typing = "start_typing";
// export const stop_typing = "stop_typing";

// export const user_status = "user_status";

// export const session_id = "session_id";
// export const user_info = "user_info";
// export const self_user_info = "self_user_info"; // this is only sent to a single user
// export const server_info = "server_info";
// export const user_online = "user_online";

export const subscribe_to_channel_list = "subscribe_to_channel_list";
export const subscribe_to_message_list = "subscribe_to_message_list";

let sseConnectedState = $state<boolean>(false);
export const sseConnected = {
  get value() {
    return sseConnectedState;
  },
};

let sseConnectionAttemptsState = $state<number>(0);
export const sseConnectionAttempts = {
  get value() {
    return sseConnectionAttemptsState;
  },
};

export let sessionID = "";

const eventSource = new EventSource(`/api/v1/session`);

eventSource.onopen = () => {
  sseConnectionAttemptsState = 0;
  sseConnectedState = true;
};

eventSource.onerror = (err) => {
  sseConnectedState = false;
  sseConnectionAttemptsState++;
};

eventSource.addEventListener("session_id", (e) => {
  if (sessionID === "") {
    sessionID = e.data;
  }
});

// this will allow components to subscribe to events and automatically unsubscribe
export function subscribeSSE(
  eventName: string,
  handler: EventListenerOrEventListenerObject,
) {
  $effect(() => {
    eventSource.addEventListener(eventName, handler);
    return () => {
      eventSource.removeEventListener(eventName, handler);
    };
  });
}
