module.exports = {
    name: "help",
    description: "Lists all commands available!",
    execute(client, message, args, cmd, Discord)
    {
        message.channel.send('List of all commands: \n\n ***  -play {song name / URL}  *** \n ***  -leave  ***');

    }
}