import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

/**
 * Placeholder for the chat views of area B until the real views exist. It only shows
 * which view (route data `view`) is open and which id (first route parameter) it got.
 */
@Component({
  selector: 'app-chat-placeholder',
  template: `
    <p>{{ view }}</p>
    @if (id()) {
      <p>{{ id() }}</p>
    }
  `,
})
export class ChatPlaceholder {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { requireSync: true });
  readonly view: string = this.route.snapshot.data['view'];
  readonly id = computed(() => this.params().get(this.params().keys[0] ?? '') ?? '');
}
