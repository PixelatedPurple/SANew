const { Schema, model } = require('mongoose');

const settingsSchema = new Schema({
  guildId: String,
  automodEnabled: { type: Boolean, default: false },
  antiLink: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false },
  antiGhostPing: { type: Boolean, default: false },
});

module.exports = model('GuildSettings', settingsSchema);
