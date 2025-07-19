const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logToChannel = require('../../utils/logToChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(option =>
      option.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member.kickable) {
      return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setTitle('👢 Member Kicked')
      .setDescription(`${member.user.tag} was kicked.`)
      .addFields({ name: 'Reason', value: reason })
      .setColor('Orange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await logToChannel(interaction.guild, {
      title: '👢 User Kicked',
      fields: [
        { name: 'User', value: `<@${member.id}>`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason }
      ],
      color: 'Orange'
    });
  }
};
