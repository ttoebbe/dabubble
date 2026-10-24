# Abnahme-Test

Durchlauf gegen die DA-Checkliste (`docs/DA_Checkliste/`) und den Qualitäts-Check aus `CLAUDE.md`, für den
gemeinsamen Klicktest und die Abgabe. Erledigtes abhaken; was scheitert, kommt als Punkt nach `docs/todo.md`.

Stand 24.10.2026: Bearbeiten, „Neue Nachricht“ und Suche sind von Yannic (zwei Gäste) und Thomas (eigenes
Konto) geprüft; axe-core ohne Verstöße in Workspace, Channel, Direktnachricht, Thread, Suche und „Neue Nachricht“
(G8; Konto-Seiten am 22.10.). Direktnachrichten, Reaktionen, Threads und Erwähnungen hat Yannic am 23.10. mit
zwei Gästen live geprüft. Was noch offen ist, steht gesammelt oben in `docs/todo.md`.
Vorlauf 24.10. (Yannic, nur mit drei Gästen, kein Konto): S1–S7, S11 und S12 erneut bestanden; G6, G7, G9 und G10 auf den
Chat-Seiten (DM, Chat mit sich selbst, Thread, „Neue Nachricht“, Suche, Channel nur angesehen) bestanden, auf Login,
Menü und Dialogen noch offen (Bereich A). „(B)“ heißt nur mit Gästen geprüft; im Termin mit Konto noch einmal ansehen:
S1, S5, S6 (Echtzeit und Reaktionen zwischen Konto und Gast), Erwähnung echter Personen.
Gemeinsamer Termin 24.10. (Thomas mit Konto, Yannic mit Gast): alle offenen Punkte bestanden, dazu S1, S5, S6 und
S12 zwischen Konto und Gast.

## Vorbereitung

- **Zwei Sitzungen:** A = Thomas mit eigenem Konto (Browser-Fenster der App oder Chrome), B = ein Gast im
  Inkognito-Fenster. So lassen sich Echtzeit, Direktnachrichten und Reaktionen beidseitig prüfen.
- **Testdaten:** Ins „Entwicklerteam“ schreiben wir keine Testnachrichten. Für Channel-Tests legt A den Channel
  `abnahme-test` an und verlässt ihn am Ende; Nachrichten-Tests laufen dort und in der Direktnachricht A ↔ B.
- **Werkzeuge:** DevTools offen (Konsole, Netzwerk „Offline“ für Fehlerzustände), axe-core
  (Browser-Erweiterung oder Snippet), Gerätemodus für die Breiten 320, 430, 768, 1024, 1440 und 1920 px.
- **Layout-Check:** GitHub → Actions → „Layout check“ → „Run workflow“ (18 Seiten × 6 Viewports, Gäste-Login).

## Allgemein

| Nr  | Schritt                                                              | Erwartet                                                     | ✓        |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| G1  | Jede Seite und jeden Dialog öffnen, alle Buttons und Links anklicken | Jeder Klick tut etwas, keine toten Links                     | ✓ 24.10. |
| G2  | Konsole während des ganzen Durchlaufs beobachten                     | Keine Fehler und keine Warnungen der App                     | ✓ 24.10. |
| G3  | Login, Workspace und Chat im Inkognito-Fenster                       | Funktioniert wie im normalen Fenster                         | ✓ 24.10. |
| G4  | Favicon im Tab                                                       | DABubble-Logo                                                | ✓ 24.10. |
| G5  | Alle Seiten in den sechs Breiten                                     | Keine horizontale Scrollleiste, nichts abgeschnitten         | ✓ 24.10. |
| G6  | Buttons: Maus darüber, deaktiviert, aktiv                            | `cursor: pointer`, Hover-Zustand, Disabled sichtbar          | ✓ 24.10. |
| G7  | Inputs und Buttons ohne Fokus                                        | Kein Browser-Standardrahmen; Fokus mit Tastatur sichtbar     | ✓ 24.10. |
| G8  | axe-core auf Login, Registrierung, Workspace, Channel, DM, Thread    | Keine Verstöße                                               | ✓ 24.10. |
| G9  | Tab-Taste durch Login, Menü, Chat, Dialoge                           | Reihenfolge logisch, Escape schließt Dialoge und Listen      | ✓ 24.10. |
| G10 | Schriftgrößen und Touch-Flächen stichprobenartig (DevTools)          | Schrift ≥ 16 px (Zeitstempel, Fehler 14 px), Flächen ≥ 44 px | ✓ 24.10. |

