require("dotenv").config({ quiet: true });

const {
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits
} = require("discord.js");
const { panels } = require("./role-panels");
const { getRoleOptions, validatePanels } = require("./role-panel-utils");

const token = process.env.BOT_TOKEN ?? process.env.bot_token;
const guildId = process.argv[2];

if (!token) {
  throw new Error("Missing BOT_TOKEN. Add it to .env before running this command.");
}

if (!/^\d{17,20}$/.test(guildId ?? "")) {
  throw new Error(
    "Usage: npm run sync-role-colors -- <server-id> (the server ID must be 17-20 digits)"
  );
}

validatePanels(panels);

function colorNumber(color) {
  return Number.parseInt(color.slice(1), 16);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}.`);

  try {
    const guild = await readyClient.guilds.fetch(guildId);
    const botMember = await guild.members.fetchMe();
    if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
      throw new Error("The bot needs Manage Roles to synchronize role colors.");
    }

    await guild.roles.fetch();
    let updated = 0;
    let unchanged = 0;
    const unavailable = [];

    for (const option of getRoleOptions(panels)) {
      const role = guild.roles.cache.find(
        (candidate) => candidate.name === option.roleName
      );

      if (!role) {
        unavailable.push(`${option.roleName} (missing)`);
        continue;
      }
      if (!role.editable) {
        unavailable.push(`${option.roleName} (above bot role)`);
        continue;
      }
      if (role.colors.primaryColor === colorNumber(option.color)) {
        unchanged += 1;
        continue;
      }

      await role.setColors(
        { primaryColor: option.color },
        "Synchronize character role color"
      );
      updated += 1;
    }

    console.log(
      `[${guild.name}] colors: ${updated} updated, ${unchanged} already correct, ${unavailable.length} unavailable.`
    );
    if (unavailable.length > 0) {
      console.error("Unavailable roles:", unavailable);
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`Could not synchronize role colors in server ${guildId}:`, error);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
});

client.login(token).catch((error) => {
  console.error("Discord login failed. Check the token and bot configuration.", error);
  process.exitCode = 1;
});
