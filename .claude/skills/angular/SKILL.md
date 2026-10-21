---
name: angular
description: >
  Angular component, @Component, Standalone, signal(), computed(), effect(), input(),
  output(), inject(), OnPush, ChangeDetectionStrategy, @if, @for, @switch, ngOnInit,
  NgOptimizedImage, host binding, Angular coding standards — Best Practices fuer
  bestehende Standalone-Components, Signals und Control Flow. Fuer Reactive Forms
  stattdessen angular-forms; fuers Neuanlegen eines Projekts scaffold-angular.
---

## Angular Coding Standards

### Standalone Components

Kein `NgModule` — alle Abhängigkeiten direkt im `@Component.imports` einbinden:

```typescript
@Component({
  selector: "app-example",
  imports: [CommonModule, RouterLink],
  templateUrl: "./example.html",
  styleUrl: "./example.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {}
```

- `standalone: true` **nicht** setzen — ist Default ab Angular v17+
- `ChangeDetectionStrategy.OnPush` in **jedem** `@Component` — keine Ausnahmen,
  auch für rein statische Komponenten (Header, Footer, Logo)

### Dependency Injection

`inject()` statt Constructor Injection:

```typescript
// SCHLECHT
constructor(private userService: UserService) {}

// GUT
userService = inject(UserService);
```

### Signals für State

```typescript
// Einfacher State
count = signal(0);

// Derived State (automatisch aktuell)
doubled = computed(() => this.count() * 2);

// Side Effects
effect(() => console.log("count changed:", this.count()));

// Wert setzen
this.count.set(5);
this.count.update((v) => v + 1);
```

### Input / Output

`input()` / `output()` statt `@Input()` / `@Output()` Dekoratoren:

```typescript
// Einfacher Input
title = input<string>();

// Input mit Default
title = input("Default Title");

// Required Input
userId = input.required<number>();

// Output
itemClicked = output<string>();
// Auslösen: this.itemClicked.emit('value');
```

### DestroyRef — Subscriptions aufräumen

Wenn Supabase-Channels, Observables oder andere Subscriptions angelegt werden, immer mit
`DestroyRef` bereinigen — nie `ngOnDestroy` implementieren:

```typescript
import { inject, DestroyRef } from '@angular/core';

private readonly destroyRef = inject(DestroyRef);

ngOnInit(): void {
  const channel = this.supabase.channel('changes').subscribe();
  this.destroyRef.onDestroy(() => this.supabase.removeChannel(channel));
}
```

- `DestroyRef` funktioniert in Komponenten, Services und Direktiven gleich
- Kein `implements OnDestroy` nötig — sauberer und kompakter

### effect() — Reaktive Side Effects

`effect()` wird ausgeführt, wenn sich ein abhängiges Signal ändert — ideal für
Synchronisierungen außerhalb des Komponentenbaums:

```typescript
import { effect } from "@angular/core";

// Im Konstruktor oder als Klassenmember:
effect(() => {
  localStorage.setItem("theme", this.theme());
});

// Mit Cleanup:
effect((onCleanup) => {
  const timer = setInterval(() => this.tick(), 1000);
  onCleanup(() => clearInterval(timer));
});
```

Typische Anwendungsfälle: localStorage-Sync, Dokument-Titel setzen, externe Bibliotheken
initialisieren, Logging. Niemals für abgeleiteten State — dafür `computed()` verwenden.

### Natives Control Flow

`@if`, `@for`, `@switch` — kein `*ngIf`, `*ngFor`, `*ngSwitch`, kein `*ngTemplateOutlet`:

```html
@if (isLoggedIn()) {
<p>Willkommen, {{ user().name }}</p>
} @else {
<p>Bitte einloggen.</p>
} @for (item of items(); track item.id) {
<li>{{ item.name }}</li>
} @empty {
<li>Keine Einträge.</li>
}
```

- `@for`: immer `track` mit eindeutigem Identifier — `track item.id` bei Objekten,
  `track item` nur bei primitiven Werten
- `$index` für Positionsanzeige: `@for (item of items; track item.id; let i = $index)`
- Kein `*ngTemplateOutlet` — Template-Inhalt in beide `@if`/`@else`-Branches duplizieren
  (bei kleinen Blöcken ≤ 8 Zeilen) oder Sub-Komponente erstellen (bei größeren Blöcken)

### Bindings

```html
<!-- Property Binding (TS → HTML) -->
<img [src]="imageUrl()" [alt]="imageAlt()" />

<!-- Event Binding (HTML → TS) -->
<button (click)="handleClick()">Klick</button>

<!-- $event nur wenn der Wert tatsächlich gebraucht wird -->
<input (input)="onInput($event)" />

<!-- class-Binding statt ngClass -->
<div [class.active]="isActive()">...</div>
<div [class]="{ active: isActive(), disabled: isDisabled() }">...</div>

<!-- style-Binding statt ngStyle -->
<div [style.color]="textColor()">...</div>
```

### Data Binding Übersicht

| Syntax                  | Richtung  | Beschreibung                              |
| ----------------------- | --------- | ----------------------------------------- |
| `{{ wert }}`            | TS → HTML | Interpolation (read-only)                 |
| `[property]="ausdruck"` | TS → HTML | Property Binding                          |
| `(event)="methode()"`   | HTML → TS | Event Binding                             |
| `[(ngModel)]="wert"`    | beide     | Two-Way (Template-driven, nur wenn nötig) |

### Lifecycle

```typescript
export class ExampleComponent implements OnInit {
  data!: string[]; // ! = wird in ngOnInit gesetzt

  ngOnInit(): void {
    // Startlogik hier — NICHT im Constructor
    this.data = this.loadData();
  }
}
```

- Constructor: nur für `inject()` — keine Logik
- `ngOnInit()`: Daten laden, Initialisierungen
- Properties die erst in `ngOnInit` gesetzt werden: mit `!` (definite assignment assertion)

### Statische Bilder

```typescript
import { NgOptimizedImage } from "@angular/common";

// Im @Component.imports einbinden, dann im Template:
// <img ngSrc="hero.jpg" width="800" height="400" priority />
```

### tsconfig.json — Angular Standard-Flags

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "target": "ES2022",
    "module": "preserve"
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### Performance

- **Lazy-Loading:** Routen und Module erst laden wenn tatsächlich benötigt
- **Fetch-then-Render:** Erst vollständig laden, dann rendern — kein leeres DOM befüllen
- **Caching:** Geladene Daten zwischenspeichern, nicht mehrfach fetchen
- **OnPush** reduziert Change-Detection-Zyklen erheblich — immer verwenden
