const { SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstatus')
        .setDescription('Update bot\'s presence (Bot Owner only)')
        .addStringOption(option =>
            option.setName('activity')
                .setDescription('Activity text')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type: Playing, Watching, Listening')
                .addChoices(
                    { name: 'Playing', value: 'PLAYING' },
                    { name: 'Watching', value: 'WATCHING' },
                    { name: 'Listening', value: 'LISTENING' }
                )
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.user.id !== '682981714523586606') return interaction.reply({ content: '❌ Not authorized.', ephemeral: true });

        const activity = interaction.options.getString('activity');
        const type = interaction.options.getString('type');

        interaction.client.user.setPresence({
            activities: [{ name: activity, type: ActivityType[type] }],
            status: 'online'
        });

        await interaction.reply({ content: `✅ Updated presence to **${type} ${activity}**`, ephemeral: true });
    }
};
