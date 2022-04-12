const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const ms = require('ms');
const pathToFfmpeg = require('ffmpeg-static');
const { prefix , token } = require("./config.json")
var avconv = require("avconv_id3");
client.login(token);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Map();

require("express")().listen(3000)
///npm i express node-fetch
setInterval(() => {
  import("node-fetch").then(({ default: fetch }) => fetch("رابط البروجكت"))
console.log("By Profe")
}, 1000 * 60 * 4)


fs.readdir(__dirname + "/events/", (err, files) => {
     if (err) return console.error(err);
     files.forEach((file) => {
       const event = require(__dirname + `/events/${file}`);
       let eventName = file.split(".")[0];
       client.on(eventName, event.bind(null, client));
       console.log("Loading Event: "+eventName)
     });
});

client.on('ready',async () => {
  let g = client.guilds.cache.get(""); // id server
  let c = g.channels.cache.get("");// id channel
  if(c.type === 'voice') {
  c.join();
  setInterval(() => {
  if(g.me.voiceChannel && g.me.voiceChannelID !== c.id || !g.me.voiceChannel) c.join();
  }, 1);
  } else {
  console.log('Failed To Join: \n The Channel Type isn "Listening."')
  }
});


client.on("message", async message => {
   

     if (message.author.bot) return;
     if (!message.guild) return;
     if (!message.content.startsWith(prefix)) return;
 
     // If message.member is uncached, cache it.
     if (!message.member) message.member = await message.guild.fetchMember(message);
 
     const args = message.content.slice(prefix.length).trim().split(/ +/g);
     const cmd = args.shift().toLowerCase();
     
     if (cmd.length === 0) return;
     
     // Get the command
     let command = client.commands.get(cmd);
     // If none is found, try to find it by alias
     if (!command) command = client.commands.get(client.aliases.get(cmd));
 
     // If a command is finally found, run the command
     if (command) 
         command.run(client, message, args);
});

// Run the command loader
["command"].forEach(handler => {
     require(`./handlers/${handler}`)(client);
});


client.on('message', profe => {
     if(profe.content.startsWith(`${prefix}help`) || profe.content.startsWith(`${prefix}Help`)
       || profe.content.startsWith(`${prefix}مساعده`)){
         profe.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription("Look D'm Has Been Sent 👍"))
       }
   })
   
   
   client.on('message', msg => {
     if(msg.content.startsWith(`${prefix}help`) || msg.content.startsWith(`${prefix}مساعده`) || msg.content.startsWith(`${prefix}Help`)) {
       msg.author.send(`
       ──⋞ Music Command's ⋮ 🎶
       > ✧︱loop ・ repeat / تكرار + كرر
       > ✧︱nowplaying ・np / المشغل-الان
       > ✧︱pause ・pe / إيقاف-مؤقت
       > ✧︱play ・p + pl / شغل + تشغيل 
       > ✧︱queue ・q 
       > ✧︱remove ・rs / حذف
       > ✧︱resume ・re
       > ✧︱shuffle ・sf + shufflequeue
       > ✧︱skip-all ・skip-all
       > ✧︱skip-to ・skip-to
       > ✧︱skip ・s + sk / تخطي
       > ✧︱stop ・st / توقف
       
       Request Channel : ${msg.channel}
       Prefix Bot : ${prefix}
       Server Support : https://discord.gg/cktrcagC4M
       Made By : !         𝐂𝐚・PROFESSOR#3874`)
     }
})