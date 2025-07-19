// /commands/general/avatar.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a user')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setColor('Random');

    if (member && member.avatar) {
      embed.addFields({ name: 'Server Avatar', value: `[View](${member.displayAvatarURL({ dynamic: true, size: 1024 })})` });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
