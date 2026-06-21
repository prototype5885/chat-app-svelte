export interface UserSchema {
  id: string | bigint;
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
  id: string | bigint;
  display_name?: string;
  picture?: string | null;
  custom_status?: string | null;
}

export interface UserOnline {
  id: string | bigint;
  online: boolean;
}

export interface ServerSchema {
  id: string | bigint;
  owner_id: string | bigint;
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
  id: string | bigint;
  server_id: string | bigint;
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
  id: string | bigint;
  message: string;
  attachments: string | null;
  edited: string | null;
}

export interface Attachment {
  name: string;
  file: string;
}

export interface MessageResponse {
  id: string | bigint;
  sender_id: string | bigint;
  channel_id: string | bigint;
  message: string;
  attachment_count: number | null;
  edited: string | null;
  display_name: string;
  picture: string | null;
  attachments: Attachment[] | null;
}

export interface TypingSchema {
  user_id: string | bigint;
  display_name: string | null;
}
