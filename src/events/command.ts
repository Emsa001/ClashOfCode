// ./events/ReadyEvent.ts
import { Client, Interaction } from "discord.js";
import { DiscordEvent } from "../types/discordEvent";
import { commands } from "../utils/loaders";

export default class ReadyEvent implements DiscordEvent {
    name = "interactionCreate";

    async execute(client: Client, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
}
