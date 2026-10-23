# Arbeitsteilung

Gilt für Thomas, Yannic und ihre Claude-Code-Sitzungen. Ziel: Jede Datei hat genau eine verantwortliche Person,
damit sich zwei parallel arbeitende Sitzungen nicht gegenseitig überschreiben.
Änderungen an dieser Datei nur nach Absprache mit der anderen Person.

## Team

| Person | Bereich                               | Kürzel |
| ------ | ------------------------------------- | ------ |
| Thomas | A – Konto, Workspace-Rahmen, Channels | `a`    |
| Yannic | B – Nachrichten, Threads, Suche       | `b`    |

## Quellen

| Was                | Wo                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Anforderungen (DA) | `docs/DA_Checkliste/DaBubble Checkliste.md` (Fassung 2024)                                           |
| Design (SOLL)      | `docs/Figma/spec.md`, Assets in `public/`, Referenzbilder aller 97 Frames in `docs/Figma/reference/` |

Die Spec wird einmal aus Thomas' Figma-Kopie erzeugt. Danach arbeiten beide nur mit der Spec, niemand braucht einen eigenen Figma-Zugang.

## Bereiche nach Checkliste

### Bereich A – Thomas

| Checkliste           | Inhalt                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Konto US1            | Registrierung mit Avatar-Auswahl; optional Google-Konto und Bestätigungs-E-Mail                                       |
| Konto US2            | Login                                                                                                                 |
| Konto US3            | Passwort vergessen und zurücksetzen                                                                                   |
| Konto US4            | Profil bearbeiten: Name und Avatar                                                                                    |
| Konto US5            | Workspace-Rahmen: Header, Sidebar mit Channels und DMs, ein- und ausklappen, mobile Ansichten, Navigation in den Chat |
| Konto US6 (optional) | Online-Status                                                                                                         |
| Channels US1–4       | Channel anlegen, Mitglieder einladen und hinzufügen, verlassen, bearbeiten, Namensprüfung                             |

### Bereich B – Yannic

| Checkliste          | Inhalt                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Channels US1 (Teil) | Nachrichten im Channel senden und empfangen                                                      |
| Schreiben US1       | Direktnachrichten, Fokus beim Chatwechsel ins Eingabefeld                                        |
| Schreiben US2       | Reaktionen: zwei zuletzt genutzte Emojis, Grenzen 20 bzw. 7 plus „+ x weitere“, wer reagiert hat |
| Schreiben US3       | Emojis in Nachrichten, Zähler                                                                    |
| Schreiben US4       | „Neue Nachricht“ mit `#` und `@` im Adressfeld                                                   |
| Schreiben US5       | Threads in Channels und DMs, `#` und `@` im Eingabefeld                                          |
| Schreiben US6       | Suche in Nachrichten, `#`- und `@`-Dropdown, Live-Filter                                         |

### Nur in Figma, nicht in der Checkliste

Quelle: `docs/Figma/spec.md`, Abschnitt 6.3. Zuordnung als Vorschlag, im Team bestätigen.

| Inhalt                                                            | Bereich |
| ----------------------------------------------------------------- | ------- |
| Gast-Login („Gäste-Login“ auf der Login-Seite)                    | A       |
| Intro mit Logo-Animation                                          | A       |
| Impressum und Datenschutz, Links im Footer der Auth-Seiten        | A       |
| Datenschutz-Checkbox bei der Registrierung                        | A       |
| Erfolgsmeldungen nach Registrierung, Mail-Versand, Passwort-Reset | A       |
| Logout im Profilmenü                                              | A       |
| Mitglieder-Dialog des Channels                                    | A       |
| Mitglieder-Avatare und Zähler im Channel-Kopf                     | B       |
| Eigene Nachricht bearbeiten                                       | B       |
| Datumstrenner im Chat                                             | B       |

## Ablauf

| Phase | Inhalt                                   | Thomas (A)                                                             | Yannic (B)                                           |
| ----- | ---------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| 0     | Fundament                                | Repo, Figma-Spec und Assets, Angular-Projekt, Design-Tokens, Shared-UI | Firebase-Projekt, Datenmodell, Security-Rules-Gerüst |
| 1     | Kernfunktionen                           | Login, Registrierung, Avatar, Passwort, Workspace-Rahmen mit Sidebar   | Chat-Ansicht, Senden und Empfangen, DMs, Emojis      |
| 2     | Erweiterungen                            | Profil, Channel-Verwaltung, Online-Status (optional)                   | Reaktionen, Threads, „Neue Nachricht“, Suche         |
| 3     | Abnahme gegen die Checkliste (gemeinsam) | Responsive bis 320 px, Inkognito, Konsole, Clean Code, GitHub-Regeln   | wie links                                            |

