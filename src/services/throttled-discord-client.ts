import fetch, { Response, Headers } from 'node-fetch'
import DiscordClient from './discord-client'

export type DiscordAuthToken = string;

export default class ThrottledDiscordClient implements DiscordClient {

  start = new Date()
  deleteDelay = 1250
  searchDelay = 3000
  avgPing = 100
  lastPing = 100
  throttledCount = 0
  throttledTotalTime = 0
  offset = 0
  iterations = -1

  authToken: string

  constructor(authToken: DiscordAuthToken) {
    this.authToken = authToken
  }

  async get(url: string, params: string[][]): Promise<Response> {
    const s = Date.now();
    const fetchParams = { headers: this.headers() }
    if (params) {
      url += this.queryString(params)
    }
    const resp = await fetch(url, fetchParams);
    this.lastPing = (Date.now() - s);
    this.avgPing = this.avgPing > 0 ? (this.avgPing * 0.9) + (this.lastPing * 0.1) : this.lastPing;

    if (resp.status === 202) {
      const w = (await resp.json()).retry_after;
      this.throttledCount++;
      this.throttledTotalTime += w;
      console.warn(`This channel wasn't indexed, waiting ${w}ms for discord to index it...`);
      await this.wait(w);
    }

    if (!resp.ok) {
      if (resp.status === 429) {
        const w = (await resp.json()).retry_after;
        this.throttledCount++;
        this.throttledTotalTime += w;
        this.searchDelay += w; // increase delay
        console.warn(`Being rate limited by the API for ${w}ms! Increasing search delay...`);
        this.printDelayStats();
        console.log(`Cooling down for ${w * 2}ms before retrying...`);

        await this.wait(w * 2);
      } else {
        console.error(`Error searching messages, API responded with status ${resp.status}!\n`, await resp.json());
      }
    }

    await this.wait(this.searchDelay)

    return resp
  }

  async del(url: string, params: string[][]): Promise<Response> {
    const fetchParams = {
      headers: this.headers(),
      method: 'DELETE',
    }
    if (params) {
      url += this.queryString(params)
    }
    const resp = await fetch(url, fetchParams);

    if (!resp.ok) {
      // deleting messages too fast
      if (resp.status === 429) {
        const w = (await resp.json()).retry_after
        this.throttledCount++
        this.throttledTotalTime += w
        this.deleteDelay = w // increase delay
        console.warn(`Being rate limited by the API for ${w}ms! Adjusted delete delay to ${this.deleteDelay}ms.`)
        this.printDelayStats()
        console.log(`Cooling down for ${w * 2}ms before retrying...`)
        await this.wait(w * 2)
      } else {
        console.error(`Error deleting message, API responded with status ${resp.status}!`, await resp.json())
      }
    }

    await this.wait(this.deleteDelay)
    return resp;
  }

  async wait(ms: number): Promise<void> {
    return new Promise(done => setTimeout(done, ms))
  }

  private headers(): Headers {
    return new Headers([['Authorization', this.authToken]]);
  }

  private queryString(params: string[][]): string {
    return params
      .filter(p => p[1] !== undefined)
      .map(p => p[0] + '=' + encodeURIComponent(p[1]))
      .join('&')
  }

  private printDelayStats(): void {
    console.log({
      start: this.start,
      deleteDelay: this.deleteDelay,
      searchDelay: this.searchDelay,
      avgPing: this.avgPing,
      lastPing: this.lastPing,
      throttledCount: this.throttledCount,
      throttledTotalTime: this.throttledTotalTime,
      offset: this.offset,
      iterations: this.iterations,
    })
  }
}
