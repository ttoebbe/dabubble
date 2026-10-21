## Was und warum

<!-- 1–3 Sätze. Fundstelle in der DA-Checkliste, z. B. „Schreiben US2“. -->

## Bereich

- [ ] A – Thomas (Konto, Workspace-Rahmen, Channels)
- [ ] B – Yannic (Nachrichten, Threads, Suche)

Geänderte gemeinsame Dateien (`core/models/`, `shared/`, `app.routes.ts`, `app.config.ts`,
`package.json`, `angular.json`, `CLAUDE.md`, `docs/arbeitsteilung.md`): <!-- keine / welche -->

## Qualitäts-Check (CLAUDE.md)

- [ ] `npm run format:check`, `npm run lint` und `npm run build` laufen fehlerfrei
- [ ] Keine Fehler in der Browser-Konsole
- [ ] Werte aus `docs/Figma/spec.md`, Abweichungen begründet
- [ ] Schrift ≥ 16 px (Kleingedrucktes 14 px), Touch-Targets ≥ 44 px
- [ ] Geprüft bei 320, 430, 768, 1024, 1440 und 1920 px, keine horizontale Scrollleiste
- [ ] Buttons mit `cursor: pointer` und Zuständen hover, disabled; Fehler direkt am Feld
- [ ] Funktionen ≤ 14 Zeilen, Dateien ≤ 400 Zeilen, JSDoc an Funktionen
- [ ] Keine Secrets, kein `console.log`, kein auskommentierter Code

## Wie testen

- [ ] Schritt 1
