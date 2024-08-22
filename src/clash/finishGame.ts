import { EmbedBuilder, TextChannel } from "discord.js";
import { Clash } from "../types/clashes";
import getLeaderBoard from "./getLeaderBoard";
import { clashes } from "./startGame";
import { footer } from "../data/footer";

const gameFinishMessage = async (
    rounds: number,
    channel: TextChannel,
    game: Clash[]
) => {
    const clash = clashes.find((c) => c.clash === game[0].publicHandle);

    const leaderBoard = await getLeaderBoard({ game });
    const leaderboardField = leaderBoard.map((player, index) => {
        return {
            name: `${index + 1}. ${player.name}`,
            value: `${player.score} points`,
            inline: true,
        };
    });

    const allRounds = game.map((round, index) => {
        return {
            name: `Round ${index}`,
            value: `[Link](https://www.codingame.com/clashofcode/clash/${round.publicHandle})`,
            inline: true,
        };
    });

    const roundEmebed = new EmbedBuilder()
        .setColor(0x9333ea)
        .setTitle(`Game finished! - ${rounds} rounds`)
        .addFields(
            {
                name: "languages",
                value: `${clash?.languages.join(", ") || "error fetching"}`,
                inline: false,
            },
            {
                name: "modes",
                value: `${clash?.modes.join(", ") || "error fetching"}`,
                inline: true,
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: false,
            }
        )
        .addFields(...allRounds)
        .addFields({
            name: "\u200B",
            value: "\u200B",
            inline: false,
        })
        .setThumbnail(leaderBoard[0].avatar)
        .setTimestamp()
        .setFooter(footer);

    if (leaderboardField.length > 0) {
        roundEmebed.addFields(...leaderboardField);
    }

    await channel.send({
        embeds: [roundEmebed],
    });
};

interface FinishGameProps {
    rounds: number;
    channel: TextChannel;
    game: Clash[];
}

const finishGame = async ({ rounds, channel, game }: FinishGameProps) => {
    await gameFinishMessage(rounds, channel, game);

    game.forEach((round) => {
        const index = clashes.findIndex((c) => c.clash === round.publicHandle);
        if (index !== -1) clashes.splice(index, 1);
    });

    return game;
};

export default finishGame;
