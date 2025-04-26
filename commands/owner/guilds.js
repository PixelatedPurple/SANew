const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Shows the servers the bot is in (Bot Owner only)'),

    async execute(interaction) {
        if (interaction.user.id !== '682981714523586606') return interaction.reply({ content: '❌ You are not authorized.', ephemeral: true });

        const guildList = interaction.client.guilds.cache.map(g => `${g.name} (${g.id})`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Bot Guilds')
            .setDescription(`\`\`\`\n${guildList}\n\`\`\``)
            .setColor('#7289DA');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
