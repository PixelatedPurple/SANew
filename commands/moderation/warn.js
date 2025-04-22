const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member for bad behavior')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(true)),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const modId = interaction.user.id;

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot warn yourself!', ephemeral: true });
    }

    await client.warnModel.findOneAndUpdate(
      { userId: target.id, guildId: interaction.guild.id },
      {
        $push: {
          warnings: { modId, reason }
        }
      },
      { upsert: true }
    );

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Member Warned')
      .setDescription(`**${target.tag}** has been warned.`)
      .addFields(
        { name: 'Moderator', value: `<@${modId}>`, inline: true },
        { name: 'Reason', value: reason, inline: true }
      )
      .setColor('Yellow')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
