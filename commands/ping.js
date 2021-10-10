module.exports = {
    name: "ping",
    aliases: "pong",
    description: "this is a ping command!",
    execute(client, message, args, cmd, Discord)
    {

        if ( cmd === "ping" ) message.channel.send('pong');
        if ( cmd === "pong" ) message.channel.send('ping');
        

    }
}