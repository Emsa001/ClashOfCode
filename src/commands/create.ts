import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getCGSession, getRememberme, usedCookies } from "../data/cookies";
import startGame from "../clash/startGame";

const languagesData: { [key: string]: string[] } = {
    all: [
        "Bash",
        "C",
        "C#",
        "C++",
        "Clojure",
        "D",
        "Dart",
        "F#",
        "Go",
        "Groovy",
        "Haskell",
        "Java",
        "Javascript",
        "Kotlin",
        "Lua",
        "ObjectiveC",
        "OCaml",
        "Pascal",
        "Perl",
        "PHP",
        "Python3",
        "Ruby",
        "Rust",
        "Scala",
        "Swift",
        "TypeScript",
        "VB.NET",
    ],
    c: ["C", "C#", "C++"],
    scripting: [
        "Bash",
        "JavaScript",
        "TypeScript",
        "Python3",
        "Perl",
        "PHP",
        "Ruby",
        "Lua",
    ],
    object_oriented: ["C#", "Java", "Kotlin", "ObjectiveC", "Swift", "VB.NET"],
    functional: ["Haskell", "Clojure", "F#", "OCaml", "Scala"],
    compiled: ["C", "C++", "Rust", "Go", "D", "Pascal"],
    multi_paradigm: ["C++", "Groovy", "Kotlin", "TypeScript"],
    web: ["JavaScript", "PHP", "TypeScript", "Dart"],
    specific_platform: ["ObjectiveC", "Swift", "VB.NET", "Kotlin"],
    modern_system: ["Rust", "Go"],
};

const createCommand = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create a new Clash of Code Game")
        .addNumberOption((option) =>
            option
                .setName("rounds")
                .setDescription("Number of rounds")
                .setRequired(true)
                .setMaxValue(9)
                .setMinValue(1)
        )
        .addStringOption((option) =>
            option
                .setName("game_modes")
                .setDescription("Select the game modes")
                .setRequired(true)
                .addChoices(
                    { name: "ALL", value: "REVERSE,FASTEST,SHORTEST" },
                    { name: "REVERSE", value: "REVERSE" },
                    { name: "FASTEST", value: "FASTEST" },
                    { name: "SHORTEST", value: "SHORTEST" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("languages")
                .setDescription("Select available languages")
                .setRequired(true)
                .addChoices(
                    {
                        name: "ALL",
                        value: "all",
                    },
                    { name: "Only C", value: "c" },
                    {
                        name: "Scripting Languages",
                        value: "scripting",
                    },
                    {
                        name: "Object Oriented",
                        value: "object_oriented",
                    },
                    {
                        name: "Functional Languages",
                        value: "functional",
                    },
                    {
                        name: "Compiled Languages",
                        value: "compiled",
                    },
                    {
                        name: "Multi-Paradigm Languages",
                        value: "multi_paradigm",
                    },
                    {
                        name: "Web-Focused Languages",
                        value: "web",
                    },
                    {
                        name: "Languages for Specific Platforms",
                        value: "specific_platform",
                    },
                    { name: "Modern Systems Languages", value: "modern_system" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("rememberme")
                .setDescription("Cookie rememberme")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("cgsession")
                .setDescription("Cookie cgSession")
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction) {
        const rounds = Number(interaction.options.get("rounds")?.value);
        const game_modes = String(interaction.options.get("game_modes")?.value);
        const languages = String(interaction.options.get("languages")?.value);
        const cookie = String(interaction.options.get("rememberme")?.value) || getRememberme();
        const session = String(interaction.options.get("cgsession")?.value) || getCGSession();

        if (!rounds || !game_modes || !languages) {
            await interaction.reply("Please provide all the required options");
            return;
        }

        if(usedCookies.find((c) => c.cookie == cookie || c.session == session)) {
            await interaction.reply({ content: "A game is already running", ephemeral: true });
            return;
        }

        await interaction.reply({ content: "Creating game...", ephemeral: true });

        usedCookies.push({ cookie, session });
        await startGame({
            interaction,
            rounds,
            modes: game_modes?.split(","),
            languages: languagesData[languages],
            cookie,
            session,
        });

        usedCookies.splice(usedCookies.findIndex((c) => c.cookie == cookie || c.session == session), 1);
    },
};

export default createCommand;
