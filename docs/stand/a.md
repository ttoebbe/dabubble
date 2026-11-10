# Stand Bereich A (Thomas)

Aktualisiert: 10.11.2026

## Erledigt

- Bereich A und B fertig und live (`2d69587`, 10.11.2026, https://dabubble-3299.developerakademie.net).
  Layout-Check grün auf `7c26079`: 18 Seiten × 6 Viewports, 108 Kombinationen (Fehlalarm am mobil nur visuell
  ausgeblendeten Menükopf im Checker behoben, `2d94d17` in `ttoebbe/dabubble-layout-check`).
- Funde aus deinem Test vom 24.10. erledigt: LCP-Logo mit `priority` (0a0c2d2), mobile Menü-Seite mit `main` und
  `h1` (7ddcc32); axe ohne Verstöße mobil und am Desktop.
- Issues ttoebbe/dabubble#1, #4, #5 und #6 geschlossen (10.11.2026).
- Impressum und Datenschutz (Entscheidung Thomas 10.11.2026): Wir beide stehen mit eigener Anschrift im Impressum
  und sind gemeinsam verantwortlich nach Art. 26 DSGVO. Die Datenschutzerklärung hat dafür den Abschnitt
  „Gemeinsame Verantwortung“ und ist präzisiert (Firebase Authentication nur in den USA, Bestätigungs- und
  Passwort-Mail, IP-Adresse an Google). Entwurf der Vereinbarung: `docs/vereinbarung-gemeinsame-verantwortung.md`.
- README als Überblick über die App neu geschrieben, ohne Bereiche, Checkliste und Teamregeln. Verweise auf
  `docs/DA_Checkliste/` und `.claude/skills/` in `CLAUDE.md` und `docs/` sagen jetzt „nur lokal“.

## In Arbeit

- Nichts.

## Als Nächstes

- Sobald deine Anschrift im Impressum steht: erneut deployen und die Live-Seite prüfen.
- Vereinbarung und „Nur in Figma“ (`docs/arbeitsteilung.md`) gemeinsam bestätigen.
- Auftragsverarbeitung mit Google in der Firebase-Konsole nachsehen.
- Abgabe bei der DA mit Repo- und Live-Link.

## Brauche von B

- Deine Anschrift im Impressum (`src/app/features/legal/imprint/imprint.html`), dort stehen Musterdaten. Bitte
  selbst eintragen und nicht in einem Issue posten, das Repo ist öffentlich. Live steht bis zum nächsten Deploy die
  Musteranschrift.
- `docs/vereinbarung-gemeinsame-verantwortung.md` lesen und unten mit Datum bestätigen.
- Das Repo forken (DA-Checkliste).

## Hinweise für B

- Die README beschreibt nur noch die App; Arbeitsregeln stehen in `CLAUDE.md`, offene Punkte in `docs/todo.md`.
