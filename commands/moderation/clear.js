const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages from a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100)
      return interaction.reply({ content: 'Please provide a number between 1 and 100.', ephemeral: true });

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      const embed = new EmbedBuilder()
        .setTitle('🧹 Messages Cleared')
        .setDescription(`Successfully deleted ${messages.size} messages.`)
        .setColor('Blue')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Failed to delete messages.', ephemeral: true });
    }
  }
};
