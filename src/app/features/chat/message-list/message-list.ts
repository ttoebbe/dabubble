import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Message } from '../../../core/models/message';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MessageItem } from '../message-item/message-item';
import { buildRows } from '../message-rows';

/**
 * Scrollable list of the messages of one chat with a date separator per day (Figma
 * `210:1106`). Projected content (the chat intro) sits above the first message. The list
 * scrolls to the newest message whenever the messages change. Authors come from
 * `UserService.users`, so online status and names stay current. While `loading` is set, a
 * note stands where the messages will appear.
 */
@Component({
  selector: 'app-message-list',
  imports: [MessageItem],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageList {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  readonly messages = input.required<readonly Message[]>();
  readonly loading = input(false);
  readonly selfUid = this.auth.uid;
  readonly rows = computed(() => buildRows(this.messages(), Date.now()));
  readonly authors = computed(() => new Map(this.users.users().map((user) => [user.uid, user])));

  /** Keeps the newest message in view. */
  constructor() {
    afterRenderEffect(() => {
      this.rows();
      const element = this.scroller()?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
