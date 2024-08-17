import checkClash from "!/src/clash/checkClash";
import createClash from "!/src/clash/createClash";
import {
    ActionRowBuilder,
    APIUser,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Message,
    TextChannel,
    User,
} from "discord.js";
import { Clash, StartRoundProps } from "../types/clashes";
import submitClash from "./submitClash";
import { clashes } from "./startGame";
import { footer } from "../data/footer";

interface AnnounceRoundProps {
    round: number;
    channel?: TextChannel;
    message?: Message;
    clash: Clash;
}

const announceRound = async ({
    round,
    channel,
    message,
    clash,
}: AnnounceRoundProps) => {
    const publicHandle = clash.publicHandle;
    const url = `https://www.codingame.com/clashofcode/clash/${publicHandle}`;
    const { languages } = clashes.find((c) => c.clash === publicHandle) || {
        languages: [],
    };

    const topPlayers = clash.players
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((player, index) => {
            return {
                name: `${index + 1}. ${player.codingamerNickname}`,
                value: `${player.score || 0} points`,
                inline: true,
            };
        });

    const tempClash = clashes.find((c) => c.clash === publicHandle);
    const avatar = `https://cdn.discordapp.com/avatars/${tempClash?.creator?.id}/${tempClash?.creator?.avatar}.png?size=256`;

    const roundEmebed = new EmbedBuilder()
        .setColor(0x22c55e)
        .setTitle(`Round ${round}`)
        .setDescription("Click the buttons below to start or join the clash")
        .setAuthor({ name: tempClash?.creator?.username || "unknown", iconURL: avatar })
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
        .setDisabled(clash.started)
        .setLabel("Join")
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(startButton, joinButton);

    if (channel) {
        const response = await channel.send({
            embeds: [roundEmebed],
            components: [row as any],
        });
        return response;
    } else if (message) {
        const response = await message.edit({
            embeds: [roundEmebed],
            components: [row as any],
        });

        return response;
    }
};

const waitForEnd = (
    round: number,
    message: Message | undefined,
    clash: Clash
) => {
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
            announceRound({ round, message, clash: clashRound });

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
        const response = await createClash({ languages, modes, cookie });
        if (response?.status != 200) return false;
        const { data } = response;

        const clash: string = data.publicHandle;
        clashes.push({ clash, cookie, languages, session, modes, creator });

        const message = await announceRound({ round, channel, clash: data });
        return await waitForEnd(round, message, data);
    } catch (error) {
        console.log(error);
        await channel.send(
            "An error occurred while starting a next round. Finishing the game"
        );
        return false;
    }
};

export default startRound;
