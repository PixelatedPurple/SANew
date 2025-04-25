const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View help menu with command categories.'),

  async execute(interaction) {
    // Dynamically fetch folder names from /commands
    const commandFolders = fs.readdirSync(path.join(__dirname, '..')).filter(folder =>
      fs.statSync(path.join(__dirname, '..', folder)).isDirectory()
    );

    const options = commandFolders.map(folder => ({
      label: folder.charAt(0).toUpperCase() + folder.slice(1),
      value: folder
    }));

    const embed = new EmbedBuilder()
      .setTitle('📘 Help Menu')
      .setDescription('Use the dropdown below to explore commands by category.\n\n[Support Server](https://cwkbot.fun/discord) | [Dashboard](https://bot.cwkbot.fun)')
      .setColor('#5865F2')
      .setFooter({ text: 'Automod Bot - Your moderation partner' });

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('help-menu')
        .setPlaceholder('Select a category')
        .addOptions(options)
    );

    const links = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Support Server')
        .setURL('https://cwkbot.fun/discord')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('Dashboard')
        .setURL('https://bot.cwkbot.fun')
        .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({
      embeds: [embed],
      components: [menu, links],
      ephemeral: true,
    });
  },
};
