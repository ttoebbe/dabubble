# Stand Bereich A (Thomas)

Aktualisiert: 24.10.2026

## Erledigt

- Bereich A und B live seit 24.10. (`040e841`, https://dabubble-3299.developerakademie.net): Registrierung mit
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
- 24.10.: Abnahme-Testplan `docs/abnahme.md`; compodoc eingerichtet (`npm run docs`, optionaler Checklisten-Punkt).
- 24.10.: Angemeldet geprüft (eigenes Konto, 430/320 px und Desktop): Suche mit `#`, `@`, Stichwort in Channel, DM und
  Thread-Antwort, „Neue Nachricht“, Bearbeiten; axe-core ohne Verstöße. Fixes daraus: mobile Abstände der Suche wie
  Figma, Bearbeiten-Kasten scrollt ganz in Sicht, „#“ und Name im Channel-Intro bleiben zusammen, Logo staucht
  nicht, Text auf hellem Lila in `--color-link` (Menü, Profilmenü, Trefferliste, Erwähnungsliste; Hinweis von B).
- 24.10.: Deploy `040e841` (live über https). Layout-Check grün: 18 Seiten × 6 Viewports, 108 Kombinationen.

## In Arbeit

- Nichts.

## Als Nächstes

- Rest von `docs/abnahme.md` (Konto- und Channel-Punkte mit zwei Sitzungen).
- Vier Gast-Konten vom 23.10. löschen (Thomas, Firebase-Konsole).
- Impressum mit echten Daten füllen, Datenschutz-Entwurf gemeinsam prüfen (`docs/todo.md`).

## Brauche von B

- Nichts offen. Danke für die Prüfung und die Fixes vom 24.10.; der Menü-Kontrast ist behoben (c7212cb).

## Hinweise für B

- Alle offenen Punkte bis zur Abgabe stehen jetzt gesammelt oben in `docs/todo.md` („Offen bis zur Abgabe“), auch
  deine zwei Prüfpunkte („Neue Nachricht“ an einen Channel, Tab im Adressfeld) und zwei Kleinigkeiten aus dem Test.
- Erledigt aus deinem „Brauche von A“: Menü-Kontrast (c7212cb, dazu Profilmenü, Trefferliste, Erwähnungsliste und
  Hover der Erwähnung im Text). In `docs/stand/b.md` sind außerdem veraltet: #3 ist geschlossen (Channel-Kopf nach
  Figma `46.`), README und todo nennen keine Platzhalter mehr.
- Neu als Dev-Abhängigkeit: compodoc (`npm run docs`, Ausgabe in `documentation/`, gitignored). Nach dem Pull einmal
  `npm install`.
- Suche: Thread-Antworten werden mit durchsucht; `MessageSearchService` liest dafür die Antworten jeder Nachricht
  mit `replyCount > 0` (keine Regeländerung nötig).
- `MessageFeed`/`toFeed` (`features/chat/message-feed.ts`) sind jetzt für jeden Typ nutzbar, nicht nur für
  `ChatMessage`; die Suche nutzt sie für `PlacedMessage`.
- `chat-links.ts` hat `messageLink(kind, chat, conversationId, messageId)`: Chat mit offenem Thread einer Nachricht.
- Schnittstellen und Regeln: `docs/arbeitsteilung.md`, Überblick mit Diagrammen in `README.md`.
