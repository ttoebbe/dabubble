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
- [x] `.htaccess` für das Angular-Routing auf dem Webspace (Direktaufruf von Unterseiten) – A
- [x] Favicon: Angular-Logo durch das DABubble-Logo ersetzen (DA-Checkliste) – A
- [x] Design-Tokens aus `docs/Figma/spec.md` nach `src/styles/`, `public/fonts/fonts.css` einbinden – A
- [x] Shared-UI: Button, Input-Feld mit Fehleranzeige, Avatar, Dialog-Rahmen – A
- [x] Firebase-Projekt, Vorlage `src/environments/environment.example.ts`, Datenmodell in `core/models/` – B, von A übernommen (22.10.2026: Projekt „DABubble“ `reuter-8ac51`, Firestore europe-west3, Anmeldung per E-Mail, Google und Gast; Datenmodell und Regeln ttoebbe/dabubble#1)
- [ ] Firebase-Konfiguration lokal in `src/environments/environment.ts` und als GitHub-Secret `FIREBASE_CONFIG` (Web-Konfiguration aus der Firebase-Konsole) – Thomas; Yannic bekommt sie von Thomas
- [ ] Datenmodell und Regeln aus ttoebbe/dabubble#1 bestätigen, `firestore.rules` ins Repo (die Regeln stehen bisher nur in der Konsole) – B
- [x] Devspace-Logo exportiert (`public/img/logos/workspace-logo.svg`, Figma `237:497` über die UI) – A
- [x] Startseite: `''` → `/intro` → `/login` (`app.routes.ts`, Freigabe Thomas 22.10.2026, Yannic informiert Thomas) – A
- [x] Anmeldung an Firebase Authentication anbinden (E-Mail/Passwort, Gast, Google), bis dahin führt der Login ohne Prüfung in den Workspace – A, sobald Firebase steht
- [x] Registrierung, Avatar und Passwort-Reset an Firebase Authentication anbinden (Konto anlegen, Avatar im Nutzer speichern, Reset-Mail) – A
- [ ] Reset-Mail: Aktions-URL auf `/passwort-zuruecksetzen` und Vorlage nach Figma `1898:19353` (Absender „DABubble“, Betreff „Dein Passwort zurücksetzen“, Text aus dem Mock-up; Firebase-Links gelten 1 Stunde, nicht 24). Firebase sperrt Vorlagen-Änderungen für dieses Projekt („derzeit nicht verfügbar“, 22.10.2026); bis dahin kommt die deutsche Standardmail und die Firebase-Seite setzt das Passwort. Später erneut versuchen oder Firebase-Support – A
- [ ] „reuter“ in Absender und Link der Reset-Mail (`noreply@reuter-8ac51.firebaseapp.com`, `reuter-8ac51.firebaseapp.com/__/auth/action`) und im Google-Anmeldefenster: Die Projekt-ID ist fest. Weg nur über ein neues Firebase-Projekt mit neutraler ID (Projektlimit: gelöschte Projekte zählen 30 Tage mit) oder über eine eigene Domain mit DNS-Zugriff (Absender-Domain, Aktions-URL; dafür müssen Vorlagen-Änderungen wieder gehen). Stand 22.10.2026: bleibt vorerst; Thomas hat ein weiteres Projekt gelöscht, der Platz ist frühestens ab ca. 21.11.2026 frei (vorzeitig nicht möglich) – A
- [x] Workspace-Menü: Beispiel-Einträge (`workspace-menu/menu-entries.ts`) durch `ChannelService.channels` und `UserService.users` ersetzen – A
- [ ] Workspace-Menü: Auswahl (und „Nachricht“ im Profil) auf die Chat-Routen von B umstellen – A, sobald B die Routen hat
- [x] Profil: „Log out“ an `AuthService` anbinden, Beispielprofil (`profile/profile-details.ts`) durch den angemeldeten Nutzer ersetzen – A, sobald Auth steht
- [x] Profil: Name und Avatar in Firestore speichern (Auswahl im Bearbeiten-Dialog steht) – A, sobald Firebase steht
- [x] Avatar-Komponente fluide machen (bei 320 px mit Scrollbalken wird das 200-px-Bild im Profil-Dialog gestaucht): Breite höchstens 100 %, Seitenverhältnis 1 (Freigabe Thomas 22.10.2026) – A
- [ ] Dialoge „Channel bearbeiten“, „Mitglieder“ und „Leute hinzufügen“ aus dem Channel-Kopf öffnen: `ChannelDialogs.open(channelId, 'settings' | 'members' | 'add-members')` – B; Anzeige und Speichern stehen (A, 22.10.2026)
- [ ] Profil einer Person aus Nachricht oder Erwähnung öffnen: `ProfileViewer.show(uid)` – B; Dialog steht (A, 22.10.2026)
- [x] Channels in Firestore speichern: `ChannelService` statt der Liste im Workspace-Rahmen, Mitglieder des neuen Channels übernehmen – A, sobald Firebase und Datenmodell stehen
- [x] Layout-Check: privates Repo `ttoebbe/dabubble-layout-check` (aus `ttoebbe/join-layout-check`, an den Angular-Build angepasst, 5 Seiten und Zustände × 6 Viewports), lokal grün – A
- [ ] Layout-Check in Actions: `workflow/layout-check.yml` aus dem Checker-Repo nach `.github/workflows/` übernehmen (gemeinsame Datei, Absprache mit B), Secret `LAYOUT_CHECK_TOKEN` anlegen (Thomas), danach in `CLAUDE.md` „geplant“ streichen – A
- [x] Layout-Check: Der Workspace verlangt jetzt eine Anmeldung; der Checker meldet sich einmal pro Lauf als Gast an und am Ende wieder ab (Entscheidung Thomas 22.10.2026; der Build braucht `environment.ts`, die Workflow-Vorlage schreibt sie aus `FIREBASE_CONFIG`) – A
- [x] Build-Warnung: Initial-Bundle 850 kB über dem Budget von 500 kB (Firebase); Budget in `angular.json` auf Warnung 1 MB, Fehler 1,5 MB angehoben (Entscheidung Thomas 22.10.2026) – A
- [x] Firebase-Projekt aufräumen: alte Konten, Realtime Database und App „ReuterSandUndKies“ aus dem Reuter-Projekt gelöscht (22.10.2026; Storage war nicht aktiv) – Thomas
- [x] Gast-Konten beim Log out löschen (anonymes Konto und Profil, Firestore-Regel `allow delete` für Gäste; Entscheidung Thomas 22.10.2026) – A
- [ ] Nachrichten gelöschter Gäste anzeigen (Autor-`uid` ohne Profil) – B
- [x] Build-Warnung „Unable to locate stylesheet fonts/fonts.css“ (beasties): `data-beasties-skip` am Link – A
- [x] Konsolen-Warnung zum Nunito-Preload: das Intro lädt die Schrift schon während der Animation – A

## Im Team klären

- [ ] Zuordnung „Nur in Figma, nicht in der Checkliste“ in `docs/arbeitsteilung.md` bestätigen – A, B
- [x] Formulare: Signal Forms (Entscheidung 22.10.2026) – A, B
