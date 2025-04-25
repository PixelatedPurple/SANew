const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'help-menu') return;

  const selectedCategory = interaction.values[0];
  const commandsPath = path.join(__dirname, `../commands/${selectedCategory}`);
  let desc = '';

  try {
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

    await interaction.update({ embeds: [embed] });

  } catch (err) {
    console.error(err);
    await interaction.update({ content: '❌ Failed to load commands for this category.', components: [], embeds: [] });
  }
});
