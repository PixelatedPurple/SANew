// /commands/info/userinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows information about a user.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to get info on')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 User Info: ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor('Orange')
      .addFields(
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
        { name: 'Roles', value: `${member.roles.cache.map(r => r).join(', ')}`, inline: false }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
