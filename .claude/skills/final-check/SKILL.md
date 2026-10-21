---
name: final-check
description: >
  Abgabe, Abgabe-Check, final check, Projektabgabe, vor der Abgabe, submission check,
  Gesamtcheck, project check — Vollstaendiger Abgabe-Check fuer Angular-Projekte: fuehrt
  lint und build aus, analysiert den Code und erstellt einen strukturierten Bericht.
  Einmaliges Gate vor der Abgabe; fuers laufende Selbst-Review vor Commits stattdessen
  code-review-self.
---

## Vollständiger Abgabe-Check

Führe alle Schritte aktiv aus — nicht nur abhaken, sondern Werkzeuge benutzen und Befunde
konkret benennen. Am Ende einen strukturierten Bericht ausgeben.

---

### Phase 1 — Automatisierte Tool-Checks

Führe nacheinander aus und zeige Ergebnis:

1. `npm run lint` — ESLint (Zeilenlimits, Array-Typen, Naming, etc.)
2. `npm run build` — Angular Compiler + Template-Checks

Wenn ein Check fehlschlägt: Fehler vollständig zeigen, Ursache analysieren. Nicht
weitermachen bevor beide grün sind.

---

### Phase 2 — TypeScript / Angular Code-Analyse

Scanne alle `.ts`-Dateien in `src/app/` aktiv mit Grep und Read:

**Verbotene Muster suchen (Grep):**

- `as any` oder `: any` — kein `any`-Typ erlaubt
- `console\.log` — keine Debug-Ausgaben in Produktionscode
- `standalone:\s*true` — nicht explizit setzen (Angular v20+ Default)
- `@HostBinding|@HostListener` — verboten, nur `host`-Objekt im Decorator
- `\*ngIf|\*ngFor|\*ngSwitch` — verboten, nur `@if`, `@for`, `@switch`
- `ngClass|ngStyle` — verboten, nur `class`/`style`-Bindings

**Muster prüfen (Grep + Read):**

- Alle `@Component`-Dekoratoren: `ChangeDetectionStrategy.OnPush` vorhanden?
- Supabase-Files: URL/Key nur aus `environment` (suche nach hardcodierten `https://`-URLs)
- Supabase-Channels: `removeChannel` oder `DestroyRef` nach jeder `.subscribe()`?
- `environment.ts` in `.gitignore`?

---

### Phase 2b — Kommentar-Konformität

Scanne alle `.ts`-Dateien in `src/app/` aktiv mit Grep und Read. Treffer nur
innerhalb von `//`- oder `*`-präfixierten Kommentarzeilen werten.

**a) Nicht-Englische Kommentare** (Grep, case-insensitive):

```
\b(für|wenn|hier|wird|ist|sind|kann|muss|soll|sollte|aber|oder|nicht|alle|jede[rs]?|haben|werden|wurde|machen|prüfen|hole|setze|erstelle|initialisier|lade|speicher|lösche|berechne)\b
```

Pro Treffer Datei + Zeile + Kommentartext aufführen.

**b) TODO/FIXME-Marker** (Grep, case-insensitive):

```
\b(TODO|FIXME|HACK|XXX|BUG|WIP)\b
```

**c) Auskommentierter Code** (Grep — Treffer in einem dieser Muster):

```
^\s*//\s*(import|export|return|const|let|var|function|class|if|for|while|await|async)\b
^\s*//\s*[a-zA-Z_$][\w$.]*\s*[=({]
^\s*//.*[;{}]\s*$
```

**d) Fehlende JSDoc an Funktionen/Klassen/Methoden**:

- Grep nach Definitionszeilen: `^\s*(export\s+)?(async\s+)?(function|class)\s+\w+`
  sowie Klassenmethoden `^\s+(public|private|protected)?\s*\w+\s*\(.*\)\s*[:{]`.
- Für jede Definition per Read prüfen, ob die unmittelbar davorstehende,
  nicht-leere Zeile auf `*/` endet.
- Fehlt JSDoc → Datei + Zeile + Funktionsname auflisten.

**e) Kommentare in SCSS** (Grep über alle `.scss`-Dateien in `src/`):

```
^\s*//
```

In SCSS gehört kein Kommentar. Einzige Ausnahme sind die Abschnitts-Überschriften
in der Token-Datei (`// Colors`, `// Spacing scale` …) — kurze Substantiv-Label
ohne erklärenden Satz. Alles, was einen Sachverhalt erklärt, ist ein Befund:
Die Begründung gehört in die Commit-Message, nicht in die Datei.

