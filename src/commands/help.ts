import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { footer } from "../data/footer";

const helpCommand = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("How to use the bot"),
    async execute(interaction: CommandInteraction) {
        const helpMessage = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("⚔️ Clash of Code Bot")
            .setURL("https://www.codingame.com/multiplayer/clashofcode")
            .setAuthor({
                name: "by Emanuel",
                iconURL: "https://avatars.githubusercontent.com/u/59392453?v=4",
                url: "https://github.com/emsa001",
            })
            .setDescription(
                "⚠️ **! DO NOT USE YOUR ACCOUNT AS A BOT, CREATE A NEW ONE !**"
            )
            .addFields(
                {
                    name: "🔍 Find RememberMe Cookie",
                    value: "Developer tools > Storage > Cookies > rememberme",
                },
                {
                    name: "🔍 Find cgSession Cookie",
                    value: "Developer tools > Storage > Cookies > cgSession",
                },
                {
                    name: "🎮 Start a game",
                    value: "/create [rounds] [modes] [languages] [rememberme] [cgsession]",
                    inline: false,
                }
            )
            .setTimestamp()
            .setFooter(footer);

        const github = new ButtonBuilder()
            .setLabel("Github")
            .setURL("https://github.com/Emsa001/ClashOfCode")
            .setStyle(ButtonStyle.Link);
        const clashofcode = new ButtonBuilder()
            .setLabel("Clash of Code")
            .setURL("https://www.codingame.com/multiplayer/clashofcode")
            .setStyle(ButtonStyle.Link);
        

        const row = new ActionRowBuilder().addComponents(github, clashofcode);

        return interaction.reply({
            embeds: [helpMessage],
            components: [row as any],
            ephemeral: true,
        });
    },
};

export default helpCommand;
