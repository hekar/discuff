import DmMessageDeleter, { DmMessageDeleteParams } from './dm-message-deleter';
import DmMessageExporter, { DmMessageExportParams } from './dm-message-exporter';
import DiscordClient from "./discord-client";

export default class Discord {
  client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client
  }

  /**
   * List all direct messages for the given user.
   */
  async dmList() {

  }

  /**
   * Export the chat history for a given direct message.
   */
  async dmExport(params: DmMessageExportParams) {
    const exporter = new DmMessageExporter(this.client)
    return await exporter.exportAll(params)
  }

  /**
   * Delete the entire chat history for a given direct message.
   */
  async dmDelete(params: DmMessageDeleteParams) {
    const deleter = new DmMessageDeleter(this.client)
    return await deleter.deleteAll(params)
  }
}