Reihenfolge in Phase 0: Repo und Angular-Projekt stehen (21.10.2026), ab jetzt arbeiten beide parallel.
Bis eine Schnittstelle steht, arbeitet die andere Person gegen einen Platzhalter mit derselben Signatur.

## Dateien und Ordner

| Pfad                                                                                          | Besitz    | Regel                                                                                            |
| --------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `src/app/features/auth/`                                                                      | A         |                                                                                                  |
| `src/app/features/workspace/` (Layout, Header, Sidebar)                                       | A         |                                                                                                  |
| `src/app/features/profile/`                                                                   | A         |                                                                                                  |
| `src/app/features/channels/`                                                                  | A         |                                                                                                  |
| `src/app/features/legal/`                                                                     | A         |                                                                                                  |
| `src/app/features/chat/` (Channel- und DM-Ansicht, Eingabe, Reaktionen)                       | B         |                                                                                                  |
| `src/app/features/thread/`                                                                    | B         |                                                                                                  |
| `src/app/features/new-message/`                                                               | B         |                                                                                                  |
| `src/app/features/search/`                                                                    | B         |                                                                                                  |
| `src/app/core/services/` auth, user, presence, channel                                        | A         |                                                                                                  |
| `src/app/core/services/` message, direct-chat, message-search                                 | B         |                                                                                                  |
| `src/app/core/models/`                                                                        | gemeinsam | nur nach Absprache, eigener Commit                                                               |
| `src/app/shared/`                                                                             | A legt an | Erweiterungen als eigener Commit, vorher ankündigen                                              |
| `src/styles/`                                                                                 | A         |                                                                                                  |
| `public/` (Bilder, Icons, Schriften aus der Spec)                                             | A         |                                                                                                  |
| `docs/Figma/`                                                                                 | A         |                                                                                                  |
| `firestore.rules`                                                                             | B         | A meldet Bedarf per Issue                                                                        |
| `src/app/app.routes.ts`                                                                       | gemeinsam | bindet nur `auth.routes.ts` (A) und `chat.routes.ts` (B) ein; eigene Routen in der eigenen Datei |
| `package.json`, `angular.json`, `src/app/app.config.ts`, `eslint.config.js`, `tsconfig*.json` | gemeinsam | eigener Commit, vorher absprechen                                                                |
| `.github/` (CI, Deploy, PR-Vorlage), `.claude/`                                               | gemeinsam | eigener Commit, vorher absprechen                                                                |
| `CLAUDE.md`, `README.md`, `docs/arbeitsteilung.md`, `docs/todo.md`                            | gemeinsam | nur nach Absprache                                                                               |
| `docs/stand/a.md`                                                                             | A         | Arbeitsstand für B, bei Feierabend überschreiben                                                 |
| `docs/stand/b.md`                                                                             | B         | Arbeitsstand für A, bei Feierabend überschreiben                                                 |

## Schnittstellen

| Von → An | Was                                                           | Bis          | Stand 23.10.2026                                         |
| -------- | ------------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| A → B    | `AuthService.currentUser` als Signal                          | Ende Phase 0 | steht                                                    |
| A → B    | `UserService.users` als Signal (Namen, Avatare)               | Ende Phase 0 | steht                                                    |
| A → B    | `ChannelService.channels` als Signal (eigene Channels)        | Ende Phase 0 | steht                                                    |
| B → A    | Routen für Channel-, DM- und Thread-Ansicht                   | Ende Phase 0 | steht: `CHAT_ROUTES`, Links in `workspace/chat-links.ts` |
| A → B    | Workspace-Layout mit Platz für Chat, Thread und Suchfeld      | Phase 1      | steht                                                    |
| A → B    | Profil-Dialog per `uid` öffnen (Klick auf Autor oder Mention) | Phase 1      | steht: `ProfileViewer.show(uid)`                         |
| A → B    | Channel-Dialoge aus dem Channel-Kopf öffnen                   | Phase 1      | steht: `ChannelDialogs.open(…)`                          |
| B → A    | Route zur DM mit einer Person (Button im Profil)              | Phase 1      | steht: `/workspace/dm/:uid`                              |
| B → A    | Such-Komponente für den Header                                | Phase 2      | steht: `<app-workspace-search>`, mobil im Menü           |

**Hash-URLs (seit 22.10.2026, `app.config.ts`):** Der DA-Webspace wertet `.htaccess` nicht aus, deshalb steht die Route hinter `#`, z. B. `/#/workspace`. In `routerLink` und `router.navigate` ändert sich nichts.

