import { DiscordMessage } from '../domain/discord-message'
import DiscordClient from "./discord-client"

export type DeleteMessageProgressCallback = (progress: number, total: number) => void

export type DmMessageDeleteParams = {
  isDm: boolean,
  authorId: DiscordAuthorId,
  channelId: DiscordChannelId,
  onProgress: DeleteMessageProgressCallback,
}

type RequestParams = {
  offset: number,
  author: DiscordAuthorId,
}

export default class DmMessageDeleter {

  readonly client: DiscordClient

  grandTotal = 0
  delCount = 0
  failCount = 0
  offset = 0

  constructor(client: DiscordClient) {
    this.client = client
  }

  async deleteAll(params: DmMessageDeleteParams) {
    const baseUrl = this.url(params)

    while (await this.deleteChunk(baseUrl, params)) {
      console.log('deleted chunk')
    }

    console.warn('Ended because API returned an empty page.')
  }

  async deleteChunk(baseUrl: string, params: DmMessageDeleteParams) {
    const resp = await this.tryRequest(baseUrl, {
      offset: this.offset,
      author: params.authorId
    })

    const data = await resp.json()
    const total = data.total_results
    const discoveredMessages = data.messages
      .map((convo: DiscordMessage[]) => convo.find(message => message.hit === true))
    const messagesToDelete = discoveredMessages
      .filter((msg: DiscordMessage) => {
          return msg.type === 0 || msg.type === 6 || (msg.pinned)
      })
    const skippedMessages = discoveredMessages
      .filter((msg: DiscordMessage)=>
        !messagesToDelete.find((m: DiscordMessage) => m.id===msg.id))

    if (messagesToDelete.length == 0) {
      return false;
    }

    for (const msg of messagesToDelete) {
      if (params.onProgress) {
        params.onProgress(this.delCount + 1, this.grandTotal)
      }

      let resp
      try {
        const s = Date.now()
        resp = await this.client.del(
          `https://discord.com/api/v6/channels/${msg.channel_id}/messages/${msg.id}`,
          []
        )
        this.delCount++
      } catch (err) {
        console.error('Delete request throwed an error:', err)
        console.log('Related object:', JSON.stringify(msg))
        this.failCount++
        continue
      }
    }

    if (skippedMessages.length > 0) {
        this.grandTotal -= skippedMessages.length
        this.offset += skippedMessages.length
        console.log(`Found ${skippedMessages.length} system messages! Decreasing grandTotal to ` +
          `${this.grandTotal} and increasing offset to ${this.offset}.`)
    }

    if ((total - this.offset) > 0) {
      return true
    } else {
      return false
    }
  }

  private async tryRequest(baseUrl: string, params: RequestParams) {
    const url = baseUrl + 'search?'
    const queryParams: string[][] = [
      [ 'author_id', params.author ],
      [ 'sort_by', 'timestamp' ],
      [ 'sort_order', 'desc' ],
      [ 'offset', String(this.offset) ],
      [ 'include_nsfw', 'true' ],
    ]

    const resp = await this.client.get(url, queryParams)
    return resp
  }

  private url(params: DmMessageDeleteParams): string {
    return (params.isDm) ?
        `https://discord.com/api/v6/channels/${params.channelId}/messages/` :
        `https://discord.com/api/v6/guilds/${params.channelId}/messages/`
  }
}
