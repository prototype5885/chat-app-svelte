export type SettingsType = {
  mode: "off" | "user" | "server" | "channel";
  serverID?: string | bigint;
  channelID?: string | bigint;
};
