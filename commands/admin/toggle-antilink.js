const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antilink')
    .setDescription('Enable or disable anti-link protection.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    let settings = await GuildSettings.findOne({ guildId }) || new GuildSettings({ guildId });

    settings.antiLink = !settings.antiLink;
    await settings.save();

    const embed = new EmbedBuilder()
      .setTitle('Anti-Link Toggled')
      .setDescription(`Anti-link protection is now **${settings.antiLink ? 'enabled ✅' : 'disabled ❌'}**.`)
      .setColor(settings.antiLink ? 'Green' : 'Red');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
