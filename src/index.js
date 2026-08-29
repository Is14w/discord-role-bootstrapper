require("dotenv").config({ quiet: true });

const { Client, Events, GatewayIntentBits, PermissionFlagsBits } = require("discord.js");
const rolesToCreate = require("./roles");

const token = process.env.BOT_TOKEN ?? process.env.bot_token;
const guildId = process.argv[2];

if (!token) {
  throw new Error("Missing BOT_TOKEN. Add it to .env before running this command.");
}

if (!/^\d{17,20}$/.test(guildId ?? "")) {
  throw new Error(
    "Usage: npm run create-roles -- <server-id> (the server ID must be 17-20 digits)"
  );
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function ensureRoles(guild) {
  const botMember = await guild.members.fetchMe();
  if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
    throw new Error(
      `[${guild.name}] The bot needs the Manage Roles permission in this server.`
    );
  }

  await guild.roles.fetch();
  let created = 0;
  let alreadyExisted = 0;

  for (const roleDefinition of rolesToCreate) {
    const existingRole = guild.roles.cache.find(
      (role) => role.name === roleDefinition.name
    );

    if (existingRole) {
      console.log(`[${guild.name}] role already exists: ${roleDefinition.name}`);
      alreadyExisted += 1;
      continue;
    }

    try {
      const role = await guild.roles.create(roleDefinition);
      console.log(`[${guild.name}] created role: ${role.name} (${role.id})`);
      created += 1;
    } catch (error) {
      console.error(`[${guild.name}] failed to create ${roleDefinition.name}:`, error);
    }
  }

  console.log(
    `[${guild.name}] finished: ${created} created, ${alreadyExisted} already existed.`
  );
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}.`);

  try {
    const guild = await readyClient.guilds.fetch(guildId);
    await ensureRoles(guild);
  } catch (error) {
    console.error(`Could not configure server ${guildId}:`, error);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
});

client.login(token).catch((error) => {
  console.error("Discord login failed. Check the token and bot configuration.", error);
  process.exitCode = 1;
});
