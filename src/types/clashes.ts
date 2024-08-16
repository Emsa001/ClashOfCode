import { CommandInteraction, TextChannel } from "discord.js";

export interface Player {
  codingamerId: number;
  codingamerNickname: string;
  codingamerHandle: string;
  codingamerAvatarId: number;
  score: number;
  duration: number;
  criterion: number;
  status: string;
  testSessionStatus: string;
  languageId: string;
  rank: number;
  position: number;
  solutionShared: boolean;
  testSessionHandle: string;
  submissionId: number;
}

export interface Clash {
  nbPlayersMin: number;
  nbPlayersMax: number;
  publicHandle: string;
  clashDurationTypeId: string;
  startTimestamp: number;
  finished: boolean;
  started: boolean;
  players: Player[];
  type: string;
}

export interface StartRoundProps {
  channel: TextChannel;
  languages: string[];
  modes: string[];
  cookie: string;
  session: string;
}

export interface StartGameProps {
  interaction: CommandInteraction;
  rounds: number;
  languages: string[];
  modes: string[];
  cookie: string;
  session: string;
}

export type TempClash = {
  languages: string[];
  clash: string;
  cookie: string;
  session: string; 
};