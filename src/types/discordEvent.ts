import { Client } from "discord.js";

export interface DiscordEvent {
    name: string;
    execute(client: Client, ...args: any[]): void;
}