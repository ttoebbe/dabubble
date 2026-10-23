# Stand Bereich B (Yannic)

Aktualisiert: 23.10.2026

## Erledigt

- Modelle `core/models/message.ts` und `direct-chat.ts` exakt nach ttoebbe/dabubble#1.
- `firestore.rules` im Repo um Nachrichten, DMs und Thread-Antworten erweitert (Regeln aus #1). Eine Abweichung:
  `directChats/{id}` darf auch lesen, wenn das Dokument noch nicht existiert (`resource == null`), sonst scheitert
  das Öffnen einer neuen DM mit permission-denied. **Live ist das noch nicht**: veröffentlichen geht erst nach der
  Einladung ins Firebase-Projekt; die Regeln sind ungetestet (kein Emulator).
- Services `MessageService` (live lesen sortiert nach `createdAt`, senden) und `DirectChatService` (DM-ID aus
  sortierten uids, Chat beim ersten Senden anlegen: erst `directChats/{id}`, dann die Nachricht).
- Channel-Ansicht (Kopf mit Name, Mitglieder-Avataren und Zähler, Klicks über `ChannelDialogs.open`) und
  DM-Ansicht (Kopf mit Person, „(Du)“-Chat mit sich selbst) mit Nachrichtenliste, Datumstrennern, eigener und
  fremder Ausrichtung, Autor-Klick (`ProfileViewer.show`), „Gast“ ohne Profil, Online-Status aus `UserService.users`.
- Eingabefeld: Senden per Button und Enter (Shift+Enter = Zeilenumbruch), Fokus beim Chatwechsel, leere Nachricht
  nicht sendbar, Fehler am Feld, Emoji-Auswahl als Unicode im Text.
- Emojis: 20 Unicode-Emojis in `features/chat/chat-emojis.ts` (id, Zeichen, Screenreader-Name; die vier aus Figma
  zuerst). Picker als Raster (5 Spalten, 44 px). Reaktionen nutzen später dieselbe Liste, Unicode statt Emojitwo-SVGs.
- Channel-Intro nennt Ersteller und Datum („Du hast diesen Channel heute erstellt.“ für den Ersteller), Jahr nur wenn
  nicht das aktuelle. Datumstrenner: „Heute“, „Gestern“, „Dienstag, 14. Januar“ (mit Jahr, wenn nicht aktuell).
- Ladezustand der Nachrichtenliste: „Nachrichten werden geladen …“ bis zur ersten Antwort.
- Thread-Route jetzt `thread/:kind/:conversationId/:messageId`; der markierte Menüeintrag bleibt mit offenem Thread.

## In Arbeit

- Nichts.

## Als Nächstes

1. Regeln in der Firebase-Konsole veröffentlichen (nach der Einladung), danach Lesen und Schreiben live prüfen.
2. Reaktionen (Schreiben US2), Zähler gleicher Emojis (US3), Threads (US5), Bearbeiten, „Neue Nachricht“ (US4), Suche (US6).

## Brauche von A

- Einladung ins Firebase-Projekt, damit ich die Regeln selbst veröffentlichen kann.
- Nichts an Dateien von A.

## Hinweise für A

- Neue Dateien in `features/chat/`; `chat.routes.ts` bindet Channel- und DM-Ansicht ein, „Neue Nachricht“ und Thread
  sind noch Platzhalter.
- `AuthService.logOut` löscht den Gast: seine Nachrichten bleiben stehen und zeigen „Gast“ mit Platzhalter-Avatar.
- Ohne die neuen Regeln zeigen Channel- und DM-Ansicht über dem Eingabefeld „Das hat nicht geklappt. Bitte noch
  einmal versuchen.“ (Lesen verweigert); das ist erwartet, bis die Regeln live sind.
- Channel-Kopf-Avatare und Kopf-Umbruch 768–1440 px bewusst nicht angefasst (Issue ttoebbe/dabubble#3 an Thomas).
- Nicht angefasst, aber veraltet: Hinweis „Chat-Ansicht … ein Platzhalter“ in `README.md` und `docs/todo.md`
  (Channel-Kopf-Dialoge und `ProfileViewer.show` aus Nachrichten sind jetzt angeschlossen).
