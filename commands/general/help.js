const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all commands organized by category'),

  async execute(interaction) {
    const commandPath = path.join(__dirname, '../');
    const categories = fs.readdirSync(commandPath).filter(folder => fs.statSync(path.join(commandPath, folder)).isDirectory());

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Select a category')
      .addOptions(
        categories.map(cat => ({
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          value: cat,
          description: `Commands under ${cat}`,
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Support Server')
        .setStyle(ButtonStyle.Link)
        .setURL('https://cwkbot.fun/discord'),
      new ButtonBuilder()
        .setLabel('Dashboard')
        .setStyle(ButtonStyle.Link)
        .setURL('https://bot.cwkbot.fun')
    );

    const embed = new EmbedBuilder()
      .setTitle('📘 Help Menu')
      .setDescription('Use the dropdown below to explore commands by category.')
      .setColor('#2f3136')
      .setFooter({
        text: 'Automod Bot - Your moderation partner',
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed], components: [row, buttons], ephemeral: true });
  },
};
