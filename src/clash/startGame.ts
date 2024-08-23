import { Message, TextChannel } from "discord.js";
import { Clash, StartGameProps, TempClash } from "../types/clashes";
import startRound from "./startRound";
import finishGame from "./finishGame";

const clashes: TempClash[] = [];

async function startGame({
    interaction,
    rounds,
    languages,
    modes,
    cookie,
    session,
}: StartGameProps): Promise<Clash[]> {
    try {
        const game: Clash[] = [];
        const channel = interaction.channel as TextChannel;
        const creator = interaction.member?.user;

        for (let i = 0; i < rounds; i++) {
            const round = await startRound({
                round: i + 1,
                channel,
                creator,
                languages,
                modes,
                cookie,
                session,
            });
            if (round.error){
                await interaction.editReply(
                    "An error occurred while starting the game. Please try again later: " + round.message
                );
                return game;
            };
            game.push(round);
        }

        return await finishGame({ rounds, channel, game });
    } catch (error) {
        await interaction.editReply(
            "An error occurred while starting the game. Please try again later."
        );
        return [];
    }
}

export default startGame;
export { clashes };
