const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'help-menu') {
    const category = interaction.values[0];
    const dirPath = path.join(__dirname, `../commands/${category}`);

    let commandList = '';
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
      const command = require(`${dirPath}/${file}`);
      commandList += `**/${command.data.name}** - ${command.data.description}\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`📂 ${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
      .setDescription(commandList || 'No commands found in this category.')
      .setColor('#2f3136');

    await interaction.update({ embeds: [embed], components: [] });
  }
});
