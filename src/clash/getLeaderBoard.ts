import { Clash, Player } from "../types/clashes";
import { clashes } from "./startGame";

interface GameProps {
    game: Clash[];
    bot: number;
}

type LeaderBoard = {
    name: string;
    avatar: string;
    score: number;
    position: number;
};

const getLeaderBoard = ({ game, bot }: GameProps) => {
    const leaderboard: LeaderBoard[] = [];

    game.forEach((round: Clash) => {
        round.players.filter((e) => e.codingamerId != bot).forEach((player: Player) => {

            let extra = 0;

            if (player.score == 100) {
                if (round.mode == "SHORTEST") {
                    extra = Math.max(0, 500 - player.criterion);
                } else {
                    extra = Math.max(0, ((15 * 60 * 1000) - player.duration) / 1500);
                }
            }

            const playerScore = Math.round(player.score + extra);
            const data = {
                name: player.codingamerNickname,
                avatar: `https://static.codingame.com/servlet/fileservlet?id=${player.codingamerAvatarId}`,
                score: playerScore,
                position: player.position,
            };

            const find = leaderboard.find(
                (leader) => leader.name === player.codingamerNickname
            );
            if (find) {
                find.score += playerScore;
            } else {
                leaderboard.push(data);
            }
        });
    });

    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
};

export default getLeaderBoard;
