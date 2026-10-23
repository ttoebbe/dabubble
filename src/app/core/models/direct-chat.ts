/** Direct conversation of two people, stored in `directChats/{chatId}` (ttoebbe/dabubble#1). */
export interface DirectChat {
  /** `${memberIds[0]}_${memberIds[1]}`. */
  id: string;
  /** Exactly two uids in ascending order; the chat with oneself is `[a, a]`. */
  memberIds: string[];
  /** Milliseconds since 1970. */
  createdAt: number;
}
