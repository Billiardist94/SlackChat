import * as React from 'react';
import { ISlackChatWebPartProps } from '../ISlackChatWebPartProps';
import { FC, useEffect, useState } from 'react';
import ChatBody from '../ChatBody/ChatBody';
import styles from '../SlackChatWebPart.module.scss';

const ChatPage: FC<ISlackChatWebPartProps> = ({ userDisplayName, userEmail, socket }) => {

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState("")

  const handleNameChange = (e:any) => {
    setChannel(e);
    setMessages([]);
    console.log("handleNameChange");
    socket.on("historyResponse", (data:any) => {
      if (data.channel === channel) {
        setMessages(mess => [...mess, data])
      } 
      console.log("history: ", data)
    });
  };

  useEffect(()=> {
    socket.on("messageResponse", (data:any) => {
      if (data.channel === channel) {
        setMessages(mess => [...mess, data])
      } 
    });
  }, [socket, channel])
  console.log('messageResponse', messages);

  const currentdate = new Date();
  const dateTime = currentdate.getHours() + ":" + currentdate.getMinutes();

  return (
    <>
      <ChatBody clientID={''} channelID={''} userDisplayName={userDisplayName} userEmail={userEmail} socket={socket} dataTime={dateTime} messages={messages} onChange={handleNameChange} />
    </>
  )
};

export default ChatPage;
