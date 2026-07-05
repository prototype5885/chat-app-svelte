export interface UserSchema {
  id: bigint;
  username: string | null;
  display_name: string;
  picture: string | null;
  custom_status: string | null;
  online: boolean | null;
}

export interface UserEditRequest {
  display_name: string | null;
}

export interface UserEditResponse {
  id: bigint;
  display_name?: string;
  picture?: string | null;
  custom_status?: string | null;
}

export interface UserOnline {
  id: bigint;
  online: boolean;
}

export interface ServerSchema {
  id: bigint;
  owner_id: bigint;
  name: string;
  picture: string | null;
  banner: string | null;
  roles: string | null;
}

export interface ServerCreateRequest {
  name: string;
}

export interface ServerEditRequest {
  name: string | null;
}

export interface ChannelSchema {
  id: bigint;
  server_id: bigint;
  name: string;
}

export interface ChannelCreateRequest {
  name: string;
}

export interface ChannelEditRequest {
  name: string | null;
}

export interface MessageCreateRequest {
  name: string | null;
}

export interface MessageEditRequest {
  name: string;
}

export interface MessageEditResponse {
  id: bigint;
  message: string;
  attachments: string | null;
  edited: string | null;
}

export interface Attachment {
  name: string;
  file: string;
}

export interface MessageResponse {
  id: bigint;
  sender_id: bigint;
  channel_id: bigint;
  message: string;
  attachment_count: number | null;
  edited: string | null;
  display_name: string;
  picture: string | null;
  attachments: Attachment[] | null;
}

export interface TypingSchema {
  user_id: bigint;
  display_name: string | null;
}
