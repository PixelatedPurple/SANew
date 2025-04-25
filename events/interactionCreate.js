const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'help-menu') return;

    try {
      // Defer interaction if not already handled
      if (!interaction.replied && !interaction.deferred) {
        await interaction.deferUpdate();
      }

      const selectedCategory = interaction.values[0];
      const commandsPath = path.join(__dirname, '../commands', selectedCategory);

      let desc = '';
      const files = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      for (const file of files) {
        const command = require(`${commandsPath}/${file}`);
        if (command.data) {
          desc += `• **/${command.data.name}** - ${command.data.description}\n`;
        }
      }

      const embed = new EmbedBuilder()
        .setTitle(`📂 ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Commands`)
        .setDescription(desc || 'No commands found.')
        .setColor('#2f3136');

      // Safely update the interaction
      await interaction.editReply({
        embeds: [embed],
        components: []
      });

    } catch (error) {
      console.error('Error handling select menu:', error);

      // Final fallback if editReply fails
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Failed to load commands for this category.',
          ephemeral: true
        });
      }
    }
  }
};