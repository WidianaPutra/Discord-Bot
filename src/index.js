import dotenv from "dotenv";
import axios from "axios";
import { roomWhiteList, userWhiteList } from "./data.js";
import {
  sendMessageToChannel,
  client,
  mentionUser,
  deleteAllMessageByChannelId,
} from "./utils.js";
dotenv.config();

client.on("ready", (cb) => {
  console.log("Bot Ready");
});

client.on("messageCreate", async (msg) => {
  // variable
  const content = msg.content;
  const messageContent = content.replace("?chat", "").trim();
  const isHelpRequest =
    content.toLowerCase() == "?surbul" || content.toLowerCase() == "surbul";

  // validasi apakah chat dikirim oleh bot
  if (msg.author.bot) return;

  // delete msg

  // validasi apakah bot digunakan di room yang terdaftar
  if (!roomWhiteList.includes(parseInt(msg.channelId))) {
    if (msg.content.startsWith("?regis")) {
      return sendMessageToChannel(
        `Channel Register\nroomId: ${msg.channelId}\nusername: ${
          msg.author.username
        }\nname: ${msg.author.globalName}\n${mentionUser()}>`
      );
    }
    return;
  }

  // user regist
  if (msg.content.startsWith("?user")) {
    if (userWhiteList.includes(parseInt(msg.author.id))) {
      return msg.reply(`${msg.author.globalName} sudah terdaftar`);
    }
    sendMessageToChannel(`User Register\n
        user_id: ${msg.author.id} \nusername: ${msg.author.username}\nname: ${
      msg.author.globalName
    }\n${mentionUser()}>
      `);
    return msg.reply("Mohon ditunggu sebentar......");
  }

  // memunculkan menu BOT
  if (isHelpRequest) {
    return msg.reply(
      `Hallo ${msg.author.username}\n1. ?info -> Bot Info\n2. ?chat -> bertanya\nSilahkan pilih sesuai dengan kebutuhan, dan gunakan dengan bijak Yaaa....`
    );
  }

  // memunculkan informasi BOT
  if (content.startsWith("?surbul info")) {
    return msg.reply(
      `Owner: WidianaPutra\nVersi: 1\nDibuat: 26-Desember-2024\nTim: The Ngambul Gexs`
    );
  }

  // validasi apakah pesan yang dikirim berawalan ?ai
  if (!content.startsWith("?ai")) return;

  // validasi user
  if (!userWhiteList.includes(parseInt(msg.author.id))) {
    return msg.reply(
      `Maaf, ${msg.author.username} tidak memiliki akses untuk menggunakan fitur ini`
    );
  }

  try {
    // melakukan req ke server
    const response = await axios.post(
      `${process.env.BASE_URL_AI_API}/chat?key=${process.env.API_KEY}`,
      {
        role: "user",
        content: messageContent,
      },
      {
        headers: {
          Authorization: process.env.AUTHORIZATION_TOKEN,
        },
      }
    );
    return msg.reply(response.data.message[1].content);
  } catch (error) {
    // jika error
    console.error("Error fetching response from AI API:", error);
    return msg.reply("Maaf, terjadi kesalahan saat memproses pesan Anda.");
  }
});

client.login(process.env.DC_TOKEN);
