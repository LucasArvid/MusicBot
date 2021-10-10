const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Collection, Discord } = require('discord.js');

module.exports = ( Discord, client, message) =>
{
    const prefix = ("-");
    const role = "116203996926050306";

    if (!message.content.startsWith(prefix) || message.author.bot) 
    {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
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