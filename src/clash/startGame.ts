import { TextChannel } from "discord.js";
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
    const game: Clash[] = [];

    // await interaction.p
    const channel = (await interaction.guild?.channels.fetch(
        interaction.channelId as string
    )) as TextChannel;
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
        if (!round) return game;
        game.push(round);
    }

    return await finishGame({ rounds, channel, game });
}

export default startGame;
export { clashes };
