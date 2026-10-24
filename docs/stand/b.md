# Stand Bereich B (Yannic)

Aktualisiert: 24.10.2026

## Erledigt

- Modelle `core/models/message.ts` und `direct-chat.ts` exakt nach ttoebbe/dabubble#1.
- `firestore.rules` im Repo um Nachrichten, DMs und Thread-Antworten erweitert (Regeln aus #1). Eine Abweichung:
  `directChats/{id}` darf auch lesen, wenn das Dokument noch nicht existiert (`resource == null`), sonst scheitert
  das Öffnen einer neuen DM mit permission-denied. Seit 23.10. abends live in der Konsole (Yannic, Editor).
- Live geprüft mit zwei Gästen: DM in beide Richtungen in Echtzeit, Chat mit sich selbst, Lesen im Entwicklerteam.
  Senden im Channel live noch nicht geprüft (keine Testnachrichten ins Entwicklerteam). Fix c236034: neue DM wird
  erst nach dem Server-Commit gelesen, sonst sah der Absender seine erste Nachricht nicht.
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
- Reaktionen (Schreiben US2, Zähler US3): Aktionsleiste beim Hover/Fokus (mobil nach Tipp auf die Nachricht) mit den zwei
  zuletzt genutzten Emojis (`localStorage` pro uid, ohne Historie ✅ und 🙌) und Emoji-Liste (Picker als „Reaktion
  hinzufügen“ wiederverwendet). Eigene Nachrichten: nur Emoji-Liste (Figma `53B.`). Chips mit Zähler unter der
  Nachricht, eigene Reaktion markiert, Klick schaltet um. Tooltip „<Name> hat reagiert“ bei Hover, Tastaturfokus und
  Tipp. Mobil max. 7 Chips plus „+x weitere“ / „Weniger anzeigen“. Schreiben per Transaktion
  (`MessageService.toggleReaction`, generisch über `toggleAt`), leere Einträge werden entfernt. Live mit zwei Gästen in
  der DM geprüft: setzen, entfernen, Echtzeit, Zähler, Namen, zuletzt genutzt, 320–1920 px ohne Scrollleiste.
- Thread-Route `thread/:kind/:conversationId/:messageId`; der markierte Menüeintrag bleibt mit offenem Thread.
- Threads (Schreiben US5): Thread-Button in der Aktionsleiste (auch eigene Nachrichten), Thread-Ansicht im Outlet
  `thread` (`features/thread/thread-view/`) mit Kopf („Thread“ + Channel bzw. Person, Schließen), Ursprungsnachricht,
  Trenner „<n> Antworten“, Antworten live nach `createdAt`, Eingabefeld mit Fokus beim Öffnen, Reaktionen auf
  Ursprungsnachricht und Antworten (max. 7 sichtbar + „+x weitere“ auch am Desktop). Antwort senden: Reply plus
  `replyCount + 1` und `lastReplyAt` in einem Batch (`MessageService.reply`). Unter Nachrichten mit Antworten:
  „<n> Antworten“ (klickbar) + „Letzte Antwort <Uhrzeit>“. Der Thread schließt sich, wenn ein anderer Chat geöffnet wird.
- `@` und `#` im Eingabefeld (Haupt- und Thread-Eingabe): Dropdown mit Personen (ohne ausgeblendete Gäste) bzw. eigenen
  Channels, filtert beim Tippen, Pfeile/Enter/Tab/Escape, ARIA combobox/listbox; „@“-Button im Eingabefeld.
  Im Text sind `@Name`/`#channel` hervorgehoben und klickbar (Profil bzw. Channel); nicht auflösbare Namen bleiben
  normaler Text.
- Live mit zwei Gästen in der DM geprüft: Thread öffnen, Antworten in beide Richtungen mit Echtzeit-Zähler, Reaktion
  auf Antwort, Dropdown per Tastatur, Klick auf Erwähnungen; 320–1920 px ohne Scrollleiste (mit offenem Thread),
  mobil Thread als eigene Ansicht mit Zurück und Schließen; Konsole fehlerfrei. Beide Test-Gäste per Log out abgemeldet.
- Bearbeiten, „Neue Nachricht“ und Suche hat Thomas am 23.10. mit Freigabe gebaut (3a95914, f12190a, 7225a42 u. a.;
  Spec 8.15–8.17). Am 24.10. mit zwei Gästen live geprüft und im Code gegen Spec und Checkliste durchgesehen:
  - Bearbeiten (Nachricht und Thread-Antwort): „⋮“ nur an eigenen Nachrichten, Enter speichert, Escape und „Abbrechen“
    verwerfen, leer oder unverändert nicht speicherbar, Änderung live beim anderen. Fix: Fokus geht nach dem Bearbeiten
    zurück auf „⋮“.
  - Neue Nachricht: `#`, `@`, Name, E-Mail-Teil, Tab/Enter/Escape, Senden an sich selbst öffnet den Chat. Fix: das
    Eingabefeld ist bis zur Empfängerwahl wirklich gesperrt (Spec 8.16).
  - Suche: `#`, `@`, Stichwort in DM und Thread-Antwort, „Keine Ergebnisse gefunden.“, Treffer erscheint live, Klick
    öffnet Chat mit Thread, mobil „Gehe zu...“ mit Schließen. Die Abfrage `directChats where memberIds
    array-contains uid` läuft durch die Regeln, keine Regeländerung nötig. Fix: Treffer-Farbe `#444DF2` statt `#535AF1`
    (Kontrast 4,44 auf der markierten Zeile).
  - Querschnitt: axe-core ohne Verstöße (Fixes: Eingabefeld ohne ungültige Rolle `combobox`, eindeutiges Label
    „Antworten“ für die Thread-Liste), 320–1920 px ohne Scrollleiste, Konsole fehlerfrei. Beide Test-Gäste per Log out
    abgemeldet.

## In Arbeit

- Nichts.

## Als Nächstes

1. Abnahme-Durchlauf `docs/abnahme.md` mit Thomas, offene Punkte aus `docs/todo.md`.

## Brauche von A

- Bitte die 4 Gast-Konten löschen, die ein abgebrochener Testlauf am 23.10. im Projekt gelassen hat (Authentication
  und `users`, sind noch Mitglied im Entwicklerteam).
- Issue ttoebbe/dabubble#3 (Channel-Kopf).
- Kontrast im Menü: der aktive Eintrag (`.menu__pill`, `#535AF1` auf `#ECEEFE`, 4,44:1) fällt bei axe-core durch; `--color-link`
  (`#444DF2`) reicht.

## Hinweise für A

- Neue Dateien in `features/chat/` (u. a. `reaction-bar/`, `message-reactions/`, `reaction-chips.ts`, `recent-emojis.ts`); `chat.routes.ts` bindet Channel-, DM- und Thread-Ansicht ein, „Neue Nachricht“
  und die Suche sind eingebunden.
- `AuthService.logOut` löscht den Gast: seine Nachrichten bleiben stehen und zeigen „Gast“ mit Platzhalter-Avatar.
- Channel-Kopf-Avatare und Kopf-Umbruch 768–1440 px bewusst nicht angefasst (Issue ttoebbe/dabubble#3 an Thomas).
- Nicht angefasst, aber veraltet: Hinweis „Chat-Ansicht … ein Platzhalter“ in `README.md` und `docs/todo.md`
  (Channel-Kopf-Dialoge und `ProfileViewer.show` aus Nachrichten sind jetzt angeschlossen).
