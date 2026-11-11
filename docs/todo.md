# ToDo

Offene Aufgaben außerhalb der Arbeitspakete. Erledigtes abhaken, nicht löschen.

## Offen bis zur Abgabe (Stand 10.11.2026)

Alles, was noch zu tun ist, an einer Stelle. Live ist `c4a23bf` (11.11.2026, mit beiden Anschriften im Impressum und Yannics Aufräum-Durchgang). Der Layout-Check ist grün auf `7c26079` (10.11.2026, 108 Kombinationen; Fehlalarm am mobil nur visuell ausgeblendeten Menükopf im Checker behoben, `2d94d17` in `dabubble-layout-check`).

### Thomas: Konsole und Daten

- [x] Regel für verwaiste Gäste aus `firestore.rules` in der Firebase-Konsole veröffentlichen (ttoebbe/dabubble#6; Thomas, 24.10.2026). Live geprüft: Das Entwicklerteam zählt nach der Anmeldung nur noch 2 Mitglieder. Danach räumt die App die Gast-Konten aus den abgebrochenen Testläufen vom 23. und 24.10.2026 beim nächsten Login selbst auf (24 Stunden nach ihrem letzten Lebenszeichen); von Hand ist nichts mehr zu löschen – Thomas
- [x] Deploy mit dem automatischen Aufräumen (ttoebbe/dabubble#6), nach der Regel: `8ffbd77`, 24.10.2026 – A
- [x] Impressum mit echten Daten füllen: Name, Anschrift und E-Mail von Thomas eingetragen (Thomas ist Betreiber, nur seine Anschrift steht im Impressum; 24.10.2026, live seit `a32ea6a`) – A
- [x] Impressum: Musterdaten durch Yannics Namen und E-Mail ersetzt (`features/legal/imprint/imprint.html`, JSDoc von `imprint.ts`, Spec 8.3; 24.10.2026, live seit `6467190`) – B
- [x] Issue ttoebbe/dabubble#5 (Restarbeiten, Vorschlag Yannic) beantwortet (24.10.2026): Zuordnung bestätigt; Upload, Gast-Konten, Impressum und Abnahme sind inzwischen erledigt oder entschieden – Thomas
- [x] Datenschutz-Entwurf (22.10.2026, `features/legal/privacy-policy/`, von Yannic am 24.10.2026 erweitert, eec8e07, live seit `6467190`) gemeinsam gelesen, passt (25.10.2026) – A, B

### Gemeinsam testen (`docs/abnahme.md`)

- [x] Konto-Punkte K1–K13 und Channel-Punkte C1–C7 mit zwei Sitzungen (Konto und Gast), Channel `abnahme-test` – bestanden im gemeinsamen Termin 24.10.2026 – A, B
- [x] Übrige Allgemein-Punkte G1–G4 sowie G6, G7, G9, G10 auf Login, Registrierung, Menü, Profil und Channel-Dialogen (auf den Chat-Seiten am 24.10. mit Gästen bestanden, S2–S4 seit 3e86b54 abgehakt) – bestanden im gemeinsamen Termin 24.10.2026 – A, B
- [x] „Neue Nachricht“ an einen Channel senden, im Channel `abnahme-test` (bisher nur an Personen live geprüft) – bestanden 24.10.2026 – Hinweis B
- [x] Tab im Adressfeld von „Neue Nachricht“ übernimmt den Vorschlag (`@ga` → `@Gast`): am 24.10. in einem Testlauf einmal nicht gegriffen, im Einzellauf schon. Lokal nicht nachstellbar (Yannic, 24.10.2026: dreimal als Gast, auch direkt nach dem Neuladen, jedes Mal `@Gast`). Wahrscheinlich gewollt: Die Adresszeile blendet andere Gäste aus, aus der Konto- oder der anderen Gast-Sitzung findet `@ga` niemanden, die Liste bleibt zu und Tab wandert weiter. Im gemeinsamen Termin 24.10.2026 bestanden – Hinweis B

### Funde aus Yannics Test vom 24.10.2026 (Bereich A)

- [x] Klickflächen im Menü (Einträge 33 px, „Neue Nachricht“ 40 px, „Channel hinzufügen“ 30 px): sichtbar so hoch wie in Figma, die Klickfläche ist über ein transparentes `::after` jeweils 44 px groß (Spec 8.5) – kein Fehler, geprüft 24.10.2026 – A
- [x] Dev-Konsole NG02955 (LCP-Bild `workspace-logo.svg` ohne `priority`) in `workspace-menu.html` und `workspace-header.html`: beide mit `priority`, 0a0c2d2, Warnung weg – A
- [x] Mobile Menü-Seite ohne `main` und ohne `h1` (axe Best Practice `landmark-one-main`, `page-has-heading-one`; kein WCAG-Verstoß): Die `h1` „Devspace“ ist mobil per `display: none` versteckt, `main` ist der ausgeblendete Chat. Gelöst in 7ddcc32: `h1` mobil nur visuell ausgeblendet; der Menü-Container hat auf der mobilen Menü-Seite die Rolle `main`, sonst `navigation` (`watchMobile` in `features/workspace/mobile-viewport.ts`). axe ohne Verstöße mobil (Menü und Chat) und am Desktop – A

### Kleinigkeiten aus dem Test vom 24.10.2026

- [x] Thread im Chat mit sich selbst: Der Kopf zeigt „Thomas“, der Chat-Kopf „Thomas (Du)“ (`thread-view.ts`, `personName`): beide nutzen jetzt `chatPersonName`, e46e144 – B
- [x] Mobile Suche: Nach „Suche schließen“ steht der Tastaturfokus auf der Seite statt auf „Gehe zu...“ (`workspace-search.ts`, `close`): Fokus geht zurück aufs Feld, 57a41e9 – Suche

### README und Doku aufräumen (Durchsicht 10.11.2026)

- [x] README als Sachstand der App umschreiben, nicht als Projektgeschichte (gemeinsame Datei, Thomas informiert Yannic; 10.11.2026, 84f4dd6) – A. Raus oder neutral formuliert:
  - Hinweis „Stand 24.10.2026“ mit Bereich A/B und Live-Commit
  - Funktionstabellen: Aufteilung nach Bereich A/B, Spalten „Checkliste“ (Konto US1 …) und „Stand“ (überall „fertig“), Verweis auf `docs/DA_Checkliste/` (Link auf GitHub tot), „Impressum: Daten von Yannic fehlen noch“ (veraltet); stattdessen eine Funktionsliste nach Themen
  - Architektur- und Routen-Diagramm: Gruppen „Bereich A – Thomas“ und „Bereich B – Yannic“, Kennzeichen „(A)“ und „(B)“; stattdessen nach Funktion gruppieren
  - Herleitungen wie „Umgesetzt nach ttoebbe/dabubble#1“ und „(ttoebbe/dabubble#6)“
  - Abschnitt „Schnittstellen zwischen den Bereichen“ streichen oder als „Zentrale Services“ ohne Bereichsbezug
  - Ordnerstruktur: Kennzeichen „A:“ und „B:“, `docs/` mit Checkliste und Arbeitsteilung
  - „Firebase-Konfiguration bekommt man von Thomas“ ersetzen durch: Web-Konfiguration des eigenen Firebase-Projekts eintragen
  - Qualität: „laut Checkliste“, „(DA-Checkliste, optional)“, axe „Stand 22.10.2026, Prüfung der Chat-Ansichten steht noch aus“ (veraltet, seit 10.11.2026 überall ohne Verstöße)
  - CI und Deploy: Teamregeln („behebt, wer gepusht hat“, „nach Absprache“) gehören in `CLAUDE.md`, nicht in die README
  - „Team und Zusammenarbeit“ auf das Team mit Namen und GitHub-Konto kürzen, Arbeitsregeln raus
  - Dokumentationstabelle: nur, was Leser brauchen (Figma-Spec, `firestore.rules`); `arbeitsteilung.md`, `einstieg.md` („für Yannic“), `todo.md`, `abnahme.md` und `CLAUDE.md` nicht mehr verlinken
- [x] Verweise auf die entfernten Ordner `docs/DA_Checkliste/` und `.claude/skills/` anpassen: `CLAUDE.md` (Quellen, „Skills im Repo“), `docs/einstieg.md`, `docs/arbeitsteilung.md`, `docs/abnahme.md`; jetzt „nur lokal“ (7ded1f4, 09d9042, 63010d9) – A

### Impressum und Datenschutz (Prüfung 10.11.2026, keine Rechtsberatung)

- [x] Verantwortlichen festlegen: Das Impressum nannte beide Namen über Thomas’ Anschrift, die Datenschutzerklärung „die im Impressum genannten Personen“. Entscheidung Thomas 10.11.2026: beide mit eigener Anschrift, gemeinsam verantwortlich nach Art. 26 DSGVO. Impressum mit zwei Anschriften, Datenschutz-Abschnitte „Verantwortlich“ und „Gemeinsame Verantwortung“, Spec 8.3, Entwurf `docs/vereinbarung-gemeinsame-verantwortung.md` (c8eced9) – A
- [x] Anschrift von Yannic im Impressum eingetragen (`features/legal/imprint/imprint.html`, 11.11.2026) – B
- [x] Vereinbarung `docs/vereinbarung-gemeinsame-verantwortung.md` lesen und unten mit Datum bestätigen (Yannic und Thomas bestätigt 11.11.2026) – A, B
- [x] Datenschutzerklärung präzisiert (`features/legal/privacy-policy/privacy-policy.ts`): Firebase Authentication läuft nur in den USA und hebt IP-Adressen einige Wochen auf (<https://firebase.google.com/support/privacy>), Firestore in Frankfurt; Bestätigungs- und Passwort-Mail; IP-Adresse an Google während der Nutzung; JSDoc nicht mehr „Draft“ – A
- [ ] Optional, Entscheidung A, B: Impressum und Datenschutz sind wie in Figma nur auf den Konto-Seiten verlinkt; im Workspace erreicht man sie nur über die Adresse `/#/impressum`. Ein Link im Profilmenü stünde nicht in Figma. Yannic 11.11.2026: kein Link, Figma-treu

### Vor der Abgabe

- [x] Skill `final-check` und der Qualitäts-Check aus `CLAUDE.md` ein letztes Mal (25.10.2026: lint, build, format grün; Browser-Checks 320–1920 px ohne Scrollleiste, Konsole lokal und live leer; Touch-Targets der Auth-Links in 086e592) – A, B
- [x] Zuordnung „Nur in Figma, nicht in der Checkliste“ in `docs/arbeitsteilung.md` bestätigen; alle Punkte sind umgesetzt (Yannic und Thomas bestätigt 11.11.2026) – A, B
- [x] `docs/DA_Checkliste/` aus dem Repo entfernen und in `.gitignore` eintragen (Material der DA) (25.10.2026, lokal behalten) – A
- [x] `.claude/skills/` aus dem Repo entfernen und in `.gitignore` eintragen (25.10.2026, lokal behalten) – A
- [x] Deploy `2d69587` (10.11.2026, auf Ansage Thomas, noch mit Yannics Musteranschrift). Live in frischem Browser ohne Anmeldung geprüft: Startseite, Impressum, Datenschutz, Login, Registrierung und Passwort vergessen bei 320 px ohne Scrollleiste, Konsole ohne Fehler und Warnungen, keine fehlgeschlagenen Anfragen. Den Workspace hat der Layout-Check mit Gäste-Login auf demselben App-Code geprüft – A
- [x] Aufräum-Durchgang über den ganzen Code mit Thomas' Freigabe (11.11.2026): verhaltensgleich `498b067`, `c7da600` (tote Exporte, doppelte Konstanten, ungenutzte Inputs); Fixes `0ba28d4` (Gast/Google während Login gesperrt), `bcbf8f1` (gleichzeitig angelegte DM), `f9e5877` (Liste springt bei Reaktionen nicht mehr nach unten). Lint, Build, Format grün, lokal mit Gast geprüft – B
- [x] Letzter Deploy `c4a23bf` (11.11.2026, auf Ansage Thomas, nach Yannics Anschrift `5e965bb` und dem Aufräum-Durchgang bis `f9e5877`). Drei Läufe scheiterten vorher, weil der GitHub-Runner `security.ubuntu.com` nicht auflösen konnte; `deploy.yml` installiert `lftp` seitdem ersatzweise über Homebrew (`c4a23bf`). Live in frischem Browser ohne Anmeldung geprüft: Impressum mit beiden Anschriften, Startseite, Datenschutz, Login, Registrierung und Passwort vergessen bei 320 px ohne Scrollleiste, Konsole ohne Fehler und Warnungen, keine fehlgeschlagenen Anfragen. Angemeldete Ansichten live nicht geprüft – A
- [ ] Beide Teammitglieder forken das Repo (DA-Checkliste) – A, B

### Blockiert oder bewusst zurückgestellt

- [ ] Auftragsverarbeitung mit Google: Die Erklärung sagt, Google verarbeite „in unserem Auftrag“. Google nennt sich in der Firebase-Doku Auftragsverarbeiter; ob dafür in der Firebase-Konsole Bedingungen zu bestätigen sind, ließ sich in der Doku nicht belegen. In den Projekteinstellungen nachsehen – Thomas Zurückgestellt (Entscheidung Thomas 11.11.2026): für die Bewertung des Lernprojekts nicht relevant; erst wichtig, falls DABubble nach der Abgabe mit echten Nutzern weiterläuft
- [ ] Reset-Mail: Aktions-URL auf `/passwort-zuruecksetzen` und Vorlage nach Figma `1898:19353` (Absender „DABubble“, Betreff „Dein Passwort zurücksetzen“, Text aus dem Mock-up; Firebase-Links gelten 1 Stunde, nicht 24). Firebase sperrt Vorlagen-Änderungen für dieses Projekt („derzeit nicht verfügbar“, 22.10.2026); bis dahin kommt die deutsche Standardmail und die Firebase-Seite setzt das Passwort. Später erneut versuchen oder Firebase-Support – A
- [ ] „reuter“ in Absender und Link der Reset-Mail (`noreply@reuter-8ac51.firebaseapp.com`, `reuter-8ac51.firebaseapp.com/__/auth/action`) und im Google-Anmeldefenster: Die Projekt-ID ist fest. Weg nur über ein neues Firebase-Projekt mit neutraler ID (Projektlimit: gelöschte Projekte zählen 30 Tage mit) oder über eine eigene Domain mit DNS-Zugriff (Absender-Domain, Aktions-URL; dafür müssen Vorlagen-Änderungen wieder gehen). Stand 22.10.2026: bleibt vorerst; Thomas hat ein weiteres Projekt gelöscht, der Platz ist frühestens ab ca. 21.11.2026 frei (vorzeitig nicht möglich) – A

## Erledigt: Einrichtung und Entwicklung

- [x] Branch-Schutz für `main`: nur Force-Push und Löschen gesperrt, beide pushen direkt – A
- [x] Deploy-Secrets setzen: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_REMOTE_DIR`, Variable `DEPLOY_PROTOCOL`; `DEPLOY_PASSWORD` setzt Thomas selbst – A
- [x] Erster Deploy (22.10.2026): SFTP lehnt die Anmeldung ab, also `DEPLOY_PROTOCOL=ftps`; `DEPLOY_HOST` ist der Servername `dd38226.kasserver.com`, weil das FTPS-Zertifikat auf `*.kasserver.com` lautet – A
- [x] Webspace wertet `.htaccess` nicht aus (Direktaufruf von `/login` gab 404, die Datei liegt nachweislich im Zielordner): Router auf Hash-URLs umgestellt, z. B. `/#/login` (Entscheidung Thomas 22.10.2026, `app.config.ts`) – A
- [x] Webspace ohne HTTPS-Zertifikat: http reicht für das Übungsprojekt, die DA wird nicht angeschrieben (Entscheidung Thomas 22.10.2026); seit spätestens 24.10.2026 leitet der Webspace http auf https mit gültigem Zertifikat um – A
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
- [x] Suche: Thread-Antworten mit durchsuchen – ohne Regeländerung: die Suche liest die Antworten jeder Nachricht mit `replyCount > 0` (23.10.2026)
- [x] Chat-Ansichten, „Neue Nachricht“ und Suche angemeldet durchklicken: Konsole, axe-core, 320–1920 px – A, B (24.10.2026: Yannic mit zwei Gästen, Thomas mit eigenem Konto; Fixes eingearbeitet)
- [x] Layout-Check um die Chat-Seiten erweitert (Channel, Chat mit sich selbst, „Neue Nachricht“, Suche mit `#`, `@` und ohne Treffer; `ttoebbe/dabubble-layout-check` becede6, 18 Seiten × 6 Viewports). Lauf 24.10.2026 grün (108 Kombinationen) nach zwei Checker-Fixes: Inline-Text überspringt Regel 3, abgebrochene Anfragen zählen nicht (3acd5dc) – A
- [x] G6, G7, G9, G10 (Hover/Disabled, Fokus, Tab/Escape, Schrift und Touch-Flächen) auf Login, Registrierung, Menü, Profil und Channel-Dialogen; Menü-Einträge 33 px, „Neue Nachricht“ 40 px, „Channel hinzufügen“ 30 px hoch – A Bestanden im gemeinsamen Termin 24.10.2026; Klickflächen siehe „Funde aus Yannics Test“.

## Im Team geklärt

- [x] Dateien hochladen (aus dem DA-Vorstellungsvideo, Hinweis Yannic 24.10.2026): wird nicht gebaut, das Projekt bleibt im Spark-Tarif (Entscheidung Thomas und Yannic 24.10.2026). Gründe: steht weder in der Checkliste noch in Figma; Firebase Storage verlangt seit 03.02.2026 für jeden Bucket den Blaze-Tarif mit Zahlungsart, im Projekt gibt es keinen Bucket. Alles andere aus dem Video (Threads, Reaktionen mit Namen, Profil bearbeiten, Hover auf Nachrichten) ist umgesetzt – A, B
- [x] „Neue Nachricht“ mit `#`: Die Checkliste (Schreiben US4) nennt „alle existierenden Kanäle“; die Liste zeigt die Channels, in denen man Mitglied ist, denn nur dort kann man schreiben (Entscheidung Thomas 24.10.2026) – A
- [x] Formulare: Signal Forms (Entscheidung 22.10.2026) – A, B
