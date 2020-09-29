import {Command, flags} from '@oclif/command'
import Discord from '../services/discord'
import ThrottledDiscordClient from '../services/throttled-discord-client'

export default class DmExport extends Command {
  static description = 'Export a set of direct messages to JSON'

  static examples = [
    `$ discuff dm-export -c <channel-id> -a <account-id> -t <auth-token>`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    author: flags.string({char: 'a', description: 'The AuthorId', required: true}),
    channel: flags.string({char: 'c', description: 'The ChannelId', required: true}),
    token: flags.string({char: 't', description: 'The AuthToken', required: true}),
  }

  async run() {
    const {args, flags} = this.parse(DmExport)

    const client = new ThrottledDiscordClient(flags.token)
    const discord = new Discord(client);
    discord.deleteMessagesFromDms({
      authorId: flags.author,
      channelId: flags.channel,
      isDm: true,
      onProgress: (progress: number, total: number) => `Deleting ${progress} of ${total}`,
    })
  }
}
