const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logToChannel = require('../../utils/logToChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(option =>
      option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.ban(user.id, { reason });

      const embed = new EmbedBuilder()
        .setTitle('🔨 Member Banned')
        .setDescription(`${user.tag} has been banned.`)
        .addFields({ name: 'Reason', value: reason })
        .setColor('Red')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      await logToChannel(interaction.guild, {
        title: '🔨 User Banned',
        fields: [
          { name: 'User', value: `<@${user.id}>`, inline: true },
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Reason', value: reason }
        ],
        color: 'Red'
      });
    } catch (err) {
      await interaction.reply({ content: `Failed to ban user: ${err.message}`, ephemeral: true });
    }
  }
};
