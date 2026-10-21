---
name: figma-extract
description: >
  Figma-Daten ziehen, Figma extrahieren, Spec aus Figma erstellen, Design-Spec oder spec.md
  aus Figma, Farben, Schriften, Icons, Bilder oder Referenz-Screenshots aus Figma holen, Figma
  REST API, File-Key, Figma-Token, extract figma, pull design data from figma — Zieht die
  eigene Figma-Kopie eines Projekts per REST-API mit persönlichem Token (nicht über den
  Figma-MCP) in einen lokalen Cache und erstellt daraus spec.md, components.md, Assets mit
  MANIFEST und Referenz-Screenshots, abgeglichen mit Lastenheft oder DA-Checkliste. Verwenden,
  sobald Design-Daten aus Figma ins Projekt sollen oder eine Spec aus Figma neu entsteht oder
  ergänzt wird, auch wenn nur „hol die Icons aus Figma“ gesagt wird. Nicht für das Umsetzen
  einer fertigen Spec in Code und nicht zum Schreiben nach Figma.
---

# Figma-Extraktion per REST-API

Ziel: eine Spec, die jeden Design-Wert mit seiner Herkunft (Node-ID) belegt. Nichts wird
geschätzt; Lücken und Widersprüche werden gesammelt, nicht aufgelöst. Ergebnis:
`spec.md`, `components.md`, `MANIFEST.md`, Referenz-Screenshots und Assets. Die Rohdaten
bleiben lokal in `.figma-cache/`.

Nur auf ausdrücklichen Auftrag starten. Projektregeln wie „Figma nicht selbst abfragen“
meinen Abfragen ohne Auftrag – der Aufruf dieses Skills ist der Auftrag.

## Eingaben

