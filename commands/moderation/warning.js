const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View a user\'s warning history')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check warnings for')
        .setRequired(true)),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');

    const data = await client.warnModel.findOne({
      userId: user.id,
      guildId: interaction.guild.id
    });

    if (!data || data.warnings.length === 0) {
      return interaction.reply({ content: `${user.tag} has no warnings.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warnings for ${user.tag}`)
      .setColor('Orange')
      .setTimestamp();

    data.warnings.slice(0, 10).forEach((warn, index) => {
      embed.addFields({
        name: `Warning ${index + 1}`,
        value: `**Reason:** ${warn.reason}\n**Moderator:** <@${warn.modId}>\n**Date:** ${moment(warn.date).format('MMMM Do YYYY')}`
      });
    });

    await interaction.reply({ embeds: [embed] });
  }
};
