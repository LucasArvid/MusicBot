const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Collection, Discord } = require('discord.js');

const client = new Client({intents : [Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]});

const fs = require('fs');

const prefix = "-";
const role = "116203996926050306";

client.commands = new Collection();
client.events = new Collection();

["command_handler", "event_handler"].forEach( handler => 
{
    require(`./handlers/${handler}`)(client, Discord);
});

client.login('ODk2NDM4NTI4OTMyNzIwNjUw.YWHHcA.S1vWusQ9fvY21rV6rVUWlo5NGnY');