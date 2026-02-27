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

### Welcome

Please read the rules and check the links below.
`)
    .setImage("https://i.imgur.com/yourbanner.png") // حط رابط البانر حقك
    .setFooter({
      text: "VantaCrew • Join • Play • Rule"
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Rules")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.com/channels/YOUR_SERVER_ID/RULES_CHANNEL_ID"),

    new ButtonBuilder()
      .setLabel("Community")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/YOUR_INVITE")
  );

  channel.send({
    content: `Heelo! ${member}`,
    embeds: [embed],
    components: [row]
  });
});

client.login(TOKEN);
