# Einstieg für Yannic

Hallo Yannic, willkommen im DABubble-Repo. Diese Seite fasst zusammen, wie weit das Projekt ist,
wer was übernimmt und wie wir zusammenarbeiten. Wir sind gleichberechtigt: beide arbeiten direkt
auf `main`, beide nach denselben Regeln.

## Stand am 21.10.2026

Fertig:

- **Angular 22-Grundgerüst** mit Routing und Strict Mode. Die App ist noch leer; jeder Bereich hat
  seine Ordner unter `src/app/features/` und eine eigene Routen-Datei.
- **Anforderungen:** die DA-Checkliste in `docs/DA_Checkliste/`.
- **Design:** die komplette Figma-Spec in `docs/Figma/spec.md` (Farben, Schriften, Abstände,
  Komponenten mit Zuständen, Hinweise des Design-Teams, Abgleich mit der Checkliste), dazu
  `components.md` und `MANIFEST.md`. Alle Assets liegen schon in `public/` (Icons, Logos, Avatare,
  Emojis, Schriften), Referenzbilder aller 97 Screens in `docs/Figma/reference/`.
  **Einen Figma-Zugang brauchst du nicht** – die Spec ist die Quelle.
- **Kontrollen:** ESLint (höchstens 14 Zeilen pro Funktion, 400 pro Datei, camelCase,
  Barrierefreiheit), Prettier, CI bei jedem Push, Deploy-Workflow auf den DA-Webspace
  `dabubble-3299.developerakademie.net` (nur von Hand).
- **Regeln für Claude Code:** `CLAUDE.md` gilt für uns beide gleich. Dazu liegen die Skills
  `code-review-self`, `final-check`, `angular`, `angular-forms`, `scss-component`,
  `typescript-standards` unter `.claude/skills/`.

Noch nicht da: Firebase, Datenmodell, Design-Tokens, Shared-UI, die ersten Screens.

## Aufteilung

| Bereich | Person | Inhalt                                                                                           |
| ------- | ------ | ------------------------------------------------------------------------------------------------ |
| A       | Thomas | Login, Registrierung, Avatar, Passwort, Profil, Workspace-Rahmen mit Sidebar, Channels verwalten |
| B       | Yannic | Nachrichten in Channels und DMs, Emojis und Reaktionen, Threads, „Neue Nachricht“, Suche         |

Details, Datei-Besitz und Schnittstellen: `docs/arbeitsteilung.md`.

**Phase 0 für dich:** Firebase-Projekt (Authentication, Firestore), Datenmodell in
`src/app/core/models/`, Gerüst der Security-Rules. Thomas macht parallel Design-Tokens, Shared-UI
und den Workspace-Rahmen. Die Schnittstellen zwischen uns (z. B. `AuthService.currentUser`,
Routen für Channel-, DM- und Thread-Ansicht) stimmen wir bis Ende Phase 0 ab.

## Erste Schritte

1. Die GitHub-Einladung annehmen: <https://github.com/ttoebbe/dabubble/invitations>
2. Repo klonen und Abhängigkeiten installieren:
   `git clone https://github.com/ttoebbe/dabubble.git`, dann im Ordner `npm install`.
3. Prüfen, dass `git config user.name` den Namen **Yannic** enthält. Daran erkennt Claude Code
   deinen Bereich; sonst fragt es erst nach.
4. Firebase-Konfiguration anlegen: `src/environments/environment.example.ts` nach
   `src/environments/environment.ts` kopieren und die Web-Konfiguration eintragen, die du von
   Thomas bekommst. Die Datei ist in `.gitignore` und kommt nie ins Repo; die CI baut mit dem
   Secret `FIREBASE_CONFIG`.
5. `npm start` und im Browser `http://localhost:4200/` öffnen.
6. Claude Code im Projektordner starten. Fragt es nach dem MCP-Server `angular-cli`
   (`.mcp.json`), kannst du ihn erlauben – er liefert die Angular-Doku.
7. Lesen: `CLAUDE.md`, `docs/arbeitsteilung.md`, `docs/todo.md` und Abschnitt 6 der Spec.

## So arbeiten wir zusammen

- Beide pushen direkt auf `main`. Vor Arbeitsbeginn und vor jedem Push `git pull --rebase`,
  nie Force-Push. Kleine Commits, oft pushen, mindestens ein Commit pro Arbeitssitzung (DA).
- Jeder ändert nur seinen Bereich. Brauchst du etwas im Bereich von Thomas: GitHub-Issue mit Label
  `bereich-a` (umgekehrt `bereich-b`). Gemeinsame Dateien (`core/models/`, `shared/`,
  `package.json`, `CLAUDE.md` …) nur nach kurzer Absprache, als eigener Commit.
- Vor jedem Commit den Qualitäts-Check aus `CLAUDE.md`; `npm run format:check`, `npm run lint`
  und `npm run build` müssen fehlerfrei laufen. Wird die CI auf `main` rot, behebt das, wer
  gepusht hat.
- Schrift mindestens 16 px (Zeitstempel, Fehlermeldungen 14 px), Touch-Targets 44 px – diese
  Regel geht vor Figma.
- Ein Deploy ist eine gemeinsame Entscheidung. Beide können ihn unter
  GitHub → Actions → Deploy starten; die Zugangsdaten liegen schon als Secrets im Repo.
- Größere Umbauten gern auf einem Branch (`feature/b-threads`) und per PR mit der PR-Vorlage.

## Gemeinsam zu entscheiden

- Zuordnung der Punkte, die nur in Figma stehen (`docs/arbeitsteilung.md`).

Entschieden: Formulare mit Signal Forms (22.10.2026).

## Was Bereich A bereitstellt (Stand 22.10.2026)

| Was                                                 | Wo                                               |
| --------------------------------------------------- | ------------------------------------------------ |
| Angemeldete Person `currentUser`, `uid`             | `AuthService` in `core/services/auth.service.ts` |
| Alle Personen `users` (Name, Avatar, Online-Status) | `UserService` in `core/services/user.service.ts` |
| Eigene Channels `channels`, alle `allChannels`      | `ChannelService`                                 |
| Profil einer Person öffnen                          | `ProfileViewer.show(uid)` in `features/profile/` |
| Channel bearbeiten, Mitglieder, Leute hinzufügen    | `ChannelDialogs.open(channelId, kind)`           |
| Workspace-Rahmen mit Outlets für Chat und `thread`  | `features/workspace/workspace.routes.ts`         |

Datenmodell und Firestore-Regeln stehen als Vorschlag in ttoebbe/dabubble#1.

Das Repo liegt in Thomas' GitHub-Konto. Repo-Einstellungen (Secrets, Einladungen) kann dort nur
der Besitzer ändern; brauchst du dort etwas, sag Thomas Bescheid.
