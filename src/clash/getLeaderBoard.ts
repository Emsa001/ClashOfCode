import { Clash, Player } from "../types/clashes";

interface GameProps {
    game: Clash[];
}

type LeaderBoard = {
    name: string;
    avatar: string;
    score: number;
    position: number;
};

const getLeaderBoard = ({ game }: GameProps) => {
    const leaderboard: LeaderBoard[] = [];


    game.forEach((round) => {
        round.players.forEach((player: Player) => {
            const data = {
                name: player.codingamerNickname,
                avatar: `https://static.codingame.com/servlet/fileservlet?id=${player.codingamerAvatarId}`,
                score: player.score,
                position: player.position,
            };

            const find = leaderboard.find(
                (leader) => leader.name === player.codingamerNickname
            );
            if (find) {
                find.score += player.score;
            } else {
                leaderboard.push(data);
            }
        });
    });

    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
};

export default getLeaderBoard;
