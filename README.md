# Discord 角色身份组 Bot

为 Discord 服务器提供角色颜色身份组菜单。目前包含《世界计划》六个组合与《魔法少女的魔女审判》的角色。

用户从下拉菜单选择角色后，会获得对应颜色的身份组；选择新角色会替换已有的角色身份组。Bot 启动后只处理菜单交互，不会自动创建频道、发送面板或修改身份组。

## 配置

在 `.env` 中配置以下内容：

```dotenv
BOT_TOKEN=your_discord_bot_token
GUILD_ID=123456789012345678
```

旧格式的 `bot_token` 仍然可用。`.env` 含有敏感 Token，已被 Git 和 Docker 构建上下文忽略。

Bot 需要位于所有可分配角色之上，并拥有 **Manage Roles** 权限。首次部署面板时还需要 **Manage Channels**、查看频道、发送消息和读取消息历史记录权限。

## Docker

需要 Docker Desktop 正在运行。

```powershell
docker compose up -d --build
docker compose logs -f bot
```

停止服务：

```powershell
docker compose down
```

## 管理操作

以下命令需要手动执行，不会在容器启动时自动运行：

```powershell
# 创建缺失身份组，并创建或更新角色选择面板。
docker compose run --rm bot sh -c 'npm run deploy-role-panels -- "$GUILD_ID"'

# 仅同步现有角色身份组的颜色。
docker compose run --rm bot sh -c 'npm run sync-role-colors -- "$GUILD_ID"'
```

角色配置位于 `src/role-panels.js`。修改角色名称、颜色或菜单内容后，先执行对应管理命令；仅修改菜单选项行为时，再重启监听器：

```powershell
docker compose restart bot
```
