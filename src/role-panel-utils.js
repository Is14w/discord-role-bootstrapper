const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

function panelCustomId(panelId) {
  return `character-role:${panelId}`;
}

function validatePanels(panels) {
  const panelIds = new Set();
  const roleNames = new Set();

  for (const panel of panels) {
    if (!panel.id || panelIds.has(panel.id)) {
      throw new Error(`Invalid or duplicate panel ID: ${panel.id}`);
    }
    panelIds.add(panel.id);

    if (panel.options.length === 0 || panel.options.length > 25) {
      throw new Error(`Panel ${panel.id} must have 1-25 options.`);
    }

    for (const option of panel.options) {
      if (!option.id || !option.label) {
        throw new Error(`Panel ${panel.id} contains an invalid option.`);
      }
      if (option.roleName && roleNames.has(option.roleName)) {
        throw new Error(`Duplicate role name: ${option.roleName}`);
      }
      if (option.roleName) {
        roleNames.add(option.roleName);
      }
    }
  }
}

function getRoleOptions(panels) {
  return panels.flatMap((panel) =>
    panel.options.filter((option) => option.roleName)
  );
}

function getRoleNamesForScope(panels, scope) {
  return panels
    .filter((panel) => panel.exclusiveScope === scope)
    .flatMap((panel) => panel.options)
    .filter((option) => option.roleName)
    .map((option) => option.roleName);
}

function buildPanelPayload(panel) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(panelCustomId(panel.id))
    .setPlaceholder(panel.placeholder)
    .addOptions(
      panel.options.map((option) => ({
        label: option.label,
        value: option.id,
        description: option.description
      }))
    );

  return {
    embeds: [
      new EmbedBuilder()
        .setColor(panel.color)
        .setTitle(panel.title)
        .setDescription(panel.description)
    ],
    components: [new ActionRowBuilder().addComponents(menu)]
  };
}

function createRoleOptions(option) {
  return {
    name: option.roleName,
    colors: { primaryColor: option.color },
    hoist: false,
    mentionable: false,
    reason: "Character role panel setup"
  };
}

module.exports = {
  buildPanelPayload,
  createRoleOptions,
  getRoleNamesForScope,
  getRoleOptions,
  panelCustomId,
  validatePanels
};
