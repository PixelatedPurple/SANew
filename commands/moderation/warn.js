const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../../models/Warn');
const logToChannel = require('../../utils/logToChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    let warningData = await Warn.findOne({ userId: user.id, guildId: interaction.guild.id });
    if (!warningData) {
      warningData = new Warn({
        userId: user.id,
        guildId: interaction.guild.id,
        warnings: []
      });
    }

    warningData.warnings.push({
      modId: interaction.user.id,
      reason: reason,
      date: new Date()
    });

    await warningData.save();

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Member Warned')
      .setDescription(`Warned ${user.tag} for: **${reason}**`)
      .setColor('Orange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await logToChannel(interaction.guild, {
      title: '⚠️ User Warned',
      fields: [
        { name: 'User', value: `<@${user.id}>`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason }
      ],
      color: 'Orange'
    });
  }
};