| Parameter       | Pflicht | Herkunft / Standard                                                                                                                                                                                                                                                                                                                                                                    |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FILE_KEY`      | ja      | URL der **eigenen Kopie**: `figma.com/design/<FILE_KEY>/…` – nie der Akademie-Originallink                                                                                                                                                                                                                                                                                             |
| `REQUIREMENTS`  | ja      | Lastenheft oder Checkliste (Pfad)                                                                                                                                                                                                                                                                                                                                                      |
| `SPEC_DIR`      | ja      | Ordner für `spec.md`, `components.md`, `MANIFEST.md`                                                                                                                                                                                                                                                                                                                                   |
| `REFERENCE_DIR` | nein    | `<SPEC_DIR>/reference/`                                                                                                                                                                                                                                                                                                                                                                |
| `ASSETS_DIR`    | ja      | Asset-Wurzel mit `icons/`, `images/`, `logos/`, `fonts/` (Angular: `public/` oder `src/assets/`). Unterordner nach Projektkonvention; die DA-Checkliste verlangt einen Bilderordner `img` (DABubble: `public/img/{icons,logos,avatars,emojis}`, `public/fonts/`). Existiert das Angular-Projekt noch nicht, trotzdem `public/` anlegen und beim späteren Anlegen des Projekts erhalten |
| `TOKEN_FILE`    | nein    | `$HOME/.figma-token`, außerhalb jedes Repos                                                                                                                                                                                                                                                                                                                                            |
| `CACHE_DIR`     | nein    | `.figma-cache/` in der Projektwurzel                                                                                                                                                                                                                                                                                                                                                   |

Erst selbst suchen, dann fragen: Die Projekt-`CLAUDE.md` nennt oft Spec-Pfad und
Referenzordner (DABubble: `docs/Figma/spec.md`, `docs/Figma/reference/`), `angular.json`
den Asset-Ordner, `docs/` das Anforderungsdokument. Was dann noch fehlt – meist nur der
File-Key – in **einer** gebündelten Frage (max. 4) mit Antwortoptionen klären. Branch-,
PR- und Zuständigkeitsregeln des Projekts gelten auch für die Ergebnisdateien.

Befehle führst du selbst aus. Thomas tippt nur den Token-Schritt aus
[references/setup.md](references/setup.md), weil du den Token nicht kennen darfst.

## Der Token

Er gibt Lesezugriff auf alle Figma-Dateien des Kontos. Deshalb:

- Er liegt außerhalb jedes Repos in `TOKEN_FILE`. Nie ins Projekt kopieren, nie mit Read
  oder `cat` öffnen, nie ausgeben – auch `set -x` und `curl -v` drucken ihn mit.
- Nur in eine Shell-Variable lesen, **im selben Befehl** wie der Aufruf (das Bash-Tool
  behält keine Variablen zwischen Aufrufen):
  - Git Bash: `t=$(tr -d '\r\n' < "$HOME/.figma-token") && curl -s … -H "X-Figma-Token: $t" …`
  - PowerShell: `$t = (Get-Content "$HOME\.figma-token" -Raw).Trim(); curl.exe -s … -H "X-Figma-Token: $t" …`
    – `curl` ohne `.exe` ist dort ein Alias für `Invoke-WebRequest`.
  - `tr -d` bzw. `.Trim()` entfernen einen angehängten Zeilenumbruch, der sonst 403 erzeugt.
- Den Header nur an `api.figma.com` schicken. Download-URLs (Figma-S3, Google Fonts,
  GitHub) brauchen keinen Token.
- Fehlt die Datei oder ist der Token abgelaufen: abbrechen und Thomas nach setup.md einen
  neuen anlegen lassen.

## API-Budget (Starter-Plan)

Gemessen am 21.10.2026 (DABubble): Nach 3 × `GET /v1/files` und 6 × `GET /v1/images` antwortete
die API mit `429`, `Retry-After: 399126` (≈ 4,6 Tage), `x-figma-plan-tier: starter`,
`x-figma-rate-limit-type: low`. Für eine Extraktion stehen also **etwa 9 Tier-1-Aufrufe**
zur Verfügung (der 10. wurde abgelehnt), danach ist tagelang Schluss. Offen ist, ob das
Budget je Datei oder je Konto gilt – beim Join-Projekt im August 2026 liefen noch mehr als
zehn Aufrufe durch. Deshalb:

- Vor dem ersten Aufruf planen und im Bericht zählen: 1 × `GET /v1/files` (zugleich
  Zugriffstest), 1 × `GET /v1/files/<KEY>/images` (Tier 2), **ein** SVG-Export für alle
  Vektoren, der Rest für Referenz-Screenshots – wichtigste Screens zuerst.
- **Nie `--retry` gegen api.figma.com:** curl wartet den `Retry-After` ab, auf dem
  Starter-Plan also Tage – der Lauf hängt. Bei 429 Header sichern (`-D`), Wartezeit nennen,
  abbrechen.
- Keine Probe-Renders (etwa Figma-Icons zum Stilvergleich) über die API, keine doppelten
  Aufrufe für dieselben Daten. Alles, was der Cache beantwortet, nicht erneut abfragen.
- Ist das Budget weg: Rest nach Ablauf von `Retry-After` fortsetzen oder Thomas die
  Referenzbilder manuell exportieren lassen (Schritt 8).

## Ablauf

Reihenfolge verbindlich. Zwischen den Phasen nicht auf Freigabe warten – außer beim
Abbruch in Schritt 0. Alle Befehle (Git Bash und PowerShell): [references/api.md](references/api.md).

### Phase 1 – Anforderungen lesen, vor Figma

`REQUIREMENTS` vollständig lesen und daraus eine Prüfliste machen: Seiten, Funktionen,
Zustände (leer, Fehler, Laden, Erfolg), responsive Vorgaben samt Mindestbreite,
Barrierefreiheit, Tech-Stack. Dazu die Projektregeln aus `CLAUDE.md` (Mindestschriftgröße,
Touch-Targets, Kontrast, keine Layout-Shifts). Phase 3 prüft gegen diese Liste.

### Phase 2 – Extraktion, Schritte 0–8

**Vorbereitung:** `CACHE_DIR` anlegen. Existiert `.git`, vorher `.figma-cache/` (und
`.figma-token` als Sicherheitsnetz) in `.git/info/exclude` eintragen und mit
`git check-ignore` prüfen – **bevor** irgendetwas gestaged wird. `.git/info/exclude`
statt `.gitignore`, weil der Cache nur lokal existiert und im Repo keine Spur hinterlassen
soll. Ohne Repo: nach `git init` vor dem ersten `git add` nachholen und im Bericht als
offen melden.

**Schritt 0 – Zugriffstest.** Gleich der volle Abruf `GET /v1/files/<KEY>` aus Schritt 1
(ein eigener `?depth=1`-Test kostet einen der knappen Tier-1-Aufrufe), Statuscode und Header
getrennt ausgeben.

| Ergebnis                 | Ursache                                                                                                | Reaktion                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| 200, `role` owner/editor | in Ordnung                                                                                             | Seiten (CANVAS `id`, `name`) notieren, weiter                                 |
| 200, `role` viewer       | fremde Datei                                                                                           | warnen: mit der eigenen Kopie arbeiten                                        |
| 403                      | Token abgelaufen oder widerrufen, Datei leer, falscher Scope                                           | **abbrechen**, Feld `err` nennen, auf setup.md verweisen                      |
| 404                      | falscher File-Key, meist der Originallink statt der eigenen Kopie (Node-IDs ändern sich beim Kopieren) | **abbrechen**, Key aus der URL der eigenen Kopie verlangen                    |
| 429                      | Budget aufgebraucht (Starter: Sperre über Tage)                                                        | **abbrechen**, `Retry-After` in Datum umrechnen und nennen, nicht wiederholen |
| 000 / curl-Fehler        | kein Netz, oder die Umgebung sperrt api.figma.com (Cloud)                                              | **abbrechen**, lokal ausführen                                                |

Nach einem Abbruch nicht auf Figma-MCP, Browser-Automatisierung oder Schätzen ausweichen.

**Schritt 1 – Rohdaten cachen und analysieren.** `GET /v1/files/<KEY>` → `file.json`,
`GET /v1/files/<KEY>/images` → `image-fills.json` (imageRef → URL der Originaldatei).
`file.json` enthält alle Design-Daten samt Style-Map; `/v1/files/<KEY>/styles` auslassen –
der Endpunkt verlangt einen anderen Scope (403 `Invalid scope`) und bringt nichts dazu.
Liegt schon ein `file.json` vor und hat Thomas die Datei seither nicht geändert, nicht neu
laden – jeder Abruf kostet Budget. Die `version` steht im vorhandenen `file.json`.
Dann:

```bash
python ".claude/skills/figma-extract/scripts/analyze_cache.py" .figma-cache
```

Ergebnis in `.figma-cache/analysis/`: `overview`, `colors`, `typography`, `effects`,
`grids`, `radii`, `frames`, `components`, `notes` (Markdown) und `exports.json` (Frames,
Image-Fills, Vektor-Kandidaten). Ab hier gegen den Cache arbeiten; jeder weitere
API-Aufruf braucht einen Grund. `file.json` nie ganz in den Kontext laden (oft > 10 MB),
Detailfragen per Python auf einzelne Node-IDs. Den Cache nach dem Lauf behalten: spätere
Nachfragen kosten dann keinen Aufruf.

**Schritt 2 – Anleitungen zuerst.** `notes.md` ist eine Heuristik und enthält auch
UI-Text. Echte Hinweise des Design-Teams (Breakpoints, Verhalten, Sonderfälle, „only
enabled when …“) **wörtlich und vollständig** übernehmen, Übersetzung nur zusätzlich. Dort
stehen Regeln, die sonst nirgends stehen.

**Schritt 3 – Foundations** aus `colors`, `typography`, `effects`, `grids`, `radii`:

- Farbstile mit Name **und** Ist-Wert. Stilnamen sind oft falsch (Join: „main color“ war
  `#4589FF`, mehrere gleichnamige Stile mit verschiedenen Werten).
