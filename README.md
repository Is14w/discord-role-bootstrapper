# Discord Role Bootstrapper

This command creates the roles listed in `src/roles.js` in one explicitly selected server. It never creates roles automatically on login or startup. A role that already exists with the same name is skipped, so rerunning it against the same server is safe.

## Setup

1. Reset the token that was exposed, then put the new value in `.env` as `BOT_TOKEN=...`. The existing lowercase `bot_token=...` also works temporarily.
2. In the Discord Developer Portal, create an installation link with the `bot` scope and invite the bot to the target server.
3. Give the bot the server-level **Manage Roles** permission. Its highest role must be above any role it will later manage.
4. Edit `src/roles.js` to set the role names, colors, and display options you need.
5. Install dependencies, then run the command with the exact target server ID:

```powershell
npm install
npm run create-roles -- 123456789012345678
```

Enable Discord Developer Mode, then right-click a server and choose **Copy Server ID**. The bot must already be a member of that server.

The bot only creates missing roles. It deliberately does not set server permissions or assign roles to members; those actions should be explicitly configured to avoid accidental privilege changes.
