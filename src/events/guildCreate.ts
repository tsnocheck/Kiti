import type {Guild} from 'discord.js';
import {BotClient} from '../lib/discord/Client';
import {IEvent} from "../lib/discord/Event";

export default class GuildCreate implements IEvent {

  name = 'guildCreate';

  async run(client: BotClient, guild: Guild) {
    let guildCount = await client.guilds.fetch();
    await client.metrics.pushGuildCount(guildCount.size);

    let guildId = client.redis?.get(guild.id);
    if (!guildId) return;
    await client.metrics.incrementDeleteGuildCount();
  }
}
