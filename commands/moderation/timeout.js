const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const logToChannel = require('../../utils/logToChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option =>
      option.setName('user').setDescription('User to timeout').setRequired(true))
    .addStringOption(option =>
      option.setName('duration').setDescription('Time (e.g., 1h, 30m)').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const duration = ms(interaction.options.getString('duration'));
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!duration || duration < 10000 || duration > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({ content: 'Duration must be between 10s and 28d.', ephemeral: true });
    }

    try {
      await member.timeout(duration, reason);

      const embed = new EmbedBuilder()
        .setTitle('⏱️ Member Timed Out')
        .addFields(
          { name: 'User', value: `<@${member.id}>`, inline: true },
          { name: 'Duration', value: interaction.options.getString('duration'), inline: true },
          { name: 'Reason', value: reason }
        )
        .setColor('Blue')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      await logToChannel(interaction.guild, {
        title: '⏱️ User Timed Out',
        fields: [
          { name: 'User', value: `<@${member.id}>`, inline: true },
          { name: 'Duration', value: interaction.options.getString('duration'), inline: true },
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Reason', value: reason }
        ],
        color: 'Blue'
      });
    } catch (err) {
      await interaction.reply({ content: `Timeout failed: ${err.message}`, ephemeral: true });
    }
  }
};