- Textstile mit Gruppen, dazu die tatsächlich verwendeten Familien und Weights – das ist
  die Einkaufsliste für Schritt 6C.
- Layout-Grids nachrechnen (Spalten × Breite + Gutter) und notieren, auf welchen Frames sie
  wirklich liegen; oft passen sie zu keinem.
- Schatten als eigene Liste. Radien-Übersicht: bei mehr als drei Werten festhalten, dass
  ein einzelnes Radius-Token nicht trägt.
- Figma-Helfer sind keine UI-Werte: `#9747FF` und Radius 5 px an COMPONENT_SET-Rahmen,
  `#D9D9D9`-Bounding-Boxes in Icons, Grid-Farben.
- Variablen: `/variables/local` gibt es nur im Enterprise-Plan. `boundVariables` zeigt nur,
  dass welche gebunden sind; die Werte stehen trotzdem an den Nodes.

**Schritt 4 – Frames und Breakpoints.** `frames.md` gruppiert nach Breite; daraus die Tiers
(mobil, desktop, widescreen) ableiten und Arbeitsflächen (Design-System-Canvases) von Screens
trennen. Ausdrücklich notieren, welche Viewport-Bereiche **kein** Artboard abdeckt – das
sind Implementierungsentscheidungen, keine Vorgaben. App-Rahmen (Sidebar, Header, Content)
aus einem repräsentativen Screen; der Wert der platzierten Instanz gilt vor dem der
freistehenden Komponente.

