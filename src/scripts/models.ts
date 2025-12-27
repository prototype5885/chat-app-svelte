import * as z from "zod/mini";

const USERNAME = z.string().check(z.minLength(6), z.maxLength(32));
const DISPLAY_NAME = z.string().check(z.minLength(1), z.maxLength(64));
const SERVER_NAME = z.string().check(z.minLength(1), z.maxLength(64));
const CHANNEL_NAME = z.string().check(z.minLength(1), z.maxLength(32));
const MESSAGE = z.string().check(z.minLength(1), z.maxLength(4096));

// main models
export const ServerSchema = z.object({
  id: z.ulid(),
  owner_id: z.ulid(),
  name: SERVER_NAME,
  picture: z.nullable(z.string()),
  banner: z.nullable(z.string()),
  roles: z.nullable(z.array(z.string())),
});
export type ServerModel = z.infer<typeof ServerSchema>;

export const ChannelSchema = z.object({
  id: z.ulid(),
  server_id: z.ulid(),
  name: CHANNEL_NAME,
});
export type ChannelModel = z.infer<typeof ChannelSchema>;

export const MessageSchema = z.object({
  id: z.ulid(),
  channel_id: z.ulid(),
  sender_id: z.ulid(),
  display_name: DISPLAY_NAME,
  picture: z.nullable(z.string()),
  message: MESSAGE,
  attachments: z.nullable(z.array(z.string())),
  edited: z.nullable(z.string()),
});
export type MessageModel = z.infer<typeof MessageSchema>;

// DTOs
export const MessageEditResponseSchema = z.object({
  message_id: z.ulid(),
  message: MESSAGE,
  edited: z.string(),
});
export type MessageEditResponseModel = z.infer<
  typeof MessageEditResponseSchema
>;

export const UserSchema = z.object({
  display_name: DISPLAY_NAME,
  picture: z.nullable(z.string()),
});
export type UserModel = z.infer<typeof UserSchema>;

export const UpdateUserInfoSchema = z.object({
  display_name: z.nullable(z.optional(DISPLAY_NAME)),
  picture: z.nullable(z.optional(z.string())),
});
export type UpdateUserInfoModel = z.infer<typeof UpdateUserInfoSchema>;

export const UserDisplaySchema = z.object({
  user_id: z.ulid(),
  display_name: DISPLAY_NAME,
  picture: z.nullable(z.string()),
});
export type UserDisplayModel = z.infer<typeof UserDisplaySchema>;

export const UpdateServerInfoSchema = z.object({
  name: z.nullable(z.optional(SERVER_NAME)),
  picture: z.nullable(z.optional(z.string())),
});
export type UpdateServerInfoModel = z.infer<typeof UpdateServerInfoSchema>;

export const UpdateChannelInfoSchema = z.object({
  name: z.nullable(z.optional(CHANNEL_NAME)),
});
export type UpdateChannelInfoModel = z.infer<typeof UpdateChannelInfoSchema>;