Befunde dieser Phase erscheinen im Bericht (Phase 6) unter eigener Überschrift
**"Kommentar-Konformität"** mit den fünf Unter-Kategorien.

---

### Phase 3 — SCSS-Analyse

Scanne alle `.scss`-Dateien in `src/` aktiv:

**Verbotene Muster (Grep):**

- `@import` — muss `@use` sein
- `html\s*{[^}]*overflow` oder `body\s*{[^}]*overflow` — `overflow` nicht auf html/body
- Hardcodierte Media Queries (`@media`) ohne Mixin — nur `respond()`-Mixin erlaubt
- `font-size:\s*[0-9]+px` kleiner als 16px

**Namespacing prüfen:**

- Jedes `@use` hat einen Alias → wird dieser Alias auch so aufgerufen?

---

### Phase 4 — HTML-Template-Analyse

Scanne alle `.html`-Dateien in `src/app/`:

**Verbotene Muster (Grep):**

- `\*ngIf|\*ngFor` — nur nativer Control Flow erlaubt
- `\[ngClass\]|\[ngStyle\]` — verboten
- Inline-Ternär in `@for`/`@if` (komplexe Ausdrücke gehören in `computed()`)
- `<img` ohne `alt`-Attribut

**Größe prüfen:**

- Template-Dateien über 100 Zeilen → Namen und Zeilenzahl aufführen

---

### Phase 5 — Manuelle Browser-Checks (Anleitung ausgeben)

Diese Punkte kann kein Tool prüfen. Gib dem Nutzer eine klare Checkliste:

```
Browser-Checks (selbst durchführen):
- [ ] Route "/"           → Leerer Zustand: Meldung bei 0 Surveys?
- [ ] Route "/"           → Lade-Zustand: Loading-Feedback sichtbar?
- [ ] Route "/survey/:id" → Fehler-Zustand: Ungültige ID → Fehler sichtbar?
- [ ] Route "/survey/:id" → Abgelaufene Survey: Als inaktiv markiert?
- [ ] Route "/create"     → Formular-Validierung: Fehler sichtbar nach Submit?
- [ ] Responsive:         → Layout bei 375px, 768px, 1280px korrekt?
- [ ] Accessibility:      → Tab-Navigation durch alle interaktiven Elemente möglich?
- [ ] Layout Shifts:      → DevTools → Performance → keine CLS-Ereignisse?
```

---

### Phase 6 — Abschlussbericht

Gib am Ende einen strukturierten Bericht aus:

```
## Abgabe-Check Ergebnis

### Automatisiert — BESTANDEN / FEHLGESCHLAGEN
- lint:  ✅ / ❌
- build: ✅ / ❌

### Code-Analyse — Befunde
[Jeden gefundenen Verstoß einzeln mit Datei + Zeile nennen]
[Wenn nichts gefunden: "Keine Verstöße gefunden"]

### Kommentar-Konformität — Befunde
- Nicht-Englisch:    [Datei:Zeile — Kommentartext]
- TODO/FIXME:        [Datei:Zeile — Kommentartext]
- Toter Code:        [Datei:Zeile — Kommentartext]
- Fehlende JSDoc:    [Datei:Zeile — Funktionsname]
- SCSS-Kommentare:   [Datei:Zeile — Kommentartext]
[Wenn keine: "Alle Kommentare konform"]

### Manuelle Checks ausstehend
[Browsercheckliste aus Phase 5 ausgeben]
```

Wenn alle automatisierten Checks grün und keine Verstöße gefunden wurden:
"Projekt ist abgabereif — manuelle Browser-Checks noch ausstehend."

---

### Phase 7 — Cleanup (nur bei vollständig grünem Lauf)

**Bedingung:** `lint` ✅ UND `build` ✅ UND keine Verstöße in Code-Analyse
(Phase 2/3/4) UND keine Verstöße in Kommentar-Konformität (Phase 2b).

**Wenn ALLE Bedingungen erfüllt:**

- Inhalt von `.playwright-mcp/` im Projekt-Root entfernen (Screenshots + Logs):

```
Remove-Item ".playwright-mcp\*" -Force -Recurse
```

- Im Abschlussbericht ergänzen: `Playwright-Artefakte aus .playwright-mcp/ entfernt (N Dateien).`

**Wenn auch nur ein Befund vorliegt:**

- Kein Cleanup. Bericht ergänzen: `Cleanup übersprungen — erst Befunde fixen.`
