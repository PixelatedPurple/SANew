const GuildSettings = require('../models/GuildSettings');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || message.partial || message.author?.bot) return;

    const settings = await GuildSettings.findOne({ guildId: message.guild.id });
    if (!settings?.logChannelId) return;

    const logChannel = message.guild.channels.cache.get(settings.logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Message Deleted')
      .addFields(
        { name: 'User', value: `${message.author.tag}`, inline: true },
        { name: 'Channel', value: `${message.channel}`, inline: true },
        { name: 'Message', value: message.content || '*[No content]*' }
      )
      .setTimestamp()
      .setColor('Red');

    logChannel.send({ embeds: [embed] });
  }
};
