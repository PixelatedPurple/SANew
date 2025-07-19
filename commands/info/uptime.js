// /commands/info/uptime.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows how long the bot has been online.'),
  async execute(interaction, client) {
    const totalSeconds = Math.floor(client.uptime / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    await interaction.reply(`🕒 Uptime: \`${days}d ${hours}h ${minutes}m ${seconds}s\``);
  }
};
