import { Response } from 'node-fetch'
import { DiscordMessage } from '../domain/discord-message'
import DiscordClient from './discord-client'

export type MessageSearchParams = {
  offset: number,
  limit: number,
  author: DiscordAuthorId,
  channel: DiscordChannelId,
  isDm: boolean,
}

export type MessageSearchResults = {
  messages: DiscordMessage[],
}

/**
 * Search for messages within a channel.
 *
 * Works with channels and DMs.
 */
export default class DmMessageSearch {

  readonly client: DiscordClient

  offset = 0

  constructor(client: DiscordClient) {
    this.client = client
  }

  async search(baseUrl: string, params: MessageSearchParams): MessageSearchResults {
    const url = baseUrl + 'search?'
    const queryParams: string[][] = [
      [ 'author_id', params.author ],
      [ 'sort_by', 'timestamp' ],
      [ 'sort_order', 'desc' ],
      [ 'offset', String(this.offset) ],
      [ 'include_nsfw', 'true' ],
    ]

    return this.parse(await this.client.get(url, queryParams))
  }

  private parse(response: Response): MessageSearchResults {
    const body = response.json()

    return {
    }
  }

  private url(params: MessageSearchParams): string {
    return (params.isDm) ?
        `https://discord.com/api/v6/channels/${params.channel}/messages/` :
        `https://discord.com/api/v6/guilds/${params.channel}/messages/`
  }
}
