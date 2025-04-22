const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear all warnings for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to clear warnings for')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');

    await client.warnModel.findOneAndDelete({
      userId: user.id,
      guildId: interaction.guild.id
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Warnings Cleared')
      .setDescription(`All warnings for **${user.tag}** have been cleared.`)
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
