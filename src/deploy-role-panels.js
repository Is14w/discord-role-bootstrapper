require("dotenv").config({ quiet: true });

const {
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits
} = require("discord.js");
const { channelName, channelTopic, panels } = require("./role-panels");
const {
  buildPanelPayload,
  createRoleOptions,
  getRoleOptions,
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
    "Usage: npm run deploy-role-panels -- <server-id> (the server ID must be 17-20 digits)"
  );
}

validatePanels(panels);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function ensureRoles(guild) {
  await guild.roles.fetch();
  let created = 0;
  let alreadyExisted = 0;

  for (const option of getRoleOptions(panels)) {
    const existingRole = guild.roles.cache.find(
      (role) => role.name === option.roleName
    );

    if (existingRole) {
      alreadyExisted += 1;
      continue;
    }

    await guild.roles.create(createRoleOptions(option));
    created += 1;
  }

  console.log(`[${guild.name}] roles: ${created} created, ${alreadyExisted} already existed.`);
}

async function findOrCreateChannel(guild, botMember) {
  await guild.channels.fetch();
  let channel = guild.channels.cache.find(
    (candidate) =>
      candidate.type === ChannelType.GuildText && candidate.name === channelName
  );

  if (!channel) {
    if (!botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
      throw new Error("The bot needs Manage Channels to create the role-panel channel.");
    }

    channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      topic: channelTopic,
      reason: "Character role panel setup"
    });
    console.log(`[${guild.name}] created channel: #${channel.name} (${channel.id})`);
  } else {
    console.log(`[${guild.name}] using existing channel: #${channel.name} (${channel.id})`);
  }

  const permissions = channel.permissionsFor(botMember);
  const requiredPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory
  ];

  if (!permissions || !permissions.has(requiredPermissions)) {
    throw new Error(
      `The bot needs View Channel, Send Messages, and Read Message History in #${channel.name}.`
    );
  }

  return channel;
}

function findExistingPanelMessage(messages, botUserId, panel) {
  const customId = panelCustomId(panel.id);
  return messages.find(
    (message) =>
      message.author.id === botUserId &&
      message.components.some((row) =>
        row.components.some((component) => component.customId === customId)
      )
  );
}

async function deployPanels(channel, botUserId) {
  const messages = await channel.messages.fetch({ limit: 100 });
  let sent = 0;
  let updated = 0;

  for (const panel of panels) {
    const payload = buildPanelPayload(panel);
    const existingMessage = findExistingPanelMessage(messages, botUserId, panel);

    if (existingMessage) {
      await existingMessage.edit(payload);
      updated += 1;
    } else {
      await channel.send(payload);
      sent += 1;
    }
  }

  console.log(`[${channel.name}] panels: ${sent} sent, ${updated} updated.`);
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}.`);

  try {
    const guild = await readyClient.guilds.fetch(guildId);
    const botMember = await guild.members.fetchMe();

    if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
      throw new Error("The bot needs Manage Roles to create and assign character roles.");
    }

    await ensureRoles(guild);
    const channel = await findOrCreateChannel(guild, botMember);
    await deployPanels(channel, readyClient.user.id);
    console.log("Role-panel deployment finished.");
  } catch (error) {
    console.error(`Could not deploy role panels in server ${guildId}:`, error);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
});

client.login(token).catch((error) => {
  console.error("Discord login failed. Check the token and bot configuration.", error);
  process.exitCode = 1;
});
