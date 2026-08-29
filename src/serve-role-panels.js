require("dotenv").config({ quiet: true });

const { Client, Events, GatewayIntentBits } = require("discord.js");
const { panels } = require("./role-panels");
const {
  getRoleNamesForScope,
  panelCustomId,
  validatePanels
} = require("./role-panel-utils");

const token = process.env.BOT_TOKEN ?? process.env.bot_token;
const guildId = process.argv[2];

if (!token) {
  throw new Error("Missing BOT_TOKEN. Add it to .env before running this command.");
}

if (!/^\d{17,20}$/.test(guildId ?? "")) {
  throw new Error(
    "Usage: npm run serve-role-panels -- <server-id> (the server ID must be 17-20 digits)"
  );
}

validatePanels(panels);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function getPanelByCustomId(customId) {
  return panels.find((panel) => panelCustomId(panel.id) === customId);
}

async function handleRoleSelection(interaction) {
  if (interaction.guildId !== guildId) {
    await interaction.reply({
      content: "\u8fd9\u4e2a\u8eab\u4efd\u7ec4\u9762\u677f\u672a\u5728\u5f53\u524d\u670d\u52a1\u5668\u542f\u7528\u3002",
      ephemeral: true
    });
    return;
  }

  const panel = getPanelByCustomId(interaction.customId);
  if (!panel) {
    return;
  }

  const selectedOption = panel.options.find(
    (option) => option.id === interaction.values[0]
  );
  if (!selectedOption) {
    await interaction.reply({
      content: "\u8fd9\u4e2a\u8eab\u4efd\u7ec4\u9009\u9879\u5df2\u4e0d\u53ef\u7528\u3002",
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const guild = await client.guilds.fetch(guildId);
    await guild.roles.fetch();
    const member = await guild.members.fetch(interaction.user.id);
    const scopedRoleNames = getRoleNamesForScope(panels, panel.exclusiveScope);
    const rolesToRemove = member.roles.cache.filter(
      (role) =>
        scopedRoleNames.includes(role.name) && role.name !== selectedOption.roleName
    );

    if (rolesToRemove.size > 0) {
      await member.roles.remove(rolesToRemove, "Character role selection changed");
    }

    if (!selectedOption.roleName) {
      await interaction.editReply("\u5df2\u6e05\u9664\u4f60\u7684\u89d2\u8272\u989c\u8272\u8eab\u4efd\u7ec4\u3002");
      return;
    }

    const role = guild.roles.cache.find(
      (candidate) => candidate.name === selectedOption.roleName
    );
    if (!role) {
      throw new Error(`Configured role not found: ${selectedOption.roleName}`);
    }
    if (!role.editable) {
      throw new Error(
        `The bot cannot assign ${role.name}. Move the bot's highest role above it.`
      );
    }

    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role, "Character role selected from role panel");
    }

    await interaction.editReply(`\u5df2\u4e3a\u4f60\u8bbe\u7f6e\u89d2\u8272\u8eab\u4efd\u7ec4\uff1a${selectedOption.label}`);
  } catch (error) {
    console.error("Could not update a member's character role:", error);
    await interaction.editReply(
      "\u65e0\u6cd5\u66f4\u65b0\u8eab\u4efd\u7ec4\u3002\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458\u68c0\u67e5 Bot \u7684\u6743\u9650\u548c\u8eab\u4efd\u7ec4\u6392\u5e8f\u3002"
    );
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(
    `Role-panel listener started as ${readyClient.user.tag} for server ${guildId}.`
  );
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) {
    return;
  }

  if (!getPanelByCustomId(interaction.customId)) {
    return;
  }

  await handleRoleSelection(interaction);
});

client.login(token).catch((error) => {
  console.error("Discord login failed. Check the token and bot configuration.", error);
  process.exitCode = 1;
});
