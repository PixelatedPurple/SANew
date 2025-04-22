const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../../models/Warn');
const logToChannel = require('../../utils/logToChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (user.bot) {
      return interaction.reply({ content: 'You cannot warn bots.', ephemeral: true });
    }

    let warningData = await Warn.findOne({ userId: user.id, guildId: interaction.guild.id });
    if (!warningData) {
      warningData = new Warn({ userId: user.id, guildId: interaction.guild.id, warnings: [] });
    }

    warningData.warnings.push({ modId: interaction.user.id, reason });
    await warningData.save();

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Warn Issued')
      .setDescription(`Successfully warned ${user.tag}`)
      .addFields({ name: 'Reason', value: reason })
      .setColor('Yellow')
      .setFooter({ text: `Moderator: ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Log to modlog channel
    await logToChannel(interaction.guild, {
      title: '⚠️ User Warned',
      fields: [
        { name: 'User', value: `<@${user.id}>`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason }
      ],
      color: 'Yellow'
    });
  }
};