**Routen (Stand 23.10.2026, umgesetzt):** `CHAT_ROUTES` aus `features/chat/chat.routes.ts` hängen als
Kinder unter `/workspace`. Im primären Outlet stehen `channel/:channelId`, `dm/:uid` (uid der anderen Person)
und `new-message`, im Outlet `thread` steht `thread/:kind/:conversationId/:messageId` (`kind` ist `channel`
oder `dm`, `conversationId` die Channel-ID bzw. die ID der Direktnachricht). Die Links bauen
`features/workspace/chat-links.ts` (`channelLink`, `directMessageLink`, `newMessageLink`, `messageLink`) und
`features/thread/thread-route.ts` (`threadCommands`). Der Rahmen erkennt daran selbst, welche Ansicht offen ist;
auf dem Handy führt sein Zurück-Pfeil Thread → Chat → Menü.

Signaturen stehen als JSDoc an der jeweiligen Methode. Ändert sich eine Signatur, gilt das wie eine Änderung an `core/models/`.

### Was Bereich A bereitstellt (Stand 22.10.2026)

Alles liegt auf `main`; die Signaturen stehen als JSDoc an den Klassen.

| Was                                              | Wo                                       | Nutzung                                                                                                                                       |
| ------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Angemeldete Person                               | `core/services/auth.service.ts`          | `AuthService.currentUser()` (`AppUser` oder `null`), `uid()`                                                                                  |
| Alle Personen, live                              | `core/services/user.service.ts`          | `UserService.users()`: Name, Avatar, `presence` (`online`, `away`, `offline`), `isGuest`                                                      |
| Channels, live                                   | `core/services/channel.service.ts`       | `channels()` (eigene, älteste zuerst), `allChannels()`; `create`, `update`, `addMembers`, `leave`                                             |
| Online-Status                                    | `core/services/presence.service.ts`      | läuft von selbst: sichtbarer Tab `online`, verborgener `away`, Log out `offline`                                                              |
| Profil einer Person                              | `features/profile/profile-viewer.ts`     | `inject(ProfileViewer).show(uid)`; der Workspace-Rahmen zeigt den Dialog, „Nachricht“ wählt die Person im Menü                                |
| Channel bearbeiten, Mitglieder, Leute hinzufügen | `features/channels/channel-dialogs.ts`   | `inject(ChannelDialogs).open(channelId, 'settings' \| 'members' \| 'add-members')`; Speichern, Verlassen und Profil-Klick erledigt der Rahmen |
| Workspace-Rahmen                                 | `features/workspace/workspace.routes.ts` | `/workspace` nur angemeldet (`signedInGuard`); `CHAT_ROUTES` als Kinder, Threads im Outlet `thread`                                           |
| Datenmodell                                      | `core/models/`                           | `app-user.ts`, `channel.ts` (A), `message.ts`, `direct-chat.ts` (B), alle nach ttoebbe/dabubble#1                                             |

Start-Channel: `channels/entwicklerteam` („Entwicklerteam“) legt die erste Person an, die sich anmeldet; jedes
neue Konto und jeder Gast tritt ihm automatisch bei (`core/services/channel-membership.ts`).

Gäste: Beim Log out entfernt die App den Gast aus allen Channels und löscht das anonyme Konto und sein Profil. Nachrichten eines Gastes zeigen danach
auf eine `uid` ohne Profil; die Ansicht zeigt dann „Gast“ mit dem Platzhalter-Avatar.

**Firestore-Regeln:** stehen in `firestore.rules` (B) und sind seit 23.10.2026 in der Konsole
veröffentlicht. Eine Änderung kommt erst ins Repo und geht dann nach Absprache in die Konsole.

Lokal braucht jede Person `src/environments/environment.ts` mit der Firebase-Konfiguration (`docs/einstieg.md`).

## Git und Zusammenarbeit

- Beide arbeiten gleichberechtigt direkt auf `main`. Gesperrt sind nur Force-Push und das Löschen von `main`.
- Vor Arbeitsbeginn und vor jedem Push `git pull --rebase`. Konflikte löst, wer pusht.
- Kleine Commits, oft pushen. Jede Person committet in jeder Arbeitssitzung mindestens einmal (DA-Checkliste).
- Commits nach Conventional Commits, Englisch, eine Zeile.
- Die CI prüft jeden Push (Format, Lint, Build). Wird `main` rot, behebt das sofort, wer den Commit gepusht hat.
- Größere Umbauten optional auf einem Branch mit Bereichskürzel (`feature/a-login`, `feature/b-threads`) und per PR mit der PR-Vorlage zurück; Review ist dann willkommen, aber keine Pflicht.
- Wird etwas im fremden Bereich gebraucht: GitHub-Issue mit Label `bereich-a` oder `bereich-b`, nicht selbst ändern.
- Gemeinsame Dateien nur nach kurzer Absprache, als eigener Commit.
- Ein Deploy ist eine gemeinsame Entscheidung; beide können ihn in GitHub Actions starten.
- Arbeitsstand bei Feierabend in die eigene Datei unter `docs/stand/`, Ablauf in `CLAUDE.md` („Absprache zwischen den Claude-Sitzungen“).
- Nach der Abgabe forken beide das Repo (DA-Checkliste).
