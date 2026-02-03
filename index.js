const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  Events,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const GANG_APPLICATION_CHANNEL_ID = "1372556234254974997";
const ROLE_ID_ON_ACCEPT = "1372556198708252672";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// تسجيل أمر سلاش
client.on(Events.ClientReady, async client => {
  const data = new SlashCommandBuilder()
    .setName("تقديم")
    .setDescription("فتح نموذج تقديم العصابة");
  
  await client.application.commands.set([data]);
});

// التفاعل مع الأوامر
client.on(Events.InteractionCreate, async interaction => {
  // سلاش الأمر
  if (interaction.isChatInputCommand() && interaction.commandName === "تقديم") {
    const modal = new ModalBuilder()
      .setCustomId("gangApply")
      .setTitle("تقديم عصابة");

    // أسئلة
    const nameInput = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("اسمك")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const ageInput = new TextInputBuilder()
      .setCustomId("age")
      .setLabel("عمرك")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const experienceInput = new TextInputBuilder()
      .setCustomId("experience")
      .setLabel("خبرتك في RP")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const hoursInput = new TextInputBuilder()
      .setCustomId("hours")
      .setLabel("كم ساعة تلعب أسبوعياً؟")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nameInput),
      new ActionRowBuilder().addComponents(ageInput),
      new ActionRowBuilder().addComponents(experienceInput),
      new ActionRowBuilder().addComponents(hoursInput)
    );

    await interaction.showModal(modal);
  }

  // مودال الرد
  if (interaction.isModalSubmit() && interaction.customId === "gangApply") {
    const name = interaction.fields.getTextInputValue("name");
    const age = interaction.fields.getTextInputValue("age");
    const experience = interaction.fields.getTextInputValue("experience");
    const hours = interaction.fields.getTextInputValue("hours");

    const channel = await client.channels.fetch(GANG_APPLICATION_CHANNEL_ID);

    if (!channel) return interaction.reply({ content: "روم التقديم غير موجود!", ephemeral: true });

    // زر قبول/رفض
    const acceptButton = new ButtonBuilder()
      .setCustomId("accept")
      .setLabel("قبول")
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId("reject")
      .setLabel("رفض")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

    await channel.send({
      content: `📝 **تقديم جديد**\n**الاسم:** ${name}\n**العمر:** ${age}\n**خبرة RP:** ${experience}\n**ساعات اللعب:** ${hours}`,
      components: [row]
    });

    await interaction.reply({ content: "تم إرسال تقديمك بنجاح!", ephemeral: true });
  }

  // التعامل مع أزرار القبول / الرفض
  if (interaction.isButton()) {
    const message = interaction.message;

    if (interaction.customId === "accept") {
      if (ROLE_ID_ON_ACCEPT) {
        const member = interaction.guild.members.cache.get(message.author?.id || interaction.user.id);
        if (member) await member.roles.add(ROLE_ID_ON_ACCEPT);
      }
      await interaction.reply({ content: "✅ تم قبول التقديم!", ephemeral: true });
      message.edit({ components: [] });
    }

    if (interaction.customId === "reject") {
      await interaction.reply({ content: "❌ تم رفض التقديم!", ephemeral: true });
      message.edit({ components: [] });
    }
  }
});

client.login(process.env.TOKEN);
