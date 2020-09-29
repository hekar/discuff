import fetch, { Response, Headers } from 'node-fetch'

export default interface DiscordClient {
  get(url: string, params: string[][]): Promise<Response>
  del(url: string, params: string[][]): Promise<Response>
  wait(ms: number): Promise<void>
}
