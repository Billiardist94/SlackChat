import * as React from 'react';
import { ISlackChatWebPartProps } from '../ISlackChatWebPartProps';
import { FC, useState } from 'react';
import styles from '../SlackChatWebPart.module.scss';

const ChatFooter: FC<ISlackChatWebPartProps> = ({ socket, userDisplayName, userEmail, onChange }) => {
    const [message, setMessage] = useState("")
    const [channel, setChannel] = useState("")

    const userPhoto = `https://48n0sh.sharepoint.com/_layouts/15/userphoto.aspx?size=L&username=${userEmail}`;
    // const userPhoto = `https://www.pngjoy.com/pngm/947/21591987_leon-seat-fr-logo-png-transparent-png.png`;
    let userPhotoBlob: any;

    const toDataURL = (url:string, callback:any) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          const reader = new FileReader();
          reader.onloadend = function() {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    
    toDataURL(userPhoto, (dataUrl:any) => {
    userPhotoBlob = dataUrl;
    // console.log('RESULT:', dataUrl)
    })

    const handleChangeSelect = (e:any) => {
        setChannel(e.target.value);
        onChange(e.target.value);
    }

    const handleSendMessage = (e: any) => {
        e.preventDefault()
        socket.emit("message",
            {
                text: message,
                user: userDisplayName,
                ts: `${socket.id}${Math.random()}`,
                socketID: socket.id,
                userPhoto: userPhotoBlob,
                channel: channel
            }
        )
        setMessage("")
    }

    return (
        <footer className={styles.chat__footer}>
            <form className={styles.chat__footer_form} onSubmit={handleSendMessage}>
                <select 
                    className={styles.chat__footer_inputChannel}
                    value={channel}
                    onChange={handleChangeSelect}
                >
                    <option value="">Select a channel</option>
                    <option value="C043Q1JS7CN">development</option>
                    <option value="C04498NN17B">general</option>
                    <option value="C043Z395T8C">random</option>
                    <option value="D043TNG5PQD">SharepointChat</option>
                </select>
                <input
                    type="text"
                    className={styles.chat__footer_input}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                />
                <button
                    className={styles.chat__footer_button}
                >
                    <svg data-us8="true" aria-hidden="true" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M2.25 2.25 17.75 10l-15.5 7.75v-4.539a1.5 1.5 0 0 1 1.46-1.5l6.54-.171a1.54 1.54 0 0 0 0-3.08l-6.54-.172a1.5 1.5 0 0 1-1.46-1.5V2.25Z" /></svg>
                </button>
            </form>
        </footer>
    );
};

export default ChatFooter;

