# ToDo

Offene Aufgaben außerhalb der Arbeitspakete. Erledigtes abhaken, nicht löschen.

## Vor der Abgabe

- [ ] `docs/DA_Checkliste/` aus dem Repo entfernen und in `.gitignore` eintragen (Material der DA) – A
- [ ] Impressum und Datenschutz mit echten Inhalten füllen: Namen, Anschrift, E-Mail, Datenschutztext (Figma hat nur Platzhalter; `features/legal/`) – A, B
- [ ] `.claude/skills/` aus dem Repo entfernen und in `.gitignore` eintragen – A
- [ ] Beide Teammitglieder forken das Repo (DA-Checkliste) – A, B

## Einrichtung (Phase 0)

- [x] Branch-Schutz für `main`: nur Force-Push und Löschen gesperrt, beide pushen direkt – A
- [x] Deploy-Secrets setzen: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_REMOTE_DIR`, Variable `DEPLOY_PROTOCOL`; `DEPLOY_PASSWORD` setzt Thomas selbst – A
- [ ] Erster Deploy: prüfen, ob der DA-Webspace SFTP annimmt, sonst `DEPLOY_PROTOCOL=ftps` – A
- [ ] `.htaccess` für das Angular-Routing auf dem Webspace (Direktaufruf von Unterseiten) – A
- [x] Favicon: Angular-Logo durch das DABubble-Logo ersetzen (DA-Checkliste) – A
- [x] Design-Tokens aus `docs/Figma/spec.md` nach `src/styles/`, `public/fonts/fonts.css` einbinden – A
- [x] Shared-UI: Button, Input-Feld mit Fehleranzeige, Avatar, Dialog-Rahmen – A
- [ ] Firebase-Projekt, Vorlage `src/environments/environment.example.ts`, Datenmodell in `core/models/` – B
- [ ] Devspace-Logo exportieren (Node `237:497` mit Vektor `237:499`, das PNG ist nur der Hintergrund) – A
- [ ] Startseite: Weiterleitung `''` → `/workspace` in `app.routes.ts` auf `intro` umstellen (gemeinsame Datei, Absprache mit B); Intro führt schon zu `/login` – A
- [ ] Anmeldung an Firebase Authentication anbinden (E-Mail/Passwort, Gast, Google), bis dahin führt der Login ohne Prüfung in den Workspace – A, sobald Firebase steht
- [ ] Registrierung, Avatar und Passwort-Reset an Firebase Authentication anbinden (Konto anlegen, Avatar im Nutzer speichern, Reset-Mail mit Link auf `/passwort-zuruecksetzen`, E-Mail-Vorlage nach Figma `1898:19353`) – A, sobald Firebase steht
- [ ] Workspace-Menü: Beispiel-Einträge (`workspace-menu/menu-entries.ts`) durch `ChannelService.channels` und `UserService.users` ersetzen, Auswahl auf die Chat-Routen von B umstellen – A, sobald Firebase und Routen stehen
- [ ] Profil: „Log out“ an `AuthService` anbinden, Beispielprofil (`profile/profile-details.ts`) durch den angemeldeten Nutzer ersetzen – A, sobald Auth steht
- [ ] Profil: Avatar aus der vorgegebenen Auswahl ändern (DA-Checkliste Konto US4, im Figma-Bearbeiten-Dialog nicht vorhanden – Ort im Team klären), Namen in Firestore speichern – A
- [ ] Avatar-Komponente fluide machen (bei 320 px mit Scrollbalken wird das 200-px-Bild im Profil-Dialog gestaucht) – A, Absprache mit B (`shared/`)
- [ ] Dialoge „Channel bearbeiten“, „Mitglieder“ und „Leute hinzufügen“ (`channels/`) im Channel-Kopf einbinden – B; Mitglieder speichern – A, sobald `ChannelService` steht
- [ ] Channels in Firestore speichern: `ChannelService` statt der Liste im Workspace-Rahmen, Mitglieder des neuen Channels übernehmen – A, sobald Firebase und Datenmodell stehen
- [x] Layout-Check: privates Repo `ttoebbe/dabubble-layout-check` (aus `ttoebbe/join-layout-check`, an den Angular-Build angepasst, 5 Seiten und Zustände × 6 Viewports), lokal grün – A
- [ ] Layout-Check in Actions: `workflow/layout-check.yml` aus dem Checker-Repo nach `.github/workflows/` übernehmen (gemeinsame Datei, Absprache mit B), Secret `LAYOUT_CHECK_TOKEN` anlegen (Thomas), danach in `CLAUDE.md` „geplant“ streichen – A
- [ ] Build-Warnung „Unable to locate stylesheet fonts/fonts.css“ (beasties) und Konsolen-Warnung zum Nunito-Preload klären – A

## Im Team klären

- [ ] Zuordnung „Nur in Figma, nicht in der Checkliste“ in `docs/arbeitsteilung.md` bestätigen – A, B
- [x] Formulare: Signal Forms (Entscheidung 22.10.2026) – A, B