## Konto (Benutzeraccount & Administration)

| Nr  | Schritt                                                                  | Erwartet                                                                      | ✓        |
| --- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------- |
| K1  | „Konto erstellen“: jedes Feld anklicken und leer verlassen               | Meldung direkt am Feld, „Weiter“ gesperrt, kein `alert()`, keine HTML5-Blase  | ✓ 24.10. |
| K2  | Ungültige E-Mail, zu kurzes Passwort, Datenschutz nicht angehakt         | Je eine konkrete Meldung am Feld                                              | ✓ 24.10. |
| K3  | Bereits verwendete E-Mail                                                | „Diese E-Mail-Adresse wird bereits verwendet.“ am Feld                        | ✓ 24.10. |
| K4  | Gültig registrieren, Avatar wählen („Wähle deinen Avatar“)               | „Konto erfolgreich erstellt!“, zurück zum Login, Bestätigungs-E-Mail kommt    | ✓ 24.10. |
| K5  | Login mit falschem Passwort                                              | „Falsches Passwort. Bitte noch einmal versuchen.“                             | ✓ 24.10. |
| K6  | Login richtig; „Anmelden mit Google“; „Gäste-Login“                      | Workspace öffnet sich, Start-Channel „Entwicklerteam“ ist im Menü             | ✓ 24.10. |
| K7  | „Passwort vergessen?“ → E-Mail eingeben                                  | E-Mail mit Link kommt; neues Passwort setzen; Login mit neuem Passwort klappt | ✓ 24.10. |
| K8  | Profilmenü → „Profil“ → „Bearbeiten“: Name ändern, Avatar wählen         | Speichern zeigt den neuen Namen und Avatar sofort im Profil, Menü und Chat    | ✓ 24.10. |
| K9  | Profil bearbeiten mit leerem Namen, „Speichern“                          | Meldung am Feld, nichts gespeichert                                           | ✓ 24.10. |
| K10 | Desktop: Menü über „Workspace-Menü schließen“ ein- und wieder ausklappen | Chat wird breiter, Menü kommt zurück                                          | ✓ 24.10. |
| K11 | Mobil: Channel wählen, Zurück-Pfeil; Thread öffnen, Zurück               | Menü → Chat → Thread als eigene Ansichten, Zurück führt eine Ebene hoch       | ✓ 24.10. |
| K12 | Online-Status: B öffnet einen anderen Tab, dann meldet sich B ab         | Punkt bei B in Menü und Chat wird grau; nach Log out offline                  | ✓ 24.10. |
| K13 | Log out als Gast                                                         | Gast verschwindet aus dem Entwicklerteam, Konto und Profil sind gelöscht      | ✓ 24.10. |

## Schreiben in Channels und Direktnachrichten

