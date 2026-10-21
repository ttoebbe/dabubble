---
name: code-review-self
description: >
  self-review, vor dem Commit, vor dem Push, before commit, before push, PR vorbereiten,
  code review, eigenen Code pruefen — Selbst-Review-Checkliste am eigenen Code vor jedem
  Commit oder Push. Laufende Pruefung waehrend der Entwicklung; fuer den einmaligen
  Gesamt-Check zur Projektabgabe stattdessen final-check.
---

## Selbst-Review vor dem Push

Gehe diese Checkliste durch, bevor du committest oder einen PR öffnest.

### Lesbarkeit & Naming

- [ ] Funktionsnamen beschreiben, **was** die Funktion tut (Verb + Substantiv)
- [ ] Keine kryptischen Abkürzungen (`usr`, `tmp`, `cb` → `user`, `template`, `callback`)
- [ ] Kommentare erklären das **Warum**, nicht das **Was** – und nur dort, wo das Warum nicht schon aus Namen und Struktur hervorgeht
- [ ] **Kein Kommentar in SCSS** (Ausnahme: Abschnitts-Überschriften in der Token-Datei)
- [ ] Keine toten Code-Abschnitte (auskommentierte Blöcke, unused imports)
- [ ] Magic Numbers als benannte Konstanten extrahiert

### Funktionen & Struktur

- [ ] Jede Funktion hat **eine Aufgabe** (Single Responsibility)
- [ ] Max. ~14 Zeilen Funktionskörper (laut Projektstandard)
- [ ] Keine doppelten Code-Blöcke (DRY — aber nicht über-abstrahiert)
- [ ] Tiefe Verschachtelung aufgelöst (Early Return statt else-Kaskaden)

### TypeScript

- [ ] Kein `any` — Union Types oder `unknown` mit Guard
- [ ] Alle Funktionsparameter und Rückgabewerte typisiert
- [ ] `interface` für Objektstrukturen, nicht Inline-Types

### Edge Cases

- [ ] Was passiert bei leerem Array / null / undefined?
- [ ] Was passiert bei unerwartetem API-Response?
- [ ] Fehlerfall explizit behandelt (try/catch oder Error Boundary)?

### Tests

- [ ] Existiert ein Test für den Happy Path?
- [ ] Existiert ein Test für den wichtigsten Fehlerfall?
- [ ] Kein Test durch Mocks ausgehebelt (echte Logik wird getestet)

### Sicherheit (Basics)

- [ ] User-Input wird **nicht** direkt in SQL/HTML/Shell eingefügt
- [ ] Sensitive Daten (Tokens, Passwörter) nicht geloggt
- [ ] `console.log`-Debugging-Ausgaben entfernt

### Doku & Commit

- [ ] JSDoc für öffentliche Funktionen und Klassen vorhanden
- [ ] CLAUDE.md-Änderungen committed wenn Projektregeln erweitert wurden
- [ ] Commit-Message folgt Conventional Commits (`feat:`, `fix:`, usw.)
