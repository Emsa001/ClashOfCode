import checkClash from "!/src/clash/api/checkClash";
import createClash from "!/src/clash/api/createClash";
import {
    ActionRowBuilder,
    APIUser,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    Message,
    TextChannel,
    User,
} from "discord.js";
import { Clash, StartRoundProps } from "../types/clashes";
import submitClash from "./api/submitClash";
import { clashes } from "./startGame";
import { footer } from "../data/footer";
import getLeaderBoard from "./getLeaderBoard";

interface AnnounceRoundProps {
    round: number;
    clash: Clash;
}

const announceRound = async ({ round, clash }: AnnounceRoundProps) => {
    const publicHandle = clash.publicHandle;
    const url = `https://www.codingame.com/clashofcode/clash/${publicHandle}`;
    const { languages } = clashes.find((c) => c.clash === publicHandle) || {
        languages: [],
    };

    const topPlayers = getLeaderBoard({ game: [clash] })
        .map((player, index) => {
            return {
                name: `${index + 1}. ${player.name}`,
                value: `${player.score || 0} points`,
                inline: true,
            };
        });

    const tempClash = clashes.find((c) => c.clash === publicHandle);
    if (!tempClash) return;
    const avatar = `https://cdn.discordapp.com/avatars/${tempClash?.creator?.id}/${tempClash?.creator?.avatar}.png?size=256`;

    const roundEmebed = new EmbedBuilder()
        .setColor(
            clash.finished ? 0x818cf8 : clash.started ? 0xfacc15 : 0x22c55e
        )
        .setTitle(`Round ${round}`)
        .setDescription("Click the buttons below to start or join the clash")
        .setAuthor({
            name: tempClash?.creator?.username || "unknown",
            iconURL: avatar,
        })
        .addFields(
            {
                name: "languages",
                value: `${languages.join(", ")}`,
                inline: false,
            },
            {
                name: "Players",
                value: `${clash.players.length}/${clash.nbPlayersMax}`,
                inline: true,
            },
            {
                name: "Started",
                value: `${clash.started ? "Yes" : "No"}`,
                inline: true,
            },
            {
                name: "Finished",
                value: `${clash.finished ? "Yes" : "No"}`,
                inline: true,
            },
            {
                name: "Mode",
                value: `${clash?.type || "unknown"}`,
                inline: true,
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: false,
            }
        )
        .setURL(url)
        .setTimestamp()
        .setFooter(footer);

    if (topPlayers.length > 0) {
        roundEmebed.addFields(...topPlayers);
    }

    const startButton = new ButtonBuilder()
        .setCustomId(`start_${publicHandle}`)
        .setDisabled(clash.started)
        .setLabel("Start")
        .setStyle(ButtonStyle.Success);

    const joinButton = new ButtonBuilder()
        .setURL(url)
        .setLabel(clash.started ? "See round" : "Join")
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(joinButton,startButton);

    try {
        await tempClash.message.edit({
            content: "",
            embeds: [roundEmebed],
            components: [row as any],
        });
    } catch (error) {
        try {
            tempClash.message = (await tempClash?.channel.send({
                content: "",
                embeds: [roundEmebed],
                components: [row as any],
            })) as Message;
        } catch (error) {
            console.log(error);
        }
    }
};

interface WaitForEndProps {
    round: number;
    clash: Clash;
}

const waitForEnd = ({ round, clash }: WaitForEndProps) => {
    const publicHandle = clash.publicHandle;
    const { cookie } = clashes.find((c) => c.clash === publicHandle) || {
        cookie: "",
    };

    let submitted = false;
    const botSubmit = async () => {
        const submit = await submitClash({ clash: publicHandle, cookie });
        if (submit?.status === 200) submitted = true;
    };

    return new Promise<Clash>((resolve) => {
        const intervalId = setInterval(async () => {
            if (!submitted) await botSubmit();
            const clashRound = await checkClash({
                clash: publicHandle,
                cookie,
            });
            announceRound({ round, clash: clashRound });

            if (clashRound.finished) {
                clearInterval(intervalId);
                resolve(clashRound);
            }
        }, 5000);
    });
};

const startRound = async ({
    round,
    channel,
    creator,
    languages,
    modes,
    cookie,
    session,
}: StartRoundProps): Promise<Clash | false> => {
    try {
        const message = (await channel.send("Creating round...")) as Message;
        const response = await createClash({ languages, modes, cookie });
        if (response?.status != 200) return false;
        const { data } = response;

        const clash: string = data.publicHandle;
        clashes.push({
            clash,
            cookie,
            languages,
            session,
            modes,
            creator,
            channel,
            message,
        });
        await announceRound({ round, clash: data });
        return await waitForEnd({ round, clash: data });
    } catch (error) {
        console.log(error);
        await channel.send(
            "An error occurred while starting a next round. Finishing the game"
        );
        return false;
    }
};

export default startRound;
