export interface ServerModel {
  id: string;
  owner_id: string;
  name: string;
  picture?: string;
  banner?: string;
}

export interface ChannelModel {
  id: string;
  server_id: string;
  name: string;
}

export interface MessageModel {
  id: string;
  channel_id: string;
  sender_id: string;
  display_name: string;
  picture: string;
  message: string;
  attachments: string[];
  edited: boolean;
}

export interface AddMessageModel {
  message: string;
  channel_id: string;
  reply_id?: string;
}

export interface UserModel {
  id: string;
  display_name: string;
  picture: string;
}
