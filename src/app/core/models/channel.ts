/** A channel, stored in `channels/{channelId}` (proposal ttoebbe/dabubble#1). */
export interface Channel {
  id: string;
  /** Unique, ignoring case. */
  name: string;
  description: string;
  /** uid of the person who created the channel. */
  creatorId: string;
  /** uids of all members. */
  memberIds: string[];
  /** Milliseconds since 1970. */
  createdAt: number;
}
