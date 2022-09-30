import { AnyMiddlewareArgs } from "@slack/bolt";

export interface ISlackChatWebPartProps {
  clientID: string;
  channelID: string;
  userDisplayName: string; 
  userEmail: string;
  socket: any;
  dataTime: string;
  messages: Array<Type>;
  // channel: string;
  onChange: any;
}

interface Type {
  user: string,
  text: string,
  ts: string,
  socketID: string,
  userPhoto: string
}