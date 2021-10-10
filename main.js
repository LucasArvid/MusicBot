const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Collection, Discord } = require('discord.js');

require("dotenv").config();

const client = new Client({intents : [Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]});

const fs = require('fs');

client.commands = new Collection();
client.events = new Collection();

["command_handler", "event_handler"].forEach( handler => 
{
    require(`./handlers/${handler}`)(client, Discord);
});

client.login(process.env.TOKEN);