**Schritt 5 – Komponenten.** `analysis/components.md` als vollständiges Inventar nach
`<SPEC_DIR>/components.md` übernehmen. Maßgeblich ist die **Variante**, nie das Set (das ist
nur Figmas Container). In der Spec die zuerst gebrauchten Teile (Buttons, Inputs, Cards,
Navigation) mit allen Varianten nebeneinander. Fehlende Zustände (focus, error, disabled) als
„not defined in Figma“; eine Strichstärke, die zwischen Zuständen wechselt, als
Layout-Shift-Risiko. Weicht der Datei-Header vom Node-Baum ab (Bibliotheks-Komponenten),
gilt der Node-Baum.

**Schritt 6 – Assets**, drei getrennte Wege:

- **A Vektoren** (`exports.json` → `vector_assets`): `GET /v1/images/<KEY>?ids=…&format=svg`.
  Bei `material_hint: true` die Material Symbols direkt aus `google/material-design-icons`
  holen – saubere Pfade ohne Masken-Artefakte. Den Stil (Outlined, Rounded, Sharp, gefüllt)
  nicht raten: Outlined und Rounded laden und mit einem Referenzbild der Icon-Übersicht der
  Datei vergleichen (DABubble: Rounded, `send` gefüllt). Vergleichsseite über
  `python -m http.server` öffnen, `file://` blockiert Playwright.
  Alle übrigen Vektoren in **einem** `/v1/images`-Aufruf exportieren. Liefert die API `null` (Node versteckt,
  `hidden: true`, oder unsichtbar im Startzustand einer Animation), erst eine sichtbare
  Instanz oder Schwester-Variante nehmen; sonst die Pfade über
  `GET /v1/files/<KEY>/nodes?ids=…&geometry=paths` rekonstruieren. Sind die Glyphen einer
  sichtbaren Variante identisch und nur die Farbe anders, die Datei ableiten und im MANIFEST
  als „derived“ kennzeichnen.
- **B Rasterbilder** (`image_fills`): nur die imageRefs aus `exports.json` → `image_fills`
  laden – `image-fills.json` listet alle je hochgeladenen Bilder (DABubble: 47, davon 4 in
  Gebrauch). Die Originaldatei laden, nicht
  über `/v1/images` rendern – das skaliert auf die Anzeigegröße. Format und Pixelmaß mit
  `scripts/image_sizes.py` bestimmen (die URLs haben keine Endung). Ist das Original kleiner
  als die Anzeigegröße: Qualitätsrisiko in der Spec. Die URLs laufen nach etwa 14 Tagen ab.
- **C Fonts:** jede verwendete Familie auf Google Fonts prüfen, die verwendeten Weights als
  woff2 nach `<ASSETS_DIR>/fonts/` plus `fonts.css`. Nicht frei verfügbar: offener Punkt mit
  nächstliegender freier Alternative, nicht still ersetzen. Reine Canvas-Schriften
  (Notizen, Thumbnails) nicht laden.

Dateinamen in kebab-case aus Frame- und Node-Namen, nicht aus Figmas Variantensyntax
(`Property 1=Hover` im Set „search“ → `search-hover.svg`). Jede Datei kommt in
`<SPEC_DIR>/MANIFEST.md`: Datei, Quell-Node-ID, Originalmaß, Anzeigemaß, Format, Herkunft.

**Schritt 7 – Spec schreiben** nach [references/spec-template.md](references/spec-template.md).
Sprache Englisch; Notizen im Original plus englische Übersetzung. Nur dokumentieren, was aus
der Datei kommt; Unbekanntes als **not defined in Figma**; Widersprüche mit allen Kandidaten
und Node-IDs sammeln, nicht auflösen.

