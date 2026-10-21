# ToDo

Offene Aufgaben außerhalb der Arbeitspakete. Erledigtes abhaken, nicht löschen.

## Vor der Abgabe

- [ ] `docs/DA_Checkliste/` aus dem Repo entfernen und in `.gitignore` eintragen (Material der DA) – A
- [ ] `.claude/skills/` aus dem Repo entfernen und in `.gitignore` eintragen – A
- [ ] Beide Teammitglieder forken das Repo (DA-Checkliste) – A, B

## Einrichtung (Phase 0)

- [ ] Branch-Schutz für `main` nach dem ersten Push: Merge nur per PR, ein Review, CI grün – A
- [ ] Deploy-Secrets setzen: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_REMOTE_DIR`, Variable `DEPLOY_PROTOCOL`; `DEPLOY_PASSWORD` setzt Thomas selbst – A
- [ ] Erster Deploy: prüfen, ob der DA-Webspace SFTP annimmt, sonst `DEPLOY_PROTOCOL=ftps` – A
- [ ] `.htaccess` für das Angular-Routing auf dem Webspace (Direktaufruf von Unterseiten) – A
- [ ] Favicon: Angular-Logo durch das DABubble-Logo ersetzen (DA-Checkliste) – A
- [ ] Design-Tokens aus `docs/Figma/spec.md` nach `src/styles/`, `public/fonts/fonts.css` einbinden – A
- [ ] Shared-UI: Button, Input-Feld mit Fehleranzeige, Avatar, Dialog-Rahmen – A
- [ ] Firebase-Projekt, Vorlage `src/environments/environment.example.ts`, Datenmodell in `core/models/` – B
- [ ] Layout-Check: privates Repo `ttoebbe/dabubble-layout-check` aus `ttoebbe/join-layout-check` ableiten, an Angular anpassen, Workflow `layout-check.yml` (nur `workflow_dispatch`, Secret `LAYOUT_CHECK_TOKEN`) – A, sobald die ersten Screens stehen

## Im Team klären

- [ ] Zuordnung „Nur in Figma, nicht in der Checkliste“ in `docs/arbeitsteilung.md` bestätigen – A, B
- [ ] Formulare: Signal Forms (Angular-Vorgabe in `.claude/CLAUDE.md`) oder Reactive Forms (Skill `angular-forms`) – A, B
