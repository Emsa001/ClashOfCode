import { join } from "path";
import { readdirSync } from "fs";
import { DiscordEvent } from "../types/discordEvent";
import { Client, Collection } from "discord.js";

import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

const commands:any = new Collection();

async function loadCommands(client: Client) {
    const rest = new REST({ version: "10" }).setToken(
        process.env.DISCORD_TOKEN || ""
    );

    try {
        console.log("Started refreshing application (/) commands.");

        const commandsPath = "src/commands";
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".ts"));

        const commandData = await Promise.all(commandFiles.map(async (file) => {
            const command = (await import(path.join(commandsPath, file))).default;
            commands.set(command.data.name, command);
            return command.data.toJSON();
        }));

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID || ''),
            { body: commandData },
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

async function loadEvents(client: Client) {
    const eventsPath = "src/events";
    const eventFiles = readdirSync(eventsPath).filter(
        (file) => file.endsWith(".ts") && !file.startsWith("_")
    );

    for (const file of eventFiles) {
        const { default: EventClass } = await import(join(eventsPath, file));
        if (typeof EventClass === "function") {
            const event: DiscordEvent = new EventClass();
            await client.on(event.name, event.execute.bind(null, client));
        } else {
            console.error(`Event ${file} does not export a class`);
        }
    }
}

export { loadEvents, loadCommands, commands };