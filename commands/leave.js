module.exports = {
    name: "leave",
    description: "stop the music bot and leave voice channel",
    async execute( client, message, args, cmd, Discord )
    {
        const voiceChannel = message.member.voice.channel;

        if ( !voiceChannel )
        {
            message.channel.send("You need to be in a voice channel stop the music bot");
            return;
        }
        await voiceChannel.leave();
    }
}