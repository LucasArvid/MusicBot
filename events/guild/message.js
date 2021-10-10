const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Collection, Discord } = require('discord.js');
require("dotenv").config();
module.exports = ( Discord, client, message) =>
{

    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) 
    {
        return;
    }

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find( or => or.aliases && or.aliases.includes(cmd) );

    if ( command ) 
    {
        try
        {
            command.execute(client, message, args, cmd, Discord);
        }
        catch (err)
        {
            console.log(err);
            message.channel.send('Not a supported command');
        }

    }
}