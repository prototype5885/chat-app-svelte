export interface UserSchema {
  id: string;
  username: string | null;
  display_name: string;
  picture: string | null;
  custom_status: string | null;
}

export interface UserEditRequest {
  display_name: string | null;
}

export interface UserEditResponse {
  id: string;
  display_name: string | null;
  picture: string | null;
  custom_status: string | null;
}

export interface ServerSchema {
  id: string;
  owner_id: string;
  name: string;
  picture: string;
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
  id: string;
  server_id: string;
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
  id: string;
  message: string;
  attachments: string | null;
  edited: string | null;
}

export interface MessageResponse {
  id: string;
  sender_id: string;
  channel_id: string;
  message: string;
  attachments: string | null;
  edited: string | null;
  display_name: string;
  picture: string | null;
}

export interface TypingSchema {
  user_id: string;
  display_name: string | null;
}
