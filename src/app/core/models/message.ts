/** Chat message or thread reply, stored in `.../messages/{messageId}` (ttoebbe/dabubble#1). */
export interface ChatMessage {
  id: string;
  /** uid of the author; may point to no profile (deleted guest). */
  authorId: string;
  /** 1 to 4000 characters, emojis as Unicode in the text. */
  text: string;
  /** Milliseconds since 1970, like `Channel.createdAt`. */
  createdAt: number;
  /** Null when the message was never edited. */
  editedAt: number | null;
  /** Emoji id → uids of the people who reacted. */
  reactions: Record<string, string[]>;
}

/** Top-level message of a channel or direct chat; carries the thread counters. */
export interface Message extends ChatMessage {
  /** "2 Antworten". */
  replyCount: number;
  /** "Letzte Antwort 14:56"; null without replies. */
  lastReplyAt: number | null;
}
