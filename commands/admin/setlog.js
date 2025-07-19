const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Set the modlog channel')
    .addChannelOption(option =>
      option.setName('channel').setDescription('Channel for logging').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const guildId = interaction.guild.id;

    let settings = await GuildSettings.findOne({ guildId }) || new GuildSettings({ guildId });
    settings.logChannelId = channel.id;
    await settings.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Log Channel Set')
      .setDescription(`Logging will now go to ${channel}`)
      .setColor('Green');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
