const ytdl = require("ytdl-core");
const yts = require("yt-search");
const fs = require('fs')
const { SoundCloud} = require("scdl-core")

const { VoiceChannel } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { channel } = require("diagnostics_channel");
const { chmod } = require("fs");



const queue = new Map();
const SOUNDCLOUD_URL = "https://soundcloud.com/david_sanya/certain";

module.exports = {
    name: "soundcloud",
    aliases: ["sc", "sound"],
    description: "SoundCloud!",
    async execute(client, message, args, cmd, Discord)
    {

        const scdl  = await SoundCloud.create();
        const voiceChannel = message.member.voice.channel;

        if ( !voiceChannel )
        {
            message.channel.send("You need to be in a voice channel to play a song");
            return;
        }
        
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if ( !permissions.has("CONNECT") ) return message.channel.send("You dont have the correct permissions");
        if ( !permissions.has("SPEAK") ) return message.channel.send("You dont have the correct permissions");

        
        if ( !args.length) return message.channel.send("You did not give a link or song name");

        if ( args[0].includes("sets"))
        {
            console.log("playlist");
            message.channel.send("Inte orkat implementera playlists än");
            return;
        }

        let url = args[0];


        voiceChannel.join()
        .then(connection => {
           try
           {
            scdl.download(url)
            .then(stream => connection.play(stream));
           } 
           catch(err)
           {
               console.log(err)
               message.channel.send("Not a correct soundcloud link");
           }
        });

        

    }

}
