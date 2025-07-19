// /commands/info/emojiinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojiinfo')
    .setDescription('Displays information about a custom emoji.')
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('Emoji to get info on (e.g. <:smile:1234567890>)')
        .setRequired(true)),
  async execute(interaction) {
    const input = interaction.options.getString('emoji');
    const match = input.match(/<a?:\w+:(\d+)>/);

    if (!match) {
      return interaction.reply({ content: 'Invalid emoji format.', ephemeral: true });
    }

    const emoji = interaction.client.emojis.cache.get(match[1]);
    if (!emoji) return interaction.reply({ content: 'Emoji not found in cache.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`🧩 Emoji Info: ${emoji.name}`)
      .setThumbnail(emoji.url)
      .setColor('Yellow')
      .addFields(
        { name: 'ID', value: emoji.id, inline: true },
        { name: 'Animated', value: emoji.animated ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: `<t:${Math.floor(emoji.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'URL', value: `[Link](${emoji.url})`, inline: false }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
