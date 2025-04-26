const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all bot commands!'),

    async execute(interaction, client) {
        const categories = [];
        const commands = [];

        const commandsPath = path.join(__dirname, '..'); // Adjust if needed
        const folders = fs.readdirSync(commandsPath);

        for (const folder of folders) {
            const folderPath = path.join(commandsPath, folder);
            if (fs.lstatSync(folderPath).isDirectory()) {
                const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
                const cmds = [];

                for (const file of files) {
                    const cmd = require(path.join(folderPath, file));
                    cmds.push({
                        name: cmd.data?.name || file.replace('.js', ''),
                        description: cmd.data?.description || "No description provided."
                    });
                }

                categories.push(folder);
                commands.push(cmds);
            }
        }

        const pages = categories.map((cat, idx) => {
            return new EmbedBuilder()
                .setTitle("Help Menu")
                .setDescription(`📌 **Use the buttons below to navigate!**\n\n__**${cat.toUpperCase()} COMMANDS -**__\n\n` +
                    commands[idx].map(cmd => `**/${cmd.name}**\n${cmd.description}`).join('\n\n')
                )
                .setColor("#2f3136")
                .setFooter({ text: `Page 1/${categories.length} • Support: https://cwkbot.fun/discord` });
        });

        let page = 0;
        const getPageEmbed = (pageIndex) => {
            return pages[pageIndex].setFooter({ text: `Page ${pageIndex + 1}/${pages.length} • Support: https://cwkbot.fun/discord` });
        };

        // Buttons
        const first = new ButtonBuilder().setCustomId('first').setLabel('⏮ First').setStyle(ButtonStyle.Secondary);
        const previous = new ButtonBuilder().setCustomId('previous').setLabel('⬅ Previous').setStyle(ButtonStyle.Primary);
        const next = new ButtonBuilder().setCustomId('next').setLabel('Next ➡').setStyle(ButtonStyle.Primary);
        const last = new ButtonBuilder().setCustomId('last').setLabel('Last ⏭').setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(first, previous, next, last);

        const msg = await interaction.reply({ embeds: [getPageEmbed(page)], components: [row], ephemeral: true, fetchReply: true });

        const collector = msg.createMessageComponentCollector({ time: 300_000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "❌ You can't control this menu!", ephemeral: true });
            }

            if (i.customId === 'first') page = 0;
            else if (i.customId === 'previous') page = page > 0 ? --page : pages.length - 1;
            else if (i.customId === 'next') page = (page + 1) % pages.length;
            else if (i.customId === 'last') page = pages.length - 1;

            await i.update({ embeds: [getPageEmbed(page)], components: [row] });
        });

        collector.on('end', async () => {
            msg.edit({ components: [] }).catch(() => {});
        });
    }
};
