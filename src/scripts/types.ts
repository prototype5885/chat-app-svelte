export type SettingsType = {
  mode: "off" | "user" | "server" | "channel";
  serverID?: bigint;
  channelID?: bigint;
};
