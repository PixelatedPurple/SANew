const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for mute')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });

    try {
      await member.timeout(10 * 60 * 1000, reason); // 10 minutes timeout
      const embed = new EmbedBuilder()
        .setTitle('🔇 Member Muted')
        .setColor('Orange')
        .addFields(
          { name: 'User', value: `${member.user.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Duration', value: '10 minutes', inline: true },
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Failed to mute the user.', ephemeral: true });
    }
  }
};
