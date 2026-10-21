# CLAUDE.md – DABubble

Projektkontext und Arbeitsregeln für Claude Code. Gilt für Thomas und Yannic, liegt im Repo und ist für beide gleich.
Angular-Best-Practices stehen zusätzlich in `.claude/CLAUDE.md`; bei Widerspruch gilt diese Datei.

## Projekt

DABubble ist ein Team-Messenger im Stil von Slack. Gruppenprojekt der Developer Akademie mit zwei Personen.
Stack: Angular 22 (Standalone Components, Signals), TypeScript strict, SCSS, Firebase Authentication, Cloud Firestore.

## Zuerst: Wer arbeitet?

Vor der ersten Änderung in einer Sitzung `git config user.name` lesen:

| Name enthält | Person | Bereich                               |
| ------------ | ------ | ------------------------------------- |
| `Thomas`     | Thomas | A – Konto, Workspace-Rahmen, Channels |
| `Yannic`     | Yannic | B – Nachrichten, Threads, Suche       |

Passt keiner der Namen: nachfragen, bevor eine Datei geändert wird.
Welche Ordner und Dateien zu welchem Bereich gehören, steht in `docs/arbeitsteilung.md`. Diese Datei vor jeder Aufgabe lesen.

## Quellen

| Was                | Wo                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Anforderungen (DA) | `docs/DA_Checkliste/DaBubble Checkliste.md`                                                                                                    |
| Design (SOLL)      | `docs/Figma/spec.md`, `docs/Figma/components.md`, Assets laut `docs/Figma/MANIFEST.md` in `public/`, Referenzbilder in `docs/Figma/reference/` |
| Arbeitsteilung     | `docs/arbeitsteilung.md`                                                                                                                       |
| Offene Aufgaben    | `docs/todo.md`                                                                                                                                 |

## Harte Regeln

1. **Nur im eigenen Bereich ändern.** Wird etwas im fremden Bereich gebraucht: GitHub-Issue mit Label `bereich-a` oder `bereich-b` anlegen, nicht selbst ändern.
2. **Gemeinsame Dateien** (`core/models/`, `shared/`, `app.routes.ts`, `app.config.ts`, `package.json`, `angular.json`, `eslint.config.js`, `.github/`, `CLAUDE.md`, `README.md`, `docs/arbeitsteilung.md`) nur in einem eigenen kleinen PR ändern und das im PR-Text ankündigen. Label `shared`.
3. **Keine Anforderungen erfinden.** Was weder in der Checkliste noch in der Spec steht: nachfragen.
4. **Design-Werte nur aus `docs/Figma/spec.md`** bzw. `src/styles/`. Nichts aus Screenshots schätzen. Figma nicht selbst abfragen, der Zugang ist begrenzt. Fehlt etwas in der Spec, Thomas fragen.
5. **Schrift mindestens 16 px, Kleingedrucktes (Zeitstempel, Fehlermeldungen) 14 px, Touch-Targets mindestens 44 × 44 px.** Diese Regel schlägt Figma, wo das Design kleiner ist (Spec 6.5). Abweichungen vom Design im Commit begründen.
6. **Datenmodell nur nach Absprache.** Änderungen an `core/models/` oder an Firestore-Collections erst im PR vorschlagen, Review der anderen Person abwarten.
7. **Nie direkt auf `main` committen oder pushen.** Feature-Branch mit Bereichskürzel (`feature/a-login`, `feature/b-threads`), Merge nur per PR mit Review der anderen Person. Nie ungefragt pushen.
8. **Keine `alert()`**, keine HTML5-Standard-Fehlermeldungen. Fehler direkt am Feld anzeigen.
9. **JSDoc für jede Funktion, Klasse und Datei-Export** (Englisch).

## Was nie ins Repo darf

`src/environments/environment.ts` und `environment.prod.ts` (Firebase-Konfiguration), `.env`-Dateien,
Service-Account-JSONs, `.figma-token`, `.figma-cache/`, Passwörter und Zugangsdaten des Webspace,
`tools/layout-check/`. Vor jedem Commit mit `git status` prüfen, dass nichts davon gestaged ist.

## Code-Regeln

Aus der DA-Checkliste (ESLint prüft die Zeilenlimits und die Namen automatisch):

- TypeScript Strict Mode bleibt aktiv.
- Eine Aufgabe pro Funktion, höchstens 14 Zeilen.
- Höchstens 400 Zeilen pro Datei, höchstens 100 Zeilen pro HTML-Template (sonst Sub-Komponenten).
- Namen kurz und beschreibend, camelCase, Variablen und Funktionen beginnen klein, keine Kollision mit reservierten Wörtern.
- 1–2 Leerzeilen zwischen Funktionen.
- Ordner für Komponenten, Bilder (`public/img/`), `shared/` und `shared/pipes/`.
- Buttons mit `cursor: pointer` und den Zuständen enabled, disabled, hover. Inputs und Buttons ohne Standard-Border.
- Responsiv bis 320 px, keine horizontale Scrollleiste.
- Keine Fehler in der Konsole.

