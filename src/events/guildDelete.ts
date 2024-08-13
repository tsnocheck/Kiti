import type { Guild } from 'discord.js'
import { BotClient } from '../lib/discord/Client'
import {IEvent} from "../lib/discord/Event";

export default class GuildDelete implements IEvent {

  name = 'guildDelete'

  async run(client: BotClient, guild: Guild) {
    let guildCount = await client.guilds.fetch()
    await client.metrics.pushGuildCount(guildCount.size)
    await client.metrics.addDeleteGuildNumber()
    
    client.redis.set('guildDelete', guild.id, {
      EX: 15 * 1000,
      NX: true
    })
  }
}
