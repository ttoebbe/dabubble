# Stand Bereich B (Yannic)

Aktualisiert: 24.10.2026 (abends)

## Erledigt

- Alle User Storys von B sind umgesetzt (Channels US1 Teil, Schreiben US1–US6) und dazu die Figma-Punkte
  Kopf-Avatare, Bearbeiten und Datumstrenner. Details zu Modell, Regeln, Services und Ansichten: Git-Historie bis
  `e614966`, Spec 8.x, `README.md`.
- `firestore.rules` gelten so wie im Repo, auch live. Abweichung von #1: `directChats/{id}` darf auch lesen, wenn das
  Dokument noch nicht existiert (`resource == null`). Am 24.10. per Firebase-CLI stichprobenartig mit der Konsole
  verglichen.
- Bearbeiten, „Neue Nachricht“ und Suche (von Thomas am 23.10. gebaut) am 24.10. mit Gästen live geprüft und
  durchgesehen, Rückmeldung in ttoebbe/dabubble#4. Fixes: Fokus nach dem Bearbeiten, Eingabefeld sowie Emoji- und
  „@“-Button bis zur Empfängerwahl gesperrt, Treffer-Farbe mit Kontrast, gültiges ARIA im Eingabefeld, Label
  „Antworten“ für die Thread-Liste.
- Abnahme-Vorlauf 24.10. mit Gästen (`docs/abnahme.md`, markiert mit „(B)“): S1–S7, S11, S12 bestanden, G6, G7, G9
  und G10 auf den Chat-Seiten. Fixes: Reaktionsleiste der ersten Thread-Nachricht sichtbar, Fokus nach Escape im
  Emoji-Picker, 44-px-Touch-Flächen für Chips, Namen, Nachrichten-, Bearbeiten-, Empfänger- und Suchfeld (das
  Nachrichtenfeld ist dadurch ca. 19 px höher als in Figma, Regel 5 in `CLAUDE.md`).
- Thomas' Kleinigkeiten vom 24.10.: Thread-Kopf im Chat mit sich selbst zeigt „(Du)“ (e46e144), mobile Suche gibt
  den Fokus beim Schließen zurück auf „Gehe zu...“ (57a41e9).
- Entschieden (Yannic): Ein einzelnes „@“ bleibt sendbar.
- Gemeinsame Abnahme 24.10. mit Konto und Gast bestanden: alle offenen G-, K- und C-Punkte, S1, S5, S6, S12, „Neue
  Nachricht“ an `abnahme-test`, Tab im Adressfeld (`docs/abnahme.md`).
- Entschieden (Thomas und Yannic, 24.10.): kein Datei-Upload, das Projekt bleibt im Spark-Tarif (`docs/todo.md`).
- Impressum mit meinem Namen und meiner E-Mail gefüllt (24.10.).
- Datenschutz-Entwurf (Bereich A, auf Yannics Ansage) korrigiert und mit den passenden Teilen der Join-Erklärung
  ausgebaut: Gast-Aufräumen nach 24 h, letzte Aktivität, Emojis im Browser, Server-Logs, TLS, Kontakt, Empfänger,
  Rechtsgrundlagen. Thomas muss ihn noch gegenlesen (docs/todo.md).
- Google-Erstlogin bekommt den ersten Avatar statt des Platzhalters (`0f6aedd`, `auth.service.ts` in Bereich A,
  mit Thomas abgesprochen; Google-Popup noch nicht live getestet).

## In Arbeit

- Nichts. Alle Punkte von B sind erledigt, offen sind nur noch gemeinsame Punkte.

## Als Nächstes

1. Mit Thomas den Datenschutz lesen (von mir am 24.10. erweitert, live seit `6467190`).
2. „Nur in Figma, nicht in der Checkliste“ in `docs/arbeitsteilung.md` bestätigen.
3. Skill `final-check` und den Qualitäts-Check aus `CLAUDE.md` ein letztes Mal, danach beide das Repo forken.

## Brauche von A

- Nichts Offenes. ttoebbe/dabubble#5 ist beantwortet (Zuordnung steht in `docs/todo.md`). Meine Funde sind erledigt:
  Die Menü-Klickflächen sind über `::after` 44 px groß (am 24.10. nachgemessen), NG02955 behoben (`0a0c2d2`), mobile
  Menü-Seite mit `main` und `h1` (`7ddcc32`), live seit `c17eb55`.
- Vor der Abgabe von A: `docs/DA_Checkliste/` und `.claude/skills/` aus dem Repo, letzter Deploy.

## Hinweise für A

- Danke für den Menü-Kontrast (c7212cb).
- Die Issues #1, #4, #5 und #6 sind inhaltlich erledigt; bitte schließen, wenn du einverstanden bist.
- `watchMobile()` aus `7ddcc32` in `new-message-view.ts` (Bereich B) passt, Verhalten wie vorher.
- `chatPersonName(name, isSelf)` in `features/chat/direct-chat/direct-chat.ts` liefert den Namen mit „(Du)“ für DM-
  und Thread-Kopf.
- Der Emoji-Picker hat jetzt den Input `disabled`. Der Standardwert ist `false`, Editor und Reaktionsleiste bleiben
  unverändert.
- Yannics Claude hat jetzt Lesezugriff auf das Firebase-Projekt (Firebase-CLI und MCP). Geschrieben, veröffentlicht oder gelöscht wird dort nur nach Absprache.
