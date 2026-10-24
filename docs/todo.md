# ToDo

Offene Aufgaben außerhalb der Arbeitspakete. Erledigtes abhaken, nicht löschen.

## Vor der Abgabe

- [ ] `docs/DA_Checkliste/` aus dem Repo entfernen und in `.gitignore` eintragen (Material der DA) – A
- [ ] Impressum mit echten Daten füllen: Namen, Anschrift, E-Mail von Thomas und Yannic (`features/legal/imprint/`); den Datenschutz-Entwurf (22.10.2026, `features/legal/privacy-policy/`) gemeinsam prüfen – A, B
- [ ] `.claude/skills/` aus dem Repo entfernen und in `.gitignore` eintragen – A
- [ ] Beide Teammitglieder forken das Repo (DA-Checkliste) – A, B

## Einrichtung (Phase 0)

- [x] Branch-Schutz für `main`: nur Force-Push und Löschen gesperrt, beide pushen direkt – A
- [x] Deploy-Secrets setzen: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_REMOTE_DIR`, Variable `DEPLOY_PROTOCOL`; `DEPLOY_PASSWORD` setzt Thomas selbst – A
- [x] Erster Deploy (22.10.2026): SFTP lehnt die Anmeldung ab, also `DEPLOY_PROTOCOL=ftps`; `DEPLOY_HOST` ist der Servername `dd38226.kasserver.com`, weil das FTPS-Zertifikat auf `*.kasserver.com` lautet – A
- [x] Webspace wertet `.htaccess` nicht aus (Direktaufruf von `/login` gab 404, die Datei liegt nachweislich im Zielordner): Router auf Hash-URLs umgestellt, z. B. `/#/login` (Entscheidung Thomas 22.10.2026, `app.config.ts`) – A
- [x] Webspace ohne HTTPS-Zertifikat: http reicht für das Übungsprojekt, die DA wird nicht angeschrieben (Entscheidung Thomas 22.10.2026) – A
- [x] `.htaccess` für das Angular-Routing auf dem Webspace (Direktaufruf von Unterseiten) – A
- [x] Favicon: Angular-Logo durch das DABubble-Logo ersetzen (DA-Checkliste) – A
- [x] Design-Tokens aus `docs/Figma/spec.md` nach `src/styles/`, `public/fonts/fonts.css` einbinden – A
- [x] Shared-UI: Button, Input-Feld mit Fehleranzeige, Avatar, Dialog-Rahmen – A
- [x] Firebase-Projekt, Vorlage `src/environments/environment.example.ts`, Datenmodell in `core/models/` – B, von A übernommen (22.10.2026: Projekt „DABubble“ `reuter-8ac51`, Firestore europe-west3, Anmeldung per E-Mail, Google und Gast; Datenmodell und Regeln ttoebbe/dabubble#1)
- [x] Firebase-Konfiguration lokal in `src/environments/environment.ts` und als GitHub-Secret `FIREBASE_CONFIG` (Web-Konfiguration aus der Firebase-Konsole) – Thomas; Yannic hat sie von Thomas
- [x] Datenmodell und Regeln aus ttoebbe/dabubble#1 bestätigen, `firestore.rules` ins Repo – B, 23.10.2026 (seit dem Abend auch in der Konsole)
- [x] Devspace-Logo exportiert (`public/img/logos/workspace-logo.svg`, Figma `237:497` über die UI) – A
- [x] Startseite: `''` → `/intro` → `/login` (`app.routes.ts`, Freigabe Thomas 22.10.2026, Yannic informiert Thomas) – A
- [x] Anmeldung an Firebase Authentication anbinden (E-Mail/Passwort, Gast, Google), bis dahin führt der Login ohne Prüfung in den Workspace – A, sobald Firebase steht
- [x] Registrierung, Avatar und Passwort-Reset an Firebase Authentication anbinden (Konto anlegen, Avatar im Nutzer speichern, Reset-Mail) – A
- [ ] Reset-Mail: Aktions-URL auf `/passwort-zuruecksetzen` und Vorlage nach Figma `1898:19353` (Absender „DABubble“, Betreff „Dein Passwort zurücksetzen“, Text aus dem Mock-up; Firebase-Links gelten 1 Stunde, nicht 24). Firebase sperrt Vorlagen-Änderungen für dieses Projekt („derzeit nicht verfügbar“, 22.10.2026); bis dahin kommt die deutsche Standardmail und die Firebase-Seite setzt das Passwort. Später erneut versuchen oder Firebase-Support – A
- [ ] „reuter“ in Absender und Link der Reset-Mail (`noreply@reuter-8ac51.firebaseapp.com`, `reuter-8ac51.firebaseapp.com/__/auth/action`) und im Google-Anmeldefenster: Die Projekt-ID ist fest. Weg nur über ein neues Firebase-Projekt mit neutraler ID (Projektlimit: gelöschte Projekte zählen 30 Tage mit) oder über eine eigene Domain mit DNS-Zugriff (Absender-Domain, Aktions-URL; dafür müssen Vorlagen-Änderungen wieder gehen). Stand 22.10.2026: bleibt vorerst; Thomas hat ein weiteres Projekt gelöscht, der Platz ist frühestens ab ca. 21.11.2026 frei (vorzeitig nicht möglich) – A
- [x] Workspace-Menü: Beispiel-Einträge (`workspace-menu/menu-entries.ts`) durch `ChannelService.channels` und `UserService.users` ersetzen – A
- [x] Workspace-Menü: Auswahl, „Neue Nachricht“ und „Nachricht“ im Profil führen über die Chat-Routen von B (`/workspace/channel/:channelId`, `/workspace/dm/:uid`, `/workspace/new-message`); der markierte Eintrag folgt der URL – A, 23.10.2026
- [x] Profil: „Log out“ an `AuthService` anbinden, Beispielprofil (`profile/profile-details.ts`) durch den angemeldeten Nutzer ersetzen – A, sobald Auth steht
- [x] Profil: Name und Avatar in Firestore speichern (Auswahl im Bearbeiten-Dialog steht) – A, sobald Firebase steht
- [x] Avatar-Komponente fluide machen (bei 320 px mit Scrollbalken wird das 200-px-Bild im Profil-Dialog gestaucht): Breite höchstens 100 %, Seitenverhältnis 1 (Freigabe Thomas 22.10.2026) – A
- [x] Dialoge „Channel bearbeiten“, „Mitglieder“ und „Leute hinzufügen“ aus dem Channel-Kopf öffnen: `ChannelDialogs.open(channelId, 'settings' | 'members' | 'add-members')` – B, 23.10.2026
- [x] Profil einer Person aus Nachricht oder Erwähnung öffnen: `ProfileViewer.show(uid)` – B, 23.10.2026
- [x] Channels in Firestore speichern: `ChannelService` statt der Liste im Workspace-Rahmen, Mitglieder des neuen Channels übernehmen – A, sobald Firebase und Datenmodell stehen
- [x] Layout-Check: privates Repo `ttoebbe/dabubble-layout-check` (aus `ttoebbe/join-layout-check`, an den Angular-Build angepasst, 5 Seiten und Zustände × 6 Viewports), lokal grün – A
- [x] Layout-Check-Workflow nach `.github/workflows/layout-check.yml` übernommen (Freigabe Thomas 22.10.2026) – A
- [x] Secret `LAYOUT_CHECK_TOKEN` angelegt (Thomas), erster Lauf in Actions grün (72 Kombinationen, 22.10.2026), `CLAUDE.md` angepasst – A
- [x] Layout-Check: Der Workspace verlangt jetzt eine Anmeldung; der Checker meldet sich einmal pro Lauf als Gast an und am Ende wieder ab (Entscheidung Thomas 22.10.2026; der Build braucht `environment.ts`, die Workflow-Vorlage schreibt sie aus `FIREBASE_CONFIG`) – A
- [x] Build-Warnung: Initial-Bundle 850 kB über dem Budget von 500 kB (Firebase); Budget in `angular.json` auf Warnung 1 MB, Fehler 1,5 MB angehoben (Entscheidung Thomas 22.10.2026) – A
- [x] Firebase-Projekt aufräumen: alte Konten, Realtime Database und App „ReuterSandUndKies“ aus dem Reuter-Projekt gelöscht (22.10.2026; Storage war nicht aktiv) – Thomas
- [x] Gast-Konten beim Log out löschen (anonymes Konto und Profil, Firestore-Regel `allow delete` für Gäste; Entscheidung Thomas 22.10.2026) – A
- [x] Nachrichten gelöschter Gäste anzeigen (Autor-`uid` ohne Profil): „Gast“ mit Platzhalter-Avatar – B, 23.10.2026
- [x] Build-Warnung „Unable to locate stylesheet fonts/fonts.css“ (beasties): `data-beasties-skip` am Link – A
- [x] Konsolen-Warnung zum Nunito-Preload: das Intro lädt die Schrift schon während der Animation – A
- [ ] Vier Gast-Konten aus einem abgebrochenen Testlauf (23.10.2026) löschen: Authentication und `users`, dazu aus `channels/entwicklerteam` → `memberIds` entfernen – Thomas in der Firebase-Konsole
- [x] Suche: Thread-Antworten mit durchsuchen – ohne Regeländerung: die Suche liest die Antworten jeder Nachricht mit `replyCount > 0` (23.10.2026)
- [ ] Chat-Ansichten, „Neue Nachricht“ und Suche angemeldet durchklicken: Konsole, axe-core, 320–1920 px – A, B
- [ ] Layout-Check um die Chat-Seiten erweitert (Channel, Chat mit sich selbst, „Neue Nachricht“, Suche mit `#`, `@` und ohne Treffer; `ttoebbe/dabubble-layout-check` becede6, 18 Seiten × 6 Viewports). Offen: erster Lauf mit Gäste-Login (Thomas startet) – A

## Im Team klären

- [x] „Neue Nachricht“ mit `#`: Die Checkliste (Schreiben US4) nennt „alle existierenden Kanäle“; die Liste zeigt die Channels, in denen man Mitglied ist, denn nur dort kann man schreiben (Entscheidung Thomas 24.10.2026) – A

- [ ] Zuordnung „Nur in Figma, nicht in der Checkliste“ in `docs/arbeitsteilung.md` bestätigen – A, B
- [x] Formulare: Signal Forms (Entscheidung 22.10.2026) – A, B
