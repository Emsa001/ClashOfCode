import getLeaderBoard from "!/src/api/getLeaderBoard";
import checkClash from "!/src/api/checkClash";
import createClash from "!/src/api/createClash";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextChannel,
} from "discord.js";
import {
    Clash,
    StartGameProps,
    StartRoundProps,
    TempClash,
} from "../types/clashes";
import submitClash from "./submitClash";

const clashes: TempClash[] = [];

const startRound = async ({
    channel,
    languages,
    modes,
    cookie,
    session,
}: StartRoundProps) => {
    try {
        const response = await createClash({ languages, modes, cookie });
        const { data } = response;

        if (response?.status != 200) {
            console.log("ERROR: " + data.message);
            await channel.send(
                "An error occurred while starting a next round. Finishing the game"
            );
            return false;
        }

        const clash: string = data.publicHandle;
        clashes.push({ clash, cookie, languages, session });
        const url = `https://www.codingame.com/clashofcode/clash/${clash}`;

        const startButton = new ButtonBuilder()
            .setCustomId(`start_${clash}`)
            .setLabel("Start")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(startButton);

        await channel.send({
            content: `Round created! [Link](${url})`,
            components: [row as any],
        });

        return new Promise<Clash>((resolve) => {
            let submitted = false;
            const intervalId = setInterval(async () => {
                
                if(!submitted){
                    const submit = await submitClash({ clash, cookie });
                    if(submit.status === 200) submitted = true;
                }

                const round = await checkClash({ clash, cookie });
                if (round.finished) {
                    clearInterval(intervalId);
                    const index = clashes.findIndex((c) => c.clash === clash);
                    if (index !== -1) clashes.splice(index, 1);
                    resolve(round);
                }
            }, 10000);
        });
    } catch (error) {
        console.log("ERROR: " + error);
        await channel.send(
            "An error occurred while starting a next round. Finishing the game"
        );
        return false;
    }
};

async function startGame({
    interaction,
    rounds,
    languages,
    modes,
    cookie,
    session,
}: StartGameProps): Promise<Clash[]> {
    const game: Clash[] = [];

    await interaction.followUp("Game created!");
    const channel = (await interaction.guild?.channels.fetch(
        interaction.channelId as string
    )) as TextChannel;

    for (let i = 0; i < rounds; i++) {
        const round = await startRound({
            channel,
            languages,
            modes,
            cookie,
            session,
        });
        if (!round) return game;
        game.push(round);
    }

    const leaderboard = await getLeaderBoard({ game });
    console.log(leaderboard);
    channel.send("Game finished!");
    channel.send("Leaderboard:");
    leaderboard.map((player, index) => {
        channel.send(`${index + 1}. ${player.name} - ${player.score}`);
    });
    return game;
}

export default startGame;
export { clashes };
