import { z } from "zod";

export const UsernameSchema = z.string().trim().min(6).max(32);
export const PasswordSchema = z.string().trim().min(6).max(128);

export const DisplayNameSchema = z.string().trim().min(1).max(64);
export const CustomStatusSchema = z.string().trim().min(1).max(32)
  .nullable().optional();

export const ServerNameSchema = z.string().trim().min(1).max(64);
export const ChannelNameSchema = z.string().trim().min(1).max(32);

export const MessageTextSchema = z.string().trim().min(1).max(4096);
export const PictureSchema = z.string().nullable().optional();

export const ServerSchema = z.object({
  id: z.bigint(),
  owner_id: z.bigint(),
  name: ServerNameSchema,
  picture: PictureSchema,
  banner: PictureSchema,
  roles: z.string().nullable().optional(),
});

export const ChannelSchema = z.object({
  id: z.bigint(),
  server_id: z.bigint(),
  name: ChannelNameSchema,
});

export const AttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
});

export const MessageSchema = z.object({
  id: z.bigint(),
  sender_id: z.bigint(),
  channel_id: z.bigint(),
  message: MessageTextSchema,
  edited: z.number().nullable().optional(),
  display_name: DisplayNameSchema,
  picture: PictureSchema,
  attachments: z.array(AttachmentSchema).nullable().optional(),
});

export const UserSchema = z.object({
  id: z.bigint(),
  username: UsernameSchema,
  display_name: DisplayNameSchema,
  picture: PictureSchema,
  custom_status: CustomStatusSchema,
  online: z.boolean(),
});

export const UserEditResponseSchema = z.object({
  id: z.bigint(),
  display_name: DisplayNameSchema.nullable().optional(),
  picture: PictureSchema,
  custom_status: CustomStatusSchema,
});

export const UserOnline = z.object({
  id: z.bigint(),
  online: z.boolean(),
});
