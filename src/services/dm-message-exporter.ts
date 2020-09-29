import DiscordClient from "./discord-client"

export type DeleteMessageProgressCallback = (progress: number, total: number) => void

export type DmMessageExportParams = {
  isDm: boolean,
  authorId: DiscordAuthorId,
  channelId: DiscordChannelId,
  onProgress: DeleteMessageProgressCallback,
}

type RequestParams = {
  offset: number,
  author: DiscordAuthorId,
}

export default class DmMessageExporter {


  readonly client: DiscordClient

  grandTotal = 0
  delCount = 0
  failCount = 0
  offset = 0

  constructor(client: DiscordClient) {
    this.client = client
  }

  async exportAll(params: DmMessageExportParams) {
    const baseUrl = this.url(params)

    let exported = null
    while (exported = await this.exportChunk(baseUrl, params)) {
      for (const msg of exported.messages) {
        console.log(JSON.stringify(msg))
      }
    }

    console.warn('Ended because API returned an empty page.')
  }

  async deleteChunk(baseUrl: string, params: DmMessageExportParams) {
    const resp = await this.tryRequest(baseUrl, {
      offset: this.offset,
      author: params.authorId
    })

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

  private url(params: DmMessageExportParams): string {
    return (params.isDm) ?
        `https://discord.com/api/v6/channels/${params.channelId}/messages/` :
        `https://discord.com/api/v6/guilds/${params.channelId}/messages/`
  }
}
