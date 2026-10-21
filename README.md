# DABubble

Team-Messenger im Stil von Slack. Gruppenprojekt an der Developer Akademie.

> **Status:** Phase 0 – Angular-Projekt, Regeln, CI und Deploy-Workflow stehen. Offene Punkte: `docs/todo.md`.

## Team

| Person | Bereich                               |
| ------ | ------------------------------------- |
| Thomas | A – Konto, Workspace-Rahmen, Channels |
| Yannic | B – Nachrichten, Threads, Suche       |

Details: `docs/arbeitsteilung.md`.

## Tech-Stack

Angular 22 (Standalone Components, Signals), TypeScript strict, SCSS, Firebase Authentication, Cloud Firestore.
ESLint (angular-eslint) und Prettier prüfen den Code, GitHub Actions baut jeden Push.

## Projekt starten

```bash
npm install
npm start
```

Danach im Browser `http://localhost:4200/` öffnen.

| Befehl                 | Wirkung                                        |
| ---------------------- | ---------------------------------------------- |
| `npm start`            | Dev-Server                                     |
| `npm run build`        | Produktions-Build nach `dist/dabubble/`        |
| `npm run lint`         | ESLint inkl. Zeilenlimits und Barrierefreiheit |
| `npm run format`       | Prettier formatiert `src/`                     |
| `npm run format:check` | Prettier prüft `src/` (wie die CI)             |

## Dokumentation

| Datei                                       | Inhalt                                                        |
| ------------------------------------------- | ------------------------------------------------------------- |
| `docs/DA_Checkliste/DaBubble Checkliste.md` | Anforderungen und Abnahmekriterien der DA                     |
| `docs/Figma/spec.md`                        | Design-Spec aus Figma, dazu `components.md` und `MANIFEST.md` |
| `docs/arbeitsteilung.md`                    | Wer macht was, Datei-Besitz, Schnittstellen, Git-Regeln       |
| `docs/einstieg.md`                          | Einstieg ins Projekt: Stand, Aufteilung, Zusammenarbeit       |
| `docs/todo.md`                              | Offene Aufgaben außerhalb der Arbeitspakete                   |
| `CLAUDE.md`                                 | Regeln für Claude Code, für beide gleich                      |
