# 🤖 Automod Bot

A powerful moderation Discord bot built with Discord.js v14, Mongoose, designed to keep your server clean, safe, and automated.

![Automod Banner](https://cwkbot.fun/botbanner.png)

---
[invite the bot](https://discord.com/oauth2/authorize?client_id=1363943273374154842&permissions=8&scope=bot%20applications.Commands)
## 🚀 Features

- Slash commands with auto-detection and pagination help menu
- Automod with toggle system per server (anti-link, anti-spam, anti-mention, etc.)
- Database logging (MongoDB + Mongoose)
- Moderation tools: Warn, Kick, Ban, TempBan, Mute, Unmute
- Logging system for actions like message delete/edit
- Web dashboard integration (soon)
- Discord OAuth for authentication (in progress)

---

## 🛠 Setup

### Prerequisites

- Node.js v18 or higher
- MongoDB URI (local or cloud)
- Discord Bot Token
- Firebase setup (optional)

### Installation

```bash
git clone https://github.com/Khanmanan/automod-bot.git
cd automod-bot
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
TOKEN=your_discord_token
MONGO_URI=your_mongo_connection
CLIENT_ID=your_bot_client_id
GUILD_ID=your_guild_id (for testing commands)
```

### Running the Bot

```bash
node index.js
```

To deploy slash commands globally or per guild:

```bash
node deploy.js
```

---

## 🧩 Commands

All commands are organized in the `/commands` folder and auto-loaded by category. Use `/help` to view all.

- Admin
- Info
- Moderation
- General 
- Owner 

---

## 📌 TODO List

### 🔧 Core Features

- [x] Auto-load slash commands by category
- [x] Help command with pagination and buttons
- [x] Logging system for moderation actions
- [x] Toggle-based automod (on/off per rule)
- [x] Rate-limited buttons on help command

### 🌐 Web Dashboard

- [ ] Discord OAuth2 login
- [ ] Guild selector
- [ ] Toggle Automod settings from UI
- [ ] View mod logs and history

### 🧪 Future Ideas

- [ ] Captcha on join (anti-raid)
- [ ] Dashboard theming (Dark )
- [ ] Analytics dashboard (number of mutes/bans per day)
- [ ] Multi-language support

---
<h3 align='center'> Bot support server </h3>

<div align="center"> <a href="https://discord.gg/uC5bAzvmX5"><img src="http://invidget.switchblade.xyz/uC5bAzvmX5"/></a>

<br><br>

</div>



## 👤 Author

**Khanmanan**  
GitHub: [@Khanmanan](https://github.com/Khanmanan)  
Bot Repo: [automod-bot](https://github.com/Khanmanan/automod-bot)

---

## 📜 License

MIT © 2025 Khanmanan
