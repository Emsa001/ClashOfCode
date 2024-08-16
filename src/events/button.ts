// ./events/ReadyEvent.ts
import { Client, Interaction } from "discord.js";
import { DiscordEvent } from "../types/discordEvent";
import startClash from "../clash/startClash";
import submitClash from "../clash/submitClash";
import { clashes } from "../clash/startGame";

export default class ReadyEvent implements DiscordEvent {
    name = "interactionCreate";

    async execute(client: Client, interaction: Interaction) {
        if (!interaction.isButton()) return;
        try {
            await interaction.deferUpdate();
            const [action, clash] = interaction.customId.split("_");
            const cookie =
                clashes.find((c) => c.clash === clash)?.cookie || "";

            if (action === "start") {
                if (!cookie) {
                    return await interaction.editReply({
                        content: "Clash not found",
                        // components: [],
                    });
                }
                const data = await startClash({ clash, cookie });
                if (data.status !== 204) {
                    return await interaction.editReply({
                        content: "An error occurred while starting the round",
                        // components: [],
                    });
                }

                const url = `https://www.codingame.com/clashofcode/clash/${clash}`;
                setTimeout(async () => {
                    await interaction.editReply({
                        content: `Round started! [Link](${url})`,
                        // components: [],
                    });
                }, 100);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
}
