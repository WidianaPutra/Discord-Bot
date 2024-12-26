import dotenv from "dotenv";
import axios from "axios";
import { Client, IntentsBitField } from "discord.js";
dotenv.config();

const roomSupport = [process.env.ROOM_1];

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (cb) => {
  console.log("Bot Ready");
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (!roomSupport.includes(msg.channelId))
    return console.table({
      roomId: msg.channelId,
      username: msg.author.username,
      name: msg.author.globalName,
    });
  const content = msg.content;
  const messageContent = content.replace("?chat", "").trim();
  const isHelpRequest =
    content.toLowerCase() === "?surbul" || content.toLowerCase() === "surbul";

  if (isHelpRequest) {
    return msg.reply(
      `Hallo ${msg.author.username}\n1. ?info -> Bot Info\n2. ?chat -> bertanya\nSilahkan pilih sesuai dengan kebutuhan, dan gunakan dengan bijak Yaaa....`
    );
  }

  if (content.startsWith("?info")) {
    return msg.reply(
      `Owner: WidianaPutra\nVersi: 1\nDibuat: 26-Desember-2024\nTim: The Ngambul Gexs`
    );
  }

  // if (content.startsWith("?chat")) {
  // }
  try {
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
    console.error("Error fetching response from AI API:", error);
    return msg.reply("Maaf, terjadi kesalahan saat memproses pesan Anda.");
  }
});

client.login(process.env.DC_TOKEN);
