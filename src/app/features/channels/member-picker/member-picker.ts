import { Component, ElementRef, computed, input, model, signal, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';

let nextPickerId = 0;

/**
 * Picks people by name (Figma `41. Add members R corner`, `38.` Variant3–7): typing filters
 * the people, a click adds the person as chip, the cross removes it again. Bound with
 * `[formField]` like a native input; its value is the list of chosen person ids.
 */
@Component({
  selector: 'app-member-picker',
  imports: [Avatar],
  templateUrl: './member-picker.html',
  styleUrl: './member-picker.scss',
})
export class MemberPicker implements FormValueControl<string[]> {
  readonly value = model<string[]>([]);
  readonly people = input.required<readonly MenuContact[]>();
  readonly query = signal('');
  readonly listId = `member-picker-${nextPickerId++}`;
  readonly chosen = computed(() => this.people().filter((person) => this.isChosen(person)));
  readonly suggestions = computed(() => this.findSuggestions(this.query().trim().toLowerCase()));
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');

  /** Takes over what the user typed. */
  updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  /** Adds a person, clears the search and keeps the focus in it. */
  add(id: string): void {
    this.value.update((ids) => [...ids, id]);
    this.query.set('');
    this.search().nativeElement.focus();
  }

  /** Removes a chosen person. */
  remove(id: string): void {
    this.value.update((ids) => ids.filter((chosenId) => chosenId !== id));
  }

  /** Backspace in an empty search removes the last chip; Escape clears the search, not the dialog. */
  handleKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.query()) {
      event.preventDefault();
      this.query.set('');
    } else if (event.key === 'Backspace' && !this.query() && this.value().length) {
      this.remove(this.value()[this.value().length - 1]);
    }
  }

  /** People whose name contains the search and who are not chosen yet; none for an empty search. */
  private findSuggestions(search: string): MenuContact[] {
    if (!search) {
      return [];
    }
    return this.people().filter(
      (person) => !this.isChosen(person) && person.name.toLowerCase().includes(search),
    );
  }

  /** Whether the person is already part of the value. */
  private isChosen(person: MenuContact): boolean {
    return this.value().includes(person.id);
  }
}
