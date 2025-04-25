const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all available bot commands by category.'),

  async execute(interaction) {
    const categoryMap = {
      general: { emoji: '⚙️', label: 'General' },
      moderation: { emoji: '🛡️', label: 'Moderation' },
      fun: { emoji: '🎮', label: 'Fun' },
      utility: { emoji: '🧰', label: 'Utility' },
      economy: { emoji: '💰', label: 'Economy' },
      music: { emoji: '🎵', label: 'Music' }
    };

    const commandsPath = path.join(__dirname, '..', '..', 'commands');
    const categories = fs.readdirSync(commandsPath).filter(dir =>
      fs.statSync(path.join(commandsPath, dir)).isDirectory()
    );

    const embed = new EmbedBuilder()
      .setTitle('📖 Bot Help Menu')
      .setColor('#5865F2')
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 128 }))
      .setTimestamp()
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL()
      });

    for (const category of categories) {
      const files = fs.readdirSync(path.join(commandsPath, category)).filter(file => file.endsWith('.js'));

      const commandList = files
        .map(file => {
          const command = require(path.join(commandsPath, category, file));
          return command.data ? `• \`/${command.data.name}\` - ${command.data.description}` : null;
        })
        .filter(Boolean)
        .join('\n');

      if (commandList) {
        const { emoji, label } = categoryMap[category] || { emoji: '📁', label: category };
        embed.addFields({ name: `${emoji} ${label}`, value: commandList });
      }
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};