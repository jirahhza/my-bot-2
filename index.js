const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN; // مهم لRailway
const WELCOME_CHANNEL_ID = process.env.CHANNEL_ID;

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#8A2BE2")
    .setAuthor({
      name: `${member.user.username}`,
      iconURL: member.user.displayAvatarURL({ dynamic: true })
    })
    .setDescription(`
<@${member.id}>

### 𝓦𝓮𝓵𝓬𝓸𝓶𝓮

https://discord.com/channels/1311865049111072889/1476309801960210442

https://discord.com/channels/1311865049111072889/1476303082475225199

`)
    .setImage("https://i.postimg.cc/PJfLnZtZ/2F083659-4BAD-48DB-AE82-75218D593BB2.jpg") // حط رابط البانر حقك
    .setFooter({
      text: "VantaCrew • Join • Play • Rule"
    })
    .setTimestamp();


  );

  channel.send({
    content: `Heelo! ${member}`,
    embeds: [embed],
  });
});

client.login(TOKEN);



