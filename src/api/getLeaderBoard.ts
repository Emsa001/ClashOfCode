import { Clash, Player } from "../types/clashes";

interface GameProps {
    game: Clash[];
}

type LeaderBoard = {
    name: string;
    score: number;
    position: number;
};

const getLeaderBoard = ({ game }: GameProps) => {
    const leaderboard: LeaderBoard[] = [];

    game.flatMap((round) => {
        round.players.map((player: Player) => {
            const data = {
                name: player.codingamerNickname,
                score: player.score,
                position: player.position,
            };

            const find = leaderboard.find(
                (player) => player.name === player.name
            );
            if (find) find.score += player.score;
            else leaderboard.push(data);
        });
    });

    console.log(leaderboard);
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
};

export default getLeaderBoard;
