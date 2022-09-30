require("dotenv-extended").load();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const { App } = require("@slack/bolt");
const { WebClient, LogLevel } = require("@slack/web-api");
const { type } = require("os");
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG,
});

const channelId = "D043TNG5PQD";
var userRealName;
var userPhoto;
var userPhotoSP;

const appBolt = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.use(cors());
let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  // console.log("SOCKET: ", socket.client);

  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
    console.log("data: ", data);
    userPhotoSP = data.userPhoto;
    sendMessage({
      user: data.user,
      text: data.text,
      ts: data.ts,
      socketID: data.socketID,
      userPhoto: userPhotoSP,
      channel: data.channel
    });
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });

  socket.on("history", (data) => {
    // socketIO.emit("historyResponse", data);
    console.log("data: ", data);
    getHistory();
  });

  const sendMessage = async (message) => {
    try {
      const result = client.chat.postMessage({
        channel: message.channel,
        text: message.text,
        username: message.user,
        icon_url: userPhotoSP
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const getHistory = async () => {
    try {
      const result = await client.conversations.history({
        channel: channelId,
        limit: 10,
      });
      console.log("getHistory: ", result);
      conversationHistory = result.messages.reverse();
      conversationHistory.forEach((element) => {
        socketIO.emit("historyResponse", element);
        console.log(element);
      });
    } catch (error) {
      console.error(error);
    }
  };
});


const getUserInfo = async (event) => {
  try {
    const result = await client.users.info({
      user: event.user
    });
    console.log("UserInfo: ", result);
    userRealName = result.user.profile.real_name;
    userPhoto = result.user.profile.image_512;
    console.log(userRealName);
  }
  catch (error) {
    console.error(error);
  }
  socketIO.emit("messageResponse", {
    client_msg_id: event.client_msg_id,
    type: event.type,
    text: event.text,
    user: userRealName ? userRealName : event.user,
    ts: event.ts,
    team: event.team,
    blocks: event.blocks,
    channel: event.channel,
    event_ts: event.event_ts,
    channel_type: event.channel_type,
    userPhoto: userPhoto ? userPhoto : event.userPhoto,
  });
};

appBolt.event("message", ({ event, say }) => {
  console.log("message from Slack: ", event);
  getUserInfo(event);
});

(async () => {
  await appBolt.start(process.env.PORT || 4000);
})();

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
