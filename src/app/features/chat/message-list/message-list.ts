import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ChatMessage } from '../../../core/models/message';
import { UserService } from '../../../core/services/user.service';
import { MessageItem } from '../message-item/message-item';
import { buildRows } from '../message-rows';

/**
 * Scrollable list of the messages of one chat with a date separator per day (Figma
 * `210:1106`). Projected content (the chat intro) sits above the first message. The list
 * starts at the bottom and scrolls down only when the newest message changes, so reactions or
 * edits on older messages do not move it. Authors come from `UserService.users`, so online
 * status and names stay current. While `loading` is set, a note stands where the messages will
 * appear. `react` toggles the own reaction of a message,
 * `edit` stores the new text of an own message,
 * `threadOpened` reports a message whose thread is wanted. As the replies of a `thread` the list
 * has no date separators and starts at the top under the projected first message.
 */
@Component({
  selector: 'app-message-list',
  imports: [MessageItem],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList {
  private readonly users = inject(UserService);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  readonly messages = input.required<readonly ChatMessage[]>();
  readonly loading = input(false);
  readonly thread = input(false);
  readonly react = input.required<(messageId: string, emojiId: string) => Promise<void>>();
  readonly edit = input<((messageId: string, text: string) => Promise<void>) | null>(null);
  readonly threadOpened = output<string>();
  readonly rows = computed(() =>
    buildRows(this.messages(), Date.now()).filter(
      (row) => !this.thread() || row.kind === 'message',
    ),
  );
  readonly authors = computed(() => new Map(this.users.users().map((user) => [user.uid, user])));

  /** Scrolls down when the newest message changes, not on every change of the list. */
  constructor() {
    const lastId = computed(() => this.messages().at(-1)?.id);
    afterRenderEffect(() => {
      lastId();
      const element = this.scroller()?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
