const ytdl = require("ytdl-core");
const yts = require("yt-search");

const { VoiceChannel } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { channel } = require("diagnostics_channel");
const { chmod } = require("fs");

const queue = new Map();

module.exports = {
    name: "play",
    aliases: ["skip", "stop"],
    description: "Music bot!",
    async execute(client, message, args, cmd, Discord)
    {

        const voiceChannel = message.member.voice.channel;

        if ( !voiceChannel )
        {
            message.channel.send("You need to be in a voice channel to play a song");
            return;
        }
        
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if ( !permissions.has("CONNECT") ) return message.channel.send("You dont have the correct permissions");
        if ( !permissions.has("SPEAK") ) return message.channel.send("You dont have the correct permissions");

        const server_queue = queue.get(message.guild.id);

        if ( cmd === "play" )
        {
            
            if ( !args.length) return message.channel.send("You did not give a link or song name");
            let song = {};

            if ( ytdl.validateURL(args[0]))
            {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
            }
            else
            {
                const videoFinder = async (query) => 
                {
                    const videoResult = await yts( query );
                    return ( videoResult.videos.length > 1 ) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(" "));
                if ( video )
                {
                    song = { title: video.title, url: video.url, duration: video.duration.timestamp };

                }
                else
                {
                    message.channel.send("Song not found")
                    .catch(err => console.error(err));
                }

            }

            
            if ( !server_queue )
            {
                const queue_constructor = 
                {
                    voice_channel: voiceChannel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []

                }

                queue.set( message.guild.id, queue_constructor );
                queue_constructor.songs.push( song );

                try 
                {
                    const connection = await voiceChannel.join();
                    queue_constructor.connection = connection;
                    await video_player( message.guild, queue_constructor.songs[0])
                }
                catch( err )
                {
                    queue.delete(message.guild.id);
                    console.log( err );
                    message.channel.send("There was an error connecting");
                    throw err;
                }
            }
            else
            {
                server_queue.songs.push(song);
                return message.channel.send(`** ${song.title}** was added to the queue`);
            }
        }

        if ( cmd === "skip" ) skip_song( message, server_queue ); 
        if ( cmd === "stop" ) stop_song( message, server_queue ); 
    }

}

const video_player = async ( guild, song ) =>
{
    const song_queue = queue.get( guild.id );

    if ( !song )
    {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl( song.url, { 
        filter: "audioonly",
        dlChunkSize: 0,
        highWaterMark: 1 << 25,
     })
     .on("error", err =>{
        message.channel.send("There was an error with ytdl");
        console.log(err);
    });

    song_queue.connection.play( stream, { seek: 0, volume: 1 })
    .on("finish", () =>
    {
        song_queue.songs.shift();
        video_player( guild, song_queue.songs[0]);
    })
    .on("error", err =>{
        message.channel.send("There was an error with .connection.play {stream}");
        console.log(err);
    });

    await song_queue.text_channel.send(` Now Playing -- **${song.title}  (${song.duration})**`);
}

const skip_song = ( message, server_queue ) => 
{
    if ( !message.member.voice.channel )
    {
        return message.channel.send("You need to be in a voice channel to skip a song"); 
    }

    if ( !server_queue )
    {
        return message.channel.send("Song queue is empty"); 
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}
