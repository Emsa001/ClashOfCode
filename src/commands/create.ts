import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import startGame from "../api/startGame";

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
                .setName("cookie")
                .setDescription("Cookie rememberme")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("session")
                .setDescription("Cookie CGSession")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const rounds = Number(interaction.options.get("rounds")?.value);
        const game_modes = String(interaction.options.get("game_modes")?.value);
        const languages = String(interaction.options.get("languages")?.value);
        const cookie = String(interaction.options.get("cookie")?.value);
        const session = String(interaction.options.get("session")?.value);

        if (!rounds || !game_modes || !languages) {
            await interaction.reply("Please provide all the required options");
            return;
        }

        /*

        [
            { name: 'rounds', type: 10, value: 1 },
            { name: 'game_modes', type: 3, value: 'REVERSE,FASTEST,SHORTEST' },
            { name: 'languages', type: 3, value: 'all' },
            { name: 'cookie', type: 3, value: '123' }
        ]

        */

        await interaction.deferReply();

        const game = await startGame({
            interaction,
            rounds,
            modes: game_modes?.split(","),
            languages: languagesData[languages],
            cookie,
            session
        });

        console.log(game);
    },
};

export default createCommand;
