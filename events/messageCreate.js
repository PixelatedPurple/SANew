const GuildSettings = require('../models/GuildSettings');

const userMessages = new Map();
const linkRegex = /(https?:\/\/[^\s]+)/g;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const settings = await GuildSettings.findOne({ guildId: message.guild.id });
    if (!settings?.automodEnabled) return;

    // Anti-Link
    if (settings.antiLink && linkRegex.test(message.content)) {
      try {
        await message.delete();
        await message.channel.send({
          content: `🚫 No links allowed here, <@${message.author.id}>!`,
        });
      } catch (err) {
        console.error('Error deleting link message:', err);
      }
    }

    // Anti-Spam
    if (settings.antiSpam) {
      const now = Date.now();
      const key = `${message.guild.id}-${message.author.id}`;
      if (!userMessages.has(key)) userMessages.set(key, []);
      const timestamps = userMessages.get(key);

      timestamps.push(now);
      const recent = timestamps.filter(ts => now - ts < 5000);
      userMessages.set(key, recent);

      if (recent.length >= 5) {
        try {
          await message.delete();
          await message.channel.send({
            content: `⚠️ Stop spamming, <@${message.author.id}>!`,
          });
        } catch (err) {
          console.error('Error deleting spam message:', err);
        }
      }
    }
  }
};
