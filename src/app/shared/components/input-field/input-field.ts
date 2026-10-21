import {
  Component,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  computed,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';

let nextFieldId = 0;

/**
 * Shared pill-shaped input (Figma `2. Email`, `3. Password`, `4. Name`).
 * The native input is projected and marked with `#control`, so it works with any
 * forms API; its `id` is set here to tie it to the surrounding label. The error line keeps its space reserved: a message never shifts the layout.
 */
@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'input-field', '[class.input-field--error]': 'hasError()' },
})
export class InputField {
  readonly icon = input<string>();
  readonly error = input<string | null>(null);
  readonly controlId = `input-field-${++nextFieldId}`;
  readonly errorId = `${this.controlId}-error`;
  readonly hasError = computed(() => !!this.error());
  readonly iconMask = computed(() => `url(img/icons/${this.icon()}.svg)`);
  private readonly control = contentChild.required('control', { read: ElementRef });
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => this.linkControl());
  }

  /** Styles the projected input, gives it the label's id and links it to the error line. */
  private linkControl(): void {
    const element: HTMLElement = this.control().nativeElement;
    this.renderer.addClass(element, 'input-field__control');
    this.renderer.setAttribute(element, 'id', this.controlId);
    this.renderer.setAttribute(element, 'aria-describedby', this.errorId);
    this.renderer.setAttribute(element, 'aria-invalid', String(this.hasError()));
  }
}
