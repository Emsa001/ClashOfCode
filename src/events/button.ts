// ./events/ReadyEvent.ts
import { Client, Interaction } from "discord.js";
import { DiscordEvent } from "../types/discordEvent";
import startClash from "../clash/startClash";
import { clashes } from "../clash/startGame";

export default class ReadyEvent implements DiscordEvent {
    name = "interactionCreate";

    async execute(client: Client, interaction: Interaction) {
        if (!interaction.isButton()) return;
        try {
            // await interaction.deferReply();

            const [action, clash] = interaction.customId.split("_");
            const cookie =
                clashes.find((c) => c.clash === clash)?.cookie || "";

            const author = interaction.message?.embeds[0].author?.name || "";
            if (action === "start") {
                if(author !== interaction.user.username) {
                    return await interaction.reply({
                        content: "Only the creator can start the round",
                    });
                }
                if (!cookie) {
                    return await interaction.reply({
                        content: "Clash not found",
                    });
                }
                const data = await startClash({ clash, cookie });
                if (data.status !== 204) {
                    return await interaction.reply({
                        content: "An error occurred while starting the round",
                    });
                }

                const url = `https://www.codingame.com/clashofcode/clash/${clash}`;
                setTimeout(async () => {
                    await interaction.reply({
                        content: `Starting round in 5 seconds! [Click here to join the clash](${url})`,
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
