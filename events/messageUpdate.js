const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.author?.bot || oldMessage.content === newMessage.content) return;

    const settings = await GuildSettings.findOne({ guildId: newMessage.guild.id });
    if (!settings?.logChannelId) return;

    const logChannel = newMessage.guild.channels.cache.get(settings.logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle('✏️ Message Edited')
      .addFields(
        { name: 'User', value: `${newMessage.author.tag}`, inline: true },
        { name: 'Channel', value: `${newMessage.channel}`, inline: true },
        { name: 'Before', value: oldMessage.content || '*[No content]*' },
        { name: 'After', value: newMessage.content || '*[No content]*' }
      )
      .setTimestamp()
      .setColor('Orange');

    logChannel.send({ embeds: [embed] });
  }
};
