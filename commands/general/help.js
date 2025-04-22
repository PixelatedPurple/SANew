const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all commands by category with pagination.'),

  async execute(interaction, client) {
    const commandFolders = fs.readdirSync('./commands');
    const pages = [];

    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
      const commands = [];

      for (const file of commandFiles) {
        try {
          const command = require(`../../commands/${folder}/${file}`);
          if (command?.data?.name) {
            commands.push(`• \`/${command.data.name}\` - ${command.data.description || 'No description'}`);
          }
        } catch (err) {
          console.warn(`❌ Skipping invalid command: ${folder}/${file}`, err.message);
        }
      }

      pages.push({
        name: folder.charAt(0).toUpperCase() + folder.slice(1),
        value: commands.length ? commands.join('\n') : '_No commands found in this category._'
      });
    }

    let currentPage = 0;

    const generateEmbed = (page) => {
      const embed = new EmbedBuilder()
        .setTitle(`📖 Help Menu - ${pages[page].name}`)
        .setDescription(pages[page].value)
        .setColor('Blurple')
        .setFooter({ text: `Page ${page + 1} of ${pages.length}` });

      return embed;
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('prev').setLabel('⬅️ Prev').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('next').setLabel('Next ➡️').setStyle(ButtonStyle.Secondary),
    );

    const msg = await interaction.reply({
      embeds: [generateEmbed(currentPage)],
      components: [row],
      ephemeral: true
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'Only you can use these buttons.', ephemeral: true });
      }

      if (i.customId === 'next') {
        if (currentPage < pages.length - 1) currentPage++;
      } else if (i.customId === 'prev') {
        if (currentPage > 0) currentPage--;
      }

      await i.update({
        embeds: [generateEmbed(currentPage)],
        components: [row]
      });
    });

    collector.on('end', async () => {
      await msg.edit({ components: [] });
    });
  }
};
