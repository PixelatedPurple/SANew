const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggle-automod')
    .setDescription('Enable or disable Automod for this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    let settings = await GuildSettings.findOne({ guildId });
    if (!settings) {
      settings = new GuildSettings({ guildId });
    }

    settings.automodEnabled = !settings.automodEnabled;
    await settings.save();

    const status = settings.automodEnabled ? 'enabled ✅' : 'disabled ❌';
    const embed = new EmbedBuilder()
      .setTitle('Automod Toggled')
      .setDescription(`Automod is now **${status}**.`)
      .setColor(settings.automodEnabled ? 'Green' : 'Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
