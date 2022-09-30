import * as React from 'react';
import { ISlackChatWebPartProps } from './ISlackChatWebPartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { FC } from 'react';
import ChatPage from "./ChatPage/ChatPage";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000/");

const SlackChatWebPart: FC<ISlackChatWebPartProps> = ({ userDisplayName, userEmail }) => {

  return (
    <div>
      <ChatPage
        clientID={''}
        channelID={''}
        userDisplayName={escape(userDisplayName)}
        userEmail={escape(userEmail)}
        socket={socket}
        dataTime={''}
        messages={[]}
        onChange={undefined} />
    </div>
  );
};

export default SlackChatWebPart;