Team-Absprachen:

- Code, Variablen, Commits: Englisch. Doku in `docs/`: Deutsch. UI-Texte wörtlich aus der Spec.
- Standalone Components, `inject()` statt Konstruktor-Injection, Signals für State.
- Control Flow mit `@if`, `@for` (immer mit `track`), `@switch`.
- Firestore-Zugriffe nur in Services unter `core/services/`, nie in Komponenten.
- Subscriptions beenden (`takeUntilDestroyed` oder `toSignal`).
- SCSS nach BEM, Werte aus `src/styles/`, keine Hex-Werte in Komponenten.
- `overflow` nie auf `html` oder `body`; keine Layout-Shifts (Platz für Fehlermeldungen und Hover-Zustände reservieren).

## Befehle

```bash
npm install
npm start
npm run build
npm run lint
npm run format
npm run format:check
```

## Qualitäts-Check vor jedem Commit

Punkt für Punkt durchgehen; derselbe Check steht als Liste in der PR-Vorlage:

1. Skill `code-review-self` ausführen.
2. `npm run format:check`, `npm run lint` und `npm run build` laufen fehlerfrei.
3. Keine Fehler in der Browser-Konsole, auch im Inkognito-Modus.
4. Werte stammen aus `docs/Figma/spec.md`; Abweichungen sind im Commit begründet.
5. Schrift ≥ 16 px (Kleingedrucktes 14 px), Touch-Targets ≥ 44 px.
6. Geprüft bei 320, 430, 768, 1024, 1440 und 1920 px, keine horizontale Scrollleiste.
7. Leere, ungültige und fehlerhafte Eingaben zeigen eine konkrete Meldung direkt am Feld.
8. Jeder UI-Zustand (leer, laden, Fehler) hat Testdaten.
9. Jedes `<img>` bewusst eingeordnet: dekorativ `alt=""`, bedeutungstragend mit beschreibendem `alt`.
10. Keine Secrets (siehe oben), kein `console.log`, kein auskommentierter Code.
11. Nur Dateien des eigenen Bereichs oder angekündigte gemeinsame Dateien geändert.

Vor der Abgabe zusätzlich der Skill `final-check` und alle offenen Punkte aus `docs/todo.md`.

## Commits

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`), Englisch, eine Zeile, höchstens ca. 50 Zeichen.
- Autor ist die Person, die arbeitet. **Kein** `Co-Authored-By: Claude`, kein „Generated with“-Hinweis.
- Jede Person committet in jeder Arbeitssitzung mindestens einmal (DA-Checkliste). Ein Commit = eine nachvollziehbare Änderung.
- Nie ungefragt pushen.

## CI, Deploy, Layout-Check

- **CI** (`.github/workflows/ci.yml`) läuft bei jedem Push und PR: Format-Check, Lint, Build. Ein PR wird nur mit grüner CI gemergt.
- **Deploy** (`.github/workflows/deploy.yml`) nur von Hand (`workflow_dispatch`), nur von `main`, nur nach Absprache im Team – ein Deploy ist eine Entscheidung, keine Nebenwirkung eines Pushes. Er baut den gewählten Commit und spiegelt nur `dist/dabubble/browser/` per SFTP oder FTPS auf den DA-Webspace. Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PASSWORD`, `DEPLOY_REMOTE_DIR`; Variable `DEPLOY_PROTOCOL` (`sftp` oder `ftps`).
- **Layout-Check** (geplant, `docs/todo.md`): Checker im privaten Repo `ttoebbe/dabubble-layout-check`, lokal nach `tools/layout-check/` geklont (gitignored), im Repo nur der Workflow mit `workflow_dispatch`. Start nur von Hand, ein roter Check blockiert nichts.

## Skills im Repo

`.claude/skills/` enthält `code-review-self`, `final-check`, `angular`, `angular-forms`, `scss-component`,
`typescript-standards` und `figma-extract`, damit beide Claude-Sitzungen nach denselben Regeln arbeiten.
`figma-extract` braucht Figma-Zugang und nutzt nur Thomas. Die Skills werden vor der Abgabe entfernt (`docs/todo.md`).

## Ablauf je Aufgabe

1. Person und Bereich feststellen (siehe oben), `docs/arbeitsteilung.md` lesen.
2. `main` holen, Branch `feature/<a|b>-<thema>` anlegen.
3. Nur Dateien des eigenen Bereichs ändern.
4. Qualitäts-Check (oben) durchgehen.
5. Commit nach den Commit-Regeln. PR gegen `main` mit der PR-Vorlage, Review durch die andere Person.
6. Kurz zusammenfassen: was geändert, welche Dateien, was offen ist.
