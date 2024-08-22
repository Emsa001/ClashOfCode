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

    game.forEach((round: Clash) => {
        round.players.forEach((player: Player) => {

            let extra = 0;
            if(round.mode != "SHORTEST")
                extra = ((15 * 60 * 1000) - player.duration) / 1000;

            const data = {
                name: player.codingamerNickname,
                avatar: `https://static.codingame.com/servlet/fileservlet?id=${player.codingamerAvatarId}`,
                score: player.score + player.score == 100 ? extra : 0,
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
