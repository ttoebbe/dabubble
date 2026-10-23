/** An emoji of the chat: stable id for stored reactions, Unicode character and screen reader name. */
export interface ChatEmoji {
  readonly id: string;
  readonly char: string;
  readonly label: string;
}

/**
 * The emojis on offer in the picker and for reactions. The first four are the ones of Figma
 * `51. Emojis`; the rest are common ones added by decision of the team. Shown as Unicode,
 * not as the Emojitwo images of the design.
 */
export const CHAT_EMOJIS: readonly ChatEmoji[] = [
  { id: 'rocket', char: '🚀', label: 'Rakete' },
  { id: 'check', char: '✅', label: 'Häkchen' },
  { id: 'nerd', char: '🤓', label: 'Nerd-Gesicht' },
  { id: 'raised-hands', char: '🙌', label: 'Feiernde Hände' },
  { id: 'thumbs-up', char: '👍', label: 'Daumen hoch' },
  { id: 'thumbs-down', char: '👎', label: 'Daumen runter' },
  { id: 'heart', char: '❤️', label: 'Herz' },
  { id: 'laughing', char: '😂', label: 'Lachen mit Tränen' },
  { id: 'smile', char: '😊', label: 'Lächeln' },
  { id: 'heart-eyes', char: '😍', label: 'Herzaugen' },
  { id: 'thinking', char: '🤔', label: 'Nachdenken' },
  { id: 'surprised', char: '😮', label: 'Überrascht' },
  { id: 'sad', char: '😢', label: 'Traurig' },
  { id: 'party', char: '🎉', label: 'Konfetti' },
  { id: 'clap', char: '👏', label: 'Klatschen' },
  { id: 'fire', char: '🔥', label: 'Feuer' },
  { id: 'pray', char: '🙏', label: 'Bitte' },
  { id: 'eyes', char: '👀', label: 'Augen' },
  { id: 'hundred', char: '💯', label: 'Hundert Punkte' },
  { id: 'wave', char: '👋', label: 'Winken' },
];