**Schritt 8 – Referenz-Screenshots.** Je sichtbarem Top-Level-Frame (`top_level_frames`,
`hidden: false`) `GET /v1/images/<KEY>?ids=…&format=png&scale=1` nach `REFERENCE_DIR`.
Reihenfolge nach Nutzen, nicht nach Größe: erst die Screens (Desktop, dann Mobil), dann
Dialoge und Overlays, die Design-System-Canvases zuletzt. Pakete so groß wie möglich (bis
etwa 10 Screens), weil jedes Paket ein Tier-1-Aufruf ist. Versteckte Frames rendern nicht
→ Spec 6.7. Bei 429: abbrechen (siehe API-Budget) und den Rest offen melden.
Ersatz ohne API-Kontingent (DABubble: 67 Bilder, erprobt): der Export-Bereich der Figma-Oberfläche,
über Claude in Chrome (Skill `chrome-browser`) oder von Thomas selbst. Downloads nur nach seiner
Freigabe (Dateiname, Quelle, Größe nennen).

1. Eigene Kopie öffnen, je Seite auf eine leere Canvas-Stelle klicken, `Strg+A` (alle
   Top-Level-Ebenen der Seite).
2. Rechts **Export** → `+` („Exporteinstellungen hinzufügen“) → 1x PNG → „<n> Ebenen exportieren“.
   Mehrere Ebenen kommen als `<Dateiname>.zip`, eine einzelne als PNG in den Download-Ordner.
   Bei großen Canvases friert der Tab kurz ein – auf die Datei im Download-Ordner warten.
3. Danach die Export-Einstellung mit `−` („Entfernen“) wieder löschen; sie wird in der Datei gespeichert.
4. ZIP mit Python `zipfile` lesen statt entpacken: Windows unterscheidet keine Groß-/Kleinschreibung,
   „Channel edition.png“ und „Channel Edition.png“ überschreiben sich sonst.
5. Zuordnung Eintrag → Node-ID über Namen und Pixelmaß: `|` wird zu `_`, doppelte Namen bekommen
   `-1`, `-2` …, die erste Ebene ohne Suffix. Schlagschatten vergrößern das Bild (Schatten
   0/6/10 → +20 px), Instanz-Frames werden nicht beschnitten. Bleiben Kandidaten mehrdeutig, die
   Bilder ansehen und mit den Texten der Nodes im Cache vergleichen.
6. Mit dem Schema aus api.md nach `REFERENCE_DIR` schreiben und die Quelle („UI export“) je
   Bild in Spec-Abschnitt 3 nennen.

### Phase 3 – Abgleich Anforderungen ↔ Design

Die Prüfliste aus Phase 1 gegen die Spec halten: Was verlangt die Anforderung, das im Design
fehlt (typisch: Fehler-, Lade-, Leer- und Erfolgszustände, Focus, E-Mails)? Was zeigt das
Design, das nicht verlangt ist? Wo kollidiert das Design mit einer Projektregel (Schrift
unter 16 px, Touch-Target unter 44 px, Kontrast unter 4,5 : 1, Mindestbreite ohne Artboard)?
Alles in Spec-Abschnitt 6, jeweils beide Seiten, nichts still entscheiden.

### Phase 4 – Bericht

Kurz im Chat: Umfang (Seiten, Frames, Komponenten-Sets, Assets, Referenzbilder), Zahl der
API-Aufrufe je Endpunkt samt 429-Sperre, die wichtigsten Widersprüche und Lücken aus Abschnitt 6, Entscheidungen für
Thomas. Nichts committen ohne Auftrag; vor einem Commit mit `git status` sicherstellen,
dass weder `.figma-cache/` noch ein Token dabei ist.

## Fallback

Figma-MCP nur für einen einzelnen gezielten Abruf, wenn REST nicht geht und Thomas zustimmt:
Auf dem Starter-Plan gibt es nur etwa 6 MCP-Aufrufe im Monat – für eine Extraktion
unbrauchbar. Manueller Export, Plugins oder Browser-Automatisierung nur als letzte Wahl; keiner
dieser Wege liefert eine vollständige Spec.

## Anschluss: erster Entwurf, nur auf Auftrag

Strikt aus der Spec: Foundations als Variablen nach Projektkonvention, Fonts und Assets
einbinden (keine Platzhalter), Komponenten mit allen Zuständen, Layouts je Tier. Die Herkunft
(Node-ID) steht in der Spec, nicht als Kommentar im Stylesheet. Danach im Browser gegen
`REFERENCE_DIR` vergleichen und die Prüfliste aus Phase 1 abhaken.
