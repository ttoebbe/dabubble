---
name: scss-component
description: >
  SCSS, Komponente, component, BEM, neue Komponente anlegen, new component, scss erstellen,
  BEM-Struktur — Erstellt SCSS/BEM-Komponente mit Vorlage und HTML-Template-Funktion
---

Erstelle eine neue SCSS/BEM-Komponente für das aktuelle Projekt.

## Deine Aufgabe

1. Frage zuerst nach dem **Komponentennamen** (falls nicht als Argument übergeben)
2. Prüfe die bestehende Projektstruktur (`src/styles/components/`)
3. Erstelle `src/styles/components/_<name>.scss`
4. Binde die Komponente in `style.scss` ein

## Vorlage: `_<name>.scss`

```scss
@use "../abstracts/variables" as vars;
@use "../abstracts/mixins" as mix;

// Block
.<name > {
  // Block-Styles

  // Element
  &__title {
    font-size: var(--font-lg);
  }

  &__body {
    padding: var(--space-2);
  }

  // Modifier
  &--highlighted {
    border-left: 4px solid var(--color-primary);
  }
}
```

## Vorlage: HTML-Template-Funktion (`<name>.ts`)

```ts
/**
 * Renders the <Name> component as an HTML string.
 * @param title - The component title
 * @param body  - The component body text
 */
export function render<Name>Template(title: string, body: string): string {
  return `
    <article class="<name>">
      <h2 class="<name>__title">${title}</h2>
      <p class="<name>__body">${body}</p>
    </article>
  `;
}
```

## Regeln

- BEM strikt einhalten: `.block__element--modifier`
- Max. 3 Verschachtelungsebenen
- Nur `@use` – kein `@import`
- Namespace-Aliasse zu `vars` und `mix` konsistent halten
- Keine hartcodierten Farben oder px-Werte – CSS Custom Properties oder `px-to-rem()` nutzen
- Bestehende Mixins aus `abstracts/` nutzen, keine neuen einführen wenn vorhanden

## Abschluss

Zeige:

1. Den erstellten SCSS-Code
2. Den `@use`-Eintrag für `style.scss`
3. Optional: passende HTML-Template-Funktion

---

## SCSS Standards (gelten projektübergreifend)

### Imports

```scss
// GUT
@use "../abstracts/variables" as vars;
@use "../abstracts/mixins" as mix;
@forward "components/button";

// SCHLECHT — veraltet, nicht verwenden
@import "../abstracts/variables";
```

- **Ausschließlich** `@use` und `@forward` — kein `@import`
- Partials beginnen mit `_` (z. B. `_colors.scss`, `_button.scss`)
- Namespace-Aliasse stabil halten: Alias in `@use` muss exakt mit `@include` übereinstimmen

### Arithmetik

```scss
// GUT
$half: math.div($value, 2);

// SCHLECHT — Slash-Division ist veraltet
$half: $value / 2;
```

`math.div` statt Slash-Division: `@use 'sass:math'` erforderlich.

### BEM

```scss
.product-card {           // Block
  &__title { ... }        // Element
  &__image { ... }        // Element
  &--featured { ... }     // Modifier (am Block)
  &__title--truncated {}  // Modifier (am Element, selten)
}
```

- Verschachtelung max. **3 Ebenen** (Block → Element → Modifier/State)
- Kein tieferes Nesting — lieber neue Klasse als 4. Ebene

### Layout

```scss
// SCHLECHT — overflow: hidden als versteckter Layout-Fix
.container {
  overflow: hidden; // kaschiert float-collapse oder margin-collapse
}

// GUT — Ursache beheben (z. B. Clearfix, Grid/Flex, margin richtig setzen)
.container {
  display: flow-root; // moderner Clearfix
}

// ERLAUBT — semantisches Clipping
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden; // OK: bewusstes Clipping für Bild
  img {
    object-fit: cover;
  }
}
```

### Bilder

```scss
// Responsive (fluid)
.hero-image {
  width: 100%;
  max-width: 100%;
  height: auto;
}

// Feste Container mit object-fit
.thumbnail {
  width: 200px;
  height: 150px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```
