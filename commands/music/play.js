const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
var avconv = require("avconv_id3");

module.exports = {
  name: "play",
  description: "To play songs :D",
  usage: "<song_name>",
  aliases: ["p","pl"],

  run: async function(client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel) {
      message.channel.send("I am sorry but you need to be in a voice channel before using this commamd");
    }

    if (!message.guild.me.hasPermission("CONNECT")) {
      message.channel.send({
        embed: {
          color: "FF0000",
          description:
            "I don't have permission to connect your vc!"
        }
      });
    }
    if (!message.guild.me.hasPermission("SPEAK")) {
      message.channel.send({
        embed: {
          color: "FF0000",
          description:
            "I need speak permission for playing music!"
        }
      });
    }
    var searchString = args.join(" ");
    if (!searchString) {
      message.channel.send("provide us song' name or song's link");
    }

    var serverQueue = message.client.queue.get(message.guild.id);

    var searched = await yts.search(searchString);
    if (searched.videos.length === 0) {
      message.channel.send("I can't find that song");
    }
    var songInfo = searched.videos[0];

    const song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, " "),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
        .setTitle("Song Has Been Added To Queue")
        .setImage(song.img)
        .setColor("RANDOM")
        .addField(`Song Title :`,`${song.title}`,true)
        .addField(`Views :`,`${song.views}`, true)
        .addField(`Song Ago :`,`${songInfo.ago}`, true)
        .addField(`Song Url :`,`[Click to Show Video](${song.url})`, true)
        .setFooter(`Request By: ${message.author.tag}`)
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async song => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
         message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      queue.textChannel.send(`Start Playing : ${song.title} , **(${song.duration})**`);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      message.client.queue.delete(message.guild.id);
      //await channel.leave();
      return console.log(
        `I could not join the voice channel: ${error}`,
        message.channel
      );
    }
  }
};
