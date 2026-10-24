# Stand Bereich A (Thomas)

Aktualisiert: 23.10.2026 (abends)

## Erledigt

- Bereich A fertig, live ist der Stand vom 22.10. (http://dabubble-3299.developerakademie.net): Registrierung mit
  Avatar und Bestätigungs-E-Mail, Login (E-Mail, Google, Gast), Passwort vergessen, Profil bearbeiten,
  Workspace-Rahmen mit Menü und Online-Status, Channels anlegen, bearbeiten, verlassen, Mitglieder hinzufügen.
- Start-Channel „Entwicklerteam“ (`channels/entwicklerteam`): Jedes neue Konto und jeder Gast tritt bei.
- Gäste: Beim Log out verlässt der Gast alle Channels, Profil und Konto werden gelöscht. Andere Gäste sind in Menü,
  Personensuche und Mitgliederlisten ausgeblendet; `UserService.users` bleibt vollständig (für Nachrichten-Autoren).
- Menü (Channel, Person, „Neue Nachricht“) und „Nachricht“ im Profil führen über `CHAT_ROUTES`; der markierte
  Menüeintrag folgt der URL, auch mit offenem Thread.
- 23.10. abends, mit Freigabe von Yannic in Bereich B:
  - Channel-Kopf nach Figma `46.` (40-px-Avatare, 10 px Überlappung), unter 600 px Chatbreite ohne Avatare
    (ttoebbe/dabubble#3, geschlossen).
  - Eigene Nachrichten und Antworten bearbeiten: „⋮“ in der Aktionsleiste → „Nachricht bearbeiten“
    (`message-options/`, `message-editor/`, `MessageService.edit`, `editReply`).
  - „Neue Nachricht“ (`features/new-message/`): Adressfeld mit `#`, `@`, Name oder E-Mail, danach öffnet der Chat.
  - Suche (`features/search/`, `MessageSearchService`): Desktop „Devspace durchsuchen“ im Header, mobil „Gehe zu...“
    im Menü mit Ansicht „Search“. `#` Channels, `@` Personen, sonst auch Nachrichten mit Kontext; Klick auf eine
    Nachricht öffnet den Chat mit ihrem Thread. Thread-Antworten werden mit durchsucht. Bei schmaler Leiste
    (768 bis ca. 990 px) weniger Innenabstand, 18-px-Schrift und rechtsbündige Liste.
  - Layout-Check (`ttoebbe/dabubble-layout-check` becede6) misst zusätzlich Channel, Chat mit sich selbst,
    „Neue Nachricht“ und die Suche (`#`, `@`, ohne Treffer): 18 Seiten × 6 Viewports, noch nicht gelaufen.
  - Doku nachgezogen: `README.md`, `docs/todo.md`, `docs/arbeitsteilung.md`, `docs/einstieg.md`, Spec 8.14–8.17.
- Nur Lint, Build und Format geprüft; angemeldet durchgeklickt ist von den Punkten oben noch nichts.

## In Arbeit

- Nichts.

## Als Nächstes

- Angemeldet durchklicken: Bearbeiten, „Neue Nachricht“, Suche (Desktop und mobil), Konsole, axe-core,
  320–1920 px. Fällt die Stichwortsuche mit „Das hat nicht geklappt …“ aus, lehnen die Regeln die Abfrage
  `directChats where memberIds array-contains uid` ab.
- Layout-Check mit den neuen Chat-Seiten laufen lassen (Thomas startet ihn, Gäste-Login).
- Vier Gast-Konten vom 23.10. löschen (Thomas, Firebase-Konsole).
- Deploy des neuen Stands nach Absprache.
- Impressum mit echten Daten füllen, Datenschutz-Entwurf gemeinsam prüfen (`docs/todo.md`).

## Brauche von B

- Rückmeldung, ob Bearbeiten, „Neue Nachricht“ und Suche so passen; sonst gern direkt ändern.

## Hinweise für B

- Suche: Thread-Antworten werden mit durchsucht; `MessageSearchService` liest dafür die Antworten jeder Nachricht
  mit `replyCount > 0` (keine Regeländerung nötig).
- `MessageFeed`/`toFeed` (`features/chat/message-feed.ts`) sind jetzt für jeden Typ nutzbar, nicht nur für
  `ChatMessage`; die Suche nutzt sie für `PlacedMessage`.
- `chat-links.ts` hat `messageLink(kind, chat, conversationId, messageId)`: Chat mit offenem Thread einer Nachricht.
- Schnittstellen und Regeln: `docs/arbeitsteilung.md`, Überblick mit Diagrammen in `README.md`.
