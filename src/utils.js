import { Client, IntentsBitField } from "discord.js";
import { userWhiteList } from "./data.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

async function sendMessageToChannel(message) {
  const channel = await client.channels.fetch(process.env.ROOM_REGIS);
  if (channel && channel.isTextBased()) {
    await channel.send(message);
  }
}

function mentionUser() {
  return `<@${process.env.OWNER_USERID}`;
}

async function deleteAllMessageByChannelId(channel_id) {
  const channel = await client.channels.fetch(channel_id);
  if (channel && channel.isTextBased()) {
    let fetchedMessages;
    do {
      // Ambil hingga 100 pesan terbaru
      fetchedMessages = await channel.messages.fetch({ limit: 100 });

      // Hapus pesan yang diambil
      await channel.bulkDelete(fetchedMessages, true);
      console.log(`Berhasil menghapus ${fetchedMessages.size} pesan.`);
    } while (fetchedMessages.size > 0);
  }
}

export {
  sendMessageToChannel,
  client,
  mentionUser,
  deleteAllMessageByChannelId,
};
