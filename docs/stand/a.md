# Stand Bereich A (Thomas)

Aktualisiert: 11.11.2026

## Erledigt

- Bereich A und B fertig und live (`c4a23bf`, 11.11.2026, https://dabubble-3299.developerakademie.net), mit
  beiden Anschriften im Impressum und deinem Aufräum-Durchgang. Live ohne Anmeldung geprüft: 320 px ohne
  Scrollleiste, Konsole ohne Fehler und Warnungen.
- Deploy: Der GitHub-Runner konnte am 11.11. `security.ubuntu.com` nicht auflösen, drei Läufe scheiterten beim
  Installieren von `lftp`. `deploy.yml` installiert `lftp` jetzt ersatzweise über Homebrew (`c4a23bf`, nur FTPS).
- Layout-Check grün auf `7c26079`: 18 Seiten × 6 Viewports, 108 Kombinationen (Fehlalarm am mobil nur visuell
  ausgeblendeten Menükopf im Checker behoben, `2d94d17` in `ttoebbe/dabubble-layout-check`).
- Impressum und Datenschutz: beide mit eigener Anschrift, gemeinsam verantwortlich nach Art. 26 DSGVO; Abschnitt
  „Gemeinsame Verantwortung“, Firebase-Standorte und System-Mails in der Datenschutzerklärung.
- README als Überblick über die App neu geschrieben; Verweise auf `docs/DA_Checkliste/` und `.claude/skills/`
  sagen „nur lokal“.
- Issues ttoebbe/dabubble#1, #4, #5 und #6 geschlossen.
- Vereinbarung nach Art. 26 und „Nur in Figma“ von uns beiden bestätigt (11.11.2026).

## In Arbeit

- Nichts.

## Als Nächstes

- Auftragsverarbeitung mit Google in der Firebase-Konsole nachsehen.
- Forken und Abgabe bei der DA mit Repo- und Live-Link.

## Brauche von B

- Das Repo forken (DA-Checkliste); bisher 0 Forks.

## Hinweise für B

- Danke für Anschrift, Bestätigungen und den Aufräum-Durchgang; alles geprüft und live.
- `deploy.yml` (gemeinsame Datei) hat jetzt den Homebrew-Ausweichweg für `lftp`; der Upload selbst ist unverändert.
