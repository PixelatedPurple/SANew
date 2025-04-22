require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();

// Load commands
const ds = './commands';
fs.readdirSync(ds).forEach(dir => {
  const commandFiles = fs.readdirSync(`${ds}/${dir}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${ds}/${dir}/${file}`);
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
});
//status event 
client.once('ready', () => {
  console.log(`🤖 Automod Bot ready as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'your server 👀', type: 3 }],
    status: 'online'
  });
});

// Slash command handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ Command Error')
      .setDescription('There was an error executing this command.')
      .setColor('Red');
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

// MongoDB model for warnings
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


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  client.login(process.env.DISCORD_TOKEN);
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

