// ./events/ReadyEvent.ts
import { Client } from "discord.js";
import { DiscordEvent } from "../types/discordEvent";

export default class ReadyEvent implements DiscordEvent {
    name = "ready";

    execute(client: Client) {
        if (!client.user) {
            return console.error("Client user is undefined");
        }
        console.log(`Discord Client logged in as ${client.user.tag}!`);
    }
}