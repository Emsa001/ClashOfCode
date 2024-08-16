import "dotenv/config";

import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands, loadEvents } from "./utils/loaders";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

await loadCommands(client);
await loadEvents(client);

client.login(process.env.DISCORD_TOKEN);