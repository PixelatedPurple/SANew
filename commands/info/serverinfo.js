// /commands/info/serverinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about this server.'),
  async execute(interaction) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setTitle(`🌐 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor('Green')
      .addFields(
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