| Nr  | Schritt                                                                   | Erwartet                                                                           | ✓            |
| --- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------ |
| S1  | A öffnet die Direktnachricht mit B und schreibt                           | Nachricht erscheint bei B ohne Neuladen; ein Dritter sieht sie nicht               | ✓ 24.10.     |
| S2  | Zwischen Channel und Direktnachricht wechseln                             | Fokus steht sofort im Eingabefeld                                                  | ✓ 24.10. (B) |
| S3  | Leere Nachricht senden (Enter, Button)                                    | Nichts wird gesendet, Button gesperrt                                              | ✓ 24.10. (B) |
| S4  | Emoji im Eingabefeld einfügen, senden                                     | Emoji steht in der Nachricht, auch bei B                                           | ✓ 24.10. (B) |
| S5  | Auf eine Nachricht reagieren: Aktionsleiste, zwei zuletzt genutzte Emojis | Ohne Historie die Figma-Standard-Emojis, danach die zuletzt genutzten              | ✓ 24.10.     |
| S6  | A und B reagieren mit demselben Emoji                                     | Ein Chip mit Zähler 2; Hover zeigt, wer reagiert hat                               | ✓ 24.10.     |
| S7  | Mehr als 7 Reaktionen mobil bzw. im Thread                                | 7 sichtbar plus „+x weitere“, Klick zeigt alle und „Weniger anzeigen“              | ✓ 23.10. (B) |
| S8  | „Neue Nachricht“: `#` tippen                                              | Liste der eigenen Channels; Pfeiltasten, Enter wählen; Senden öffnet den Channel   | ✓ 24.10.     |
| S9  | „Neue Nachricht“: `@` tippen, dann Name, dann E-Mail                      | Personen gefiltert; nach Senden öffnet sich die Direktnachricht                    | ✓ 24.10.     |
| S10 | „Neue Nachricht“ ohne Empfänger                                           | Eingabefeld gesperrt                                                               | ✓ 24.10.     |
| S11 | Thread starten (Icon in der Aktionsleiste), B antwortet                   | Thread daneben (mobil eigene Ansicht), „1 Antwort“ und „Letzte Antwort“ im Chat    | ✓ 23.10. (B) |
| S12 | Im Eingabefeld `@` und `#`                                                | Liste öffnet sich, filtert beim Tippen; Erwähnung im Text klickbar                 | ✓ 24.10.     |
| S13 | Eigene Nachricht: „⋮“ → „Nachricht bearbeiten“, ändern, Enter             | Text geändert, bei B live; Escape bzw. „Abbrechen“ verwirft                        | ✓ 24.10.     |
| S14 | Suche: Stichwort aus S1                                                   | Treffer mit Channel bzw. Person, Autor, Zeit, markiertem Text; Klick öffnet Thread | ✓ 24.10.     |
| S15 | Suche: `#`, `@`, Stichwort aus einer Thread-Antwort, Unsinn (`qxz`)       | Channels, Personen, „· Thread“-Treffer, „Keine Ergebnisse gefunden.“               | ✓ 24.10.     |
| S16 | Suche offen lassen, B schreibt eine passende Nachricht                    | Treffer erscheint ohne neues Tippen                                                | ✓ 24.10.     |
| S17 | Mobil: „Gehe zu...“ antippen, suchen, Schließen                           | Ansicht „Search“, Treffer als Liste, Schließen führt zum Menü                      | ✓ 24.10.     |

## Channels

| Nr  | Schritt                                                                     | Erwartet                                                                    | ✓        |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------- |
| C1  | „Channel erstellen“: Name `abnahme-test`, Beschreibung, B hinzufügen        | Channel erscheint unten in der Liste, B sieht ihn                           | ✓ 24.10. |
| C2  | Channel erstellen mit vorhandenem Namen (`entwicklerTeam`), „Erstellen“     | Meldung am Feld, kein zweiter Channel                                       | ✓ 24.10. |
| C3  | A und B schreiben im Channel                                                | Beide senden und empfangen live                                             | ✓ 24.10. |
| C4  | B fügt über den Channel-Kopf eine weitere Person hinzu (mehrere auswählbar) | Zähler und Avatare im Kopf aktualisieren sich                               | ✓ 24.10. |
| C5  | Channel-Name anklicken → Name und Beschreibung bearbeiten                   | Änderung sofort bei allen Mitgliedern                                       | ✓ 24.10. |
| C6  | Umbenennen in einen vorhandenen Namen; Speichern offline (DevTools)         | Meldung am Feld bzw. „Das hat nicht geklappt. Bitte noch einmal versuchen.“ | ✓ 24.10. |
| C7  | „Channel verlassen“                                                         | Channel verschwindet aus dem Menü, Ansicht wechselt                         | ✓ 24.10. |

## Testdaten für die UI-Zustände

| Zustand                   | So entsteht er                                                        |
| ------------------------- | --------------------------------------------------------------------- |
| Leerer Channel            | Neuer Channel (C1) vor der ersten Nachricht: Intro ohne Nachrichten   |
| Leere Direktnachricht     | Person ohne bisherigen Chat öffnen; Chat mit sich selbst: Notiz-Intro |
| Laden                     | DevTools „Slow 3G“, Channel öffnen: „Nachrichten werden geladen …“    |
| Suche lädt / ohne Treffer | Stichwort tippen: „Nachrichten werden durchsucht …“; `qxz`            |
| Fehler beim Speichern     | DevTools „Offline“, dann speichern oder senden                        |
| Abgelaufener Link         | Reset-Link ein zweites Mal öffnen: „Dieser Link ist ungültig …“       |
| Autor ohne Profil         | Nachricht eines Gastes nach dessen Log out: „Gast“ mit Platzhalter    |

## Nach dem Durchlauf

- A verlässt `abnahme-test`, der Gast meldet sich ab.
- Funde nach `docs/todo.md`, Ergebnis kurz in `docs/stand/a.md` bzw. `b.md`.
- Vor der Abgabe zusätzlich der Skill `final-check` und die Punkte „Vor der Abgabe“ in `docs/todo.md`.
