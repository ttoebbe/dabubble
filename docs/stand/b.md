# Stand Bereich B (Yannic)

Aktualisiert: 24.10.2026 (Feierabend)

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
- Impressum mit meinem Namen und meiner E-Mail gefüllt (24.10.).
- Datenschutz-Entwurf (Bereich A, auf Yannics Ansage) korrigiert und mit den passenden Teilen der Join-Erklärung
  ausgebaut: Gast-Aufräumen nach 24 h, letzte Aktivität, Emojis im Browser, Server-Logs, TLS, Kontakt, Empfänger,
  Rechtsgrundlagen. Thomas muss ihn noch gegenlesen (docs/todo.md).
- Google-Erstlogin bekommt den ersten Avatar statt des Platzhalters (`0f6aedd`, `auth.service.ts` in Bereich A,
  mit Thomas abgesprochen; Google-Popup noch nicht live getestet).

## In Arbeit

- Nichts. Ich warte auf das Gespräch mit Thomas und seine Antwort auf ttoebbe/dabubble#5.

## Als Nächstes

1. Antwort auf ttoebbe/dabubble#5 (Restarbeiten, Datei-Upload, Blaze) und danach die Zuordnung in `docs/todo.md`
   eintragen.
2. Gemeinsamer Abnahme-Termin: S1, S5 und S6 mit Konto ↔ Gast wiederholen (Tooltip mit echtem Namen, `@Thomas`), dazu
   „Neue Nachricht“ an `abnahme-test` senden und Tab im Adressfeld (`@ga` → `@Gast`; hat in einem Testlauf einmal
   nicht gegriffen, ungeklärt).
3. Falls entschieden: Datei-Upload („+“ im Eingabefeld, Firebase Storage, `storage.rules`). Er braucht vorher Blaze
   und ein Design.

## Brauche von A

- Antwort auf ttoebbe/dabubble#5.
- Funde aus meinem Test (auch in `docs/todo.md`): Klickflächen im Menü (Einträge 33 px, „Neue Nachricht“ 40 px,
  „Channel hinzufügen“ 30 px), NG02955 für `workspace-logo.svg` ohne `priority` (nur Dev-Server), auf der mobilen
  Menü-Seite fehlen `main` und `h1` (axe `landmark-one-main`, `page-has-heading-one`). G6, G7, G9, G10 auf Login,
  Registrierung, Menü, Profil und Dialogen.

## Hinweise für A

- Danke für den Menü-Kontrast (c7212cb).
- `chatPersonName(name, isSelf)` in `features/chat/direct-chat/direct-chat.ts` liefert den Namen mit „(Du)“ für DM-
  und Thread-Kopf.
- Der Emoji-Picker hat jetzt den Input `disabled`. Der Standardwert ist `false`, Editor und Reaktionsleiste bleiben
  unverändert.
- Yannics Claude hat jetzt Lesezugriff auf das Firebase-Projekt (Firebase-CLI und MCP). Geschrieben, veröffentlicht oder gelöscht wird dort nur nach Absprache.
