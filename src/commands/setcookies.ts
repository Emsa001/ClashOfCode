import {
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { setCGSession, setRememberme } from "../data/cookies";

const setCookies = {
    data: new SlashCommandBuilder()
        .setName("setcookies")
        .setDescription("How to use the bot")
        .addStringOption((option) =>
            option
                .setName("rememberme")
                .setDescription("Cookie rememberme")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("cgsession")
                .setDescription("Cookie cgSession")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {

        const rememberme = String(interaction.options.get("rememberme")?.value);
        const cgsession = String(interaction.options.get("cgsession")?.value);

        setRememberme(rememberme);
        setCGSession(cgsession);

        return interaction.reply({
            content: "Cookies set!",
            ephemeral: true,
        });
    },
};

export default setCookies;
