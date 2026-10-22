/** Channel as the channel settings show it. */
export interface ChannelInfo {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly creatorName: string;
}

/** Sample channel from Figma (`364:2288`) until `ChannelService` exists (docs/todo.md). */
export const SAMPLE_CHANNEL_INFO: ChannelInfo = {
  id: 'entwicklerteam',
  name: 'Entwicklerteam',
  description:
    'Dieser Channel ist für alles rund um #dfsdf vorgesehen. Hier kannst du zusammen mit ' +
    'deinem Team Meetings abhalten, Dokumente teilen und Entscheidungen treffen.',
  creatorName: 'Noah Braun',
};
