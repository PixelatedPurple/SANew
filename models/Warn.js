const { Schema, model } = require('mongoose');

const warnSchema = new Schema({
  userId: String,
  guildId: String,
  warnings: [
    {
      modId: String,
      reason: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = model('Warning', warnSchema);
