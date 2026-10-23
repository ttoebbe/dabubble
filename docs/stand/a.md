# Stand Bereich A (Thomas)

Aktualisiert: 23.10.2026

## Erledigt

- Bereich A fertig und live (http://dabubble-3299.developerakademie.net): Registrierung mit Avatar und
  Bestätigungs-E-Mail, Login (E-Mail, Google, Gast), Passwort vergessen, Profil bearbeiten, Workspace-Rahmen mit
  Menü und Online-Status, Channels anlegen, bearbeiten, verlassen, Mitglieder hinzufügen. Scheitert das Speichern,
  zeigt der Dialog eine Meldung.
- Start-Channel „Entwicklerteam“ (`channels/entwicklerteam`): Jedes neue Konto und jeder Gast tritt bei.
- Gäste: Beim Log out verlässt der Gast alle Channels, Profil und Konto werden gelöscht. Andere Gäste sind in Menü,
  Personensuche und Mitgliederlisten ausgeblendet; `UserService.users` bleibt vollständig (für Nachrichten-Autoren).
- 23.10.: Menü (Channel, Person, „Neue Nachricht“) und „Nachricht“ im Profil führen über `CHAT_ROUTES`; der markierte
  Menüeintrag folgt der URL, auch mit offenem Thread.
- 23.10.: Datenmodell für Nachrichten, DMs und Threads in ttoebbe/dabubble#1 bestätigt, PR #2 gemergt.
- AXE ohne Verstöße auf den Konto-Seiten und im Workspace, Layout-Check in Actions grün (72 Kombinationen).

## In Arbeit

- Nichts. Bereich A wartet auf die Chat-Ansichten von B.

## Als Nächstes

- Klicktest Menü → Chat-Ansicht im angemeldeten Workspace.
- Yannic ins Firebase-Projekt einladen, damit B die Firestore-Regeln selbst veröffentlicht.
- Impressum mit echten Daten füllen, Datenschutz-Entwurf gemeinsam prüfen (`docs/todo.md`).

## Brauche von B

- Chat-, DM- und Thread-Ansichten statt der Platzhalter.
- Such-Komponente für den Header; der Platz dafür ist im Header vorgesehen.
- Online-Status neben Namen und Avataren in Chats und Threads (aus `UserService.users`).

## Hinweise für B

- Schnittstellen und Regeln: `docs/arbeitsteilung.md`, Abschnitt „Schnittstellen“; Überblick mit Diagrammen in
  `README.md`.
- Router mit Hash-URLs: `/#/workspace/channel/…`; `routerLink` und `router.navigate` funktionieren wie gewohnt.
- Profil einer Person: `ProfileViewer.show(uid)`; Channel-Kopf: `ChannelDialogs.open(channelId, kind)` mit
  `'settings'`, `'members'` oder `'add-members'`.
- Live gilt der Stand in der Firebase-Konsole, nicht `firestore.rules` im Repo. Regeländerungen dort veröffentlichen.
