const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('ID of the user to unban')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');

    try {
      await interaction.guild.bans.remove(userId);
      const embed = new EmbedBuilder()
        .setTitle('✅ Member Unbanned')
        .setColor('Green')
        .addFields(
          { name: 'User ID', value: userId, inline: true },
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Failed to unban the user. Make sure the ID is correct.', ephemeral: true });
    }
  }
};
