import { APIUser, CommandInteraction, Message, TextChannel, User } from "discord.js";

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
  mode: string;
}

export interface StartRoundProps {
  round: number;
  channel: TextChannel;
  creator: User | APIUser | undefined;
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
  modes: string[];
  clash: string;
  cookie: string;
  session: string; 
  creator: User | APIUser | undefined;
  channel: TextChannel;
  message: Message;
};