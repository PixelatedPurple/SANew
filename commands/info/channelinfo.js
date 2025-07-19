// /commands/info/channelinfo.js
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Displays information about a channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to get info on')
        .setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    const embed = new EmbedBuilder()
      .setTitle(`📺 Channel Info: ${channel.name}`)
      .setColor('Blue')
      .addFields(
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Type', value: ChannelType[channel.type], inline: true },
        { name: 'NSFW', value: channel.nsfw ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
