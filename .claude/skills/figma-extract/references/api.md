# API-Befehle je Schritt

Alle Befehle laufen in der Projektwurzel. `KEY` am Befehlsanfang setzen (`KEY=abc123 &&`),
weil das Bash-Tool keine Variablen zwischen Aufrufen behält. Lange Abrufe (große
`file.json`, viele Renders) mit erhöhtem Timeout oder im Hintergrund starten.

## Inhalt

1. Muster: Git Bash und PowerShell
2. Vorbereitung: Cache und Git-Ausschluss
3. Schritt 0: Zugriffstest
4. Schritt 1: Rohdaten und Analyse
5. Schritt 6A: Vektoren, Material Symbols, versteckte Icons
6. Schritt 6B: Rasterbilder
7. Schritt 6C: Fonts
8. Schritt 8: Referenz-Screenshots
9. Limits und Fehler

## 1. Muster

Git Bash (Bash-Tool):

```bash
KEY=abc123 && t=$(tr -d '\r\n' < "$HOME/.figma-token") && curl -s --compressed -D .figma-cache/headers.txt -o .figma-cache/<datei>.json -w "%{http_code}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/<pfad>"
```

PowerShell:

```powershell
$KEY = "abc123"; $t = (Get-Content "$HOME\.figma-token" -Raw).Trim(); curl.exe -s --compressed -D .figma-cache/headers.txt -o .figma-cache/<datei>.json -w "%{http_code}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/<pfad>"
```

- `-o` schreibt die Antwort in den Cache, `-w` gibt nur den Statuscode aus – so landet
  kein Body ungefragt im Kontext.
- **Kein `--retry` gegen api.figma.com.** curl beachtet `Retry-After`, und der beträgt auf
  dem Starter-Plan Tage (gemessen 399126 s) – der Befehl hängt dann. Bei 429 stattdessen
  `grep -i -E 'retry-after|x-figma-plan-tier|x-figma-rate-limit-type' .figma-cache/headers.txt`
  und abbrechen (SKILL.md, API-Budget). `--retry 3 --retry-max-time 60` nur für Downloads von
  S3, GitHub und Google Fonts.
- Windows: Python schreibt Zeilenenden als `\r\n`. Vor jedem `while read` steht deshalb
  `| tr -d '\r'`, sonst endet jeder Dateiname auf ein zusätzliches Zeichen. Python-Einzeiler
  mit `python -X utf8` starten, sonst bricht die Ausgabe an Emojis in Node-Namen ab
  (`-I` ignoriert `PYTHONIOENCODING`).
- Nie `-v`, `--trace` oder `set -x`: sie drucken den Header samt Token.
- Fehlt `TOKEN_FILE`, bricht `tr` bzw. `Get-Content` mit „No such file“ ab → setup.md.

## 2. Vorbereitung

```bash
mkdir -p .figma-cache && if [ -d .git ]; then mkdir -p .git/info && touch .git/info/exclude && sed -i -e '$a\' .git/info/exclude && for e in .figma-cache/ .figma-token; do grep -qxF "$e" .git/info/exclude || echo "$e" >> .git/info/exclude; done && git check-ignore -v .figma-cache/file.json; else echo "no git repo yet"; fi
```

Erwartet: eine Zeile `.git/info/exclude:<n>:.figma-cache/  .figma-cache/file.json`. Bei
„no git repo yet“ den Ausschluss nach `git init` nachholen.

## 3. Schritt 0

Kein eigener Aufruf: Der Abruf von `file.json` in Schritt 1 ist zugleich der Zugriffstest und
spart einen der knappen Tier-1-Aufrufe. Danach auswerten, ohne den Body komplett auszugeben;
bei einem Fehler enthält `file.json` nur die kurze Fehlermeldung:

```bash
python -X utf8 -c "import json;d=json.load(open('.figma-cache/file.json',encoding='utf-8'));print(d.get('status'),d.get('err'),'|',d.get('name'),d.get('role'),d.get('lastModified'));[print(p['id'],p['name']) for p in d.get('document',{}).get('children',[])]"
```

Fehlerantworten sehen so aus: `{"status":403,"err":"Invalid token"}`,
`{"status":404,"err":"Not found"}`. Reaktion laut Tabelle in SKILL.md.

## 4. Schritt 1

```bash
KEY=abc123 && t=$(tr -d '\r\n' < "$HOME/.figma-token") && curl -s --compressed -D .figma-cache/headers.txt -o .figma-cache/file.json -w "file %{http_code} %{size_download}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/files/$KEY" && curl -s --compressed -o .figma-cache/image-fills.json -w "images %{http_code}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/files/$KEY/images"
```

```bash
python ".claude/skills/figma-extract/scripts/analyze_cache.py" .figma-cache
```

Gezielte Detailabfrage statt `file.json` zu lesen (Beispiel: ein Node mit allen Feldern
außer den Kindern):

```bash
python -X utf8 -c "import json,sys;sys.setrecursionlimit(20000);d=json.load(open('.figma-cache/file.json',encoding='utf-8'));f=lambda n:n if n['id']==sys.argv[1] else next((r for c in n.get('children',[]) if (r:=f(c))),None);n=f(d['document']);print(json.dumps({k:v for k,v in n.items() if k!='children'},indent=1,ensure_ascii=False))" "45:2195"
```

## 5. Schritt 6A – Vektoren

Erst ein Mapping Node-ID → Zieldatei in `.figma-cache/asset-map.json` schreiben (Grundlage
für Downloads und `MANIFEST.md`), dann die Render-URLs holen. IDs mit `;`
(Instanz-Unterebenen wie `I12:3;45:6`) URL-kodieren: `;` → `%3B`. Alle Vektoren in **einen**
Aufruf packen (bis etwa 50 IDs) – jeder Aufruf kostet Budget. Vorher im Cache prüfen, dass
jede ID sichtbar ist, sonst kommt `null` zurück und der Ersatz kostet einen weiteren Aufruf.

```bash
KEY=abc123 && t=$(tr -d '\r\n' < "$HOME/.figma-token") && curl -s -D .figma-cache/headers.txt -o .figma-cache/svg-urls-1.json -w "%{http_code}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/images/$KEY?ids=69323:5223,75609:16170&format=svg"
```

Antwort: `{"err":null,"images":{"69323:5223":"https://…","75609:16170":null}}`. Die URLs
ohne Token herunterladen:

```bash
python -X utf8 -c "import json;m=json.load(open('.figma-cache/asset-map.json'));u=json.load(open('.figma-cache/svg-urls-1.json'))['images'];[print(f'{u[i]}\t{p}') for i,p in m.items() if u.get(i)]" | tr -d '\r' | while IFS=$'\t' read -r url path; do mkdir -p "$(dirname "$path")" && curl -s --retry 3 --retry-max-time 60 -o "$path" "$url"; done
```

**Material Symbols** (`material_hint: true`, Name wie `delete`, `local_hospital`): direkt aus
der Quelle, `-f` bricht bei unbekanntem Namen ab – dann doch aus Figma exportieren.

```bash
curl -s -f -o "<ASSETS_DIR>/icons/delete.svg" "https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/delete/materialsymbolsoutlined/delete_24px.svg"
```

Stilvarianten: Ordner `materialsymbolsrounded` / `materialsymbolssharp`, gefüllt
`<name>_fill1_24px.svg`. Der Stil wird nicht geraten: Outlined und Rounded nebeneinander mit
dem Referenzbild der Icon-Übersicht vergleichen (abgerundete Linienenden bei `add`, `close`,
`arrow_back` = Rounded). Vergleichsseite als HTML in `.figma-cache/compare/` ablegen und über
`python -m http.server <port> --directory .figma-cache/compare` öffnen – Playwright blockiert
`file://`. Kein Figma-Render nur für den Vergleich (kostet Budget). Herkunft im MANIFEST:
Google, Apache 2.0. Die SVGs haben kein `fill`-Attribut, Farbe kommt aus dem CSS.

**Render liefert `null`** (Node oder Elternteil `visible: false`, oder unsichtbar im Startzustand
einer Animation): erst eine sichtbare Instanz bzw. Schwester-Variante suchen, sonst:

```bash
KEY=abc123 && t=$(tr -d '\r\n' < "$HOME/.figma-token") && curl -s --compressed -D .figma-cache/headers.txt -o .figma-cache/geometry-nodes.json -w "%{http_code}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/files/$KEY/nodes?ids=45:2516,10119:3730&geometry=paths"
```

SVG zusammensetzen: `viewBox="0 0 <w> <h>"` aus der `absoluteBoundingBox` des Icons; je
Vektor-Nachfahre `fillGeometry[].path` (mit `fill-rule` aus `windingRule`) und
`strokeGeometry[].path`, verschoben um die Differenz seiner `absoluteBoundingBox` zur
Icon-Box (bei Rotation `relativeTransform` anwenden); Farben aus `fills` / `strokes`. Im
MANIFEST als „reconstructed from geometry=paths“ kennzeichnen.

## 6. Schritt 6B – Rasterbilder

Nur die verwendeten Originale in den Cache laden (Format unbekannt), dann prüfen, dann benannt
kopieren. `image-fills.json` listet jedes je hochgeladene Bild, auch gelöschte; deshalb gegen
`exports.json` → `image_fills` filtern:

```bash
mkdir -p .figma-cache/raw-images && python -X utf8 -c "import json;used={f['imageRef'] for f in json.load(open('.figma-cache/analysis/exports.json',encoding='utf-8'))['image_fills']};[print(f'{u}\t.figma-cache/raw-images/{r}') for r,u in json.load(open('.figma-cache/image-fills.json'))['meta']['images'].items() if r in used]" | tr -d '\r' | while IFS=$'\t' read -r url path; do curl -s --retry 3 --retry-max-time 60 -o "$path" "$url"; done
```

```bash
python ".claude/skills/figma-extract/scripts/image_sizes.py" .figma-cache/raw-images
```

Ausgabe je Datei: Pfad, Format (`png`, `jpg`, …), Pixelmaß. Mit `display` aus
`exports.json` → `image_fills` vergleichen; nur tatsächlich verwendete imageRefs nach
`<ASSETS_DIR>/images/<name>.<format>` kopieren. `image-fills.json` neu holen, wenn die URLs
abgelaufen sind (403 von S3, etwa 14 Tage nach Abruf).

## 7. Schritt 6C – Fonts

Erst prüfen, ob jede Familie auf Google Fonts liegt. Die css2-API taugt dafür nicht: Für
unbekannte Familien (z. B. „Helvetica Neue“) antwortet sie mit 200 und einem Ersatz über
`fonts.gstatic.com/l/font?kit=…`. Zuverlässig ist die Specimen-Seite (200 = vorhanden,
404 = nicht frei verfügbar):

```bash
for f in "Inter" "Open Sans" "Helvetica Neue"; do curl -s -o /dev/null -w "%{http_code} $f\n" "https://fonts.google.com/specimen/${f// /+}"; done
```

Dann die CSS holen. Google liefert woff2 nur an einen modernen User-Agent, ohne ihn TTF:

```bash
curl -s -f -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" -o .figma-cache/google-fonts.css "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Open+Sans:wght@400;700&display=swap"
```

- HTTP 400 (`-f` → Exit-Code 22): ein angefragtes Weight gibt es für die Familie nicht.
- Echte Google-Fonts-Dateien liegen unter `fonts.gstatic.com/s/<familie>/`; taucht
  `/l/font?kit=` auf, ist eine Familie nicht vorhanden – zurück zur Specimen-Prüfung.
- Die CSS enthält je Subset einen `@font-face`-Block mit Kommentar (`/* latin */`,
  `/* latin-ext */`). Gebraucht werden meist `latin` (enthält die Umlaute) und `latin-ext`.
- Variable Fonts: mehrere Weights zeigen auf dieselbe URL – nur einmal herunterladen.
- Dateien nach `<ASSETS_DIR>/fonts/<familie>-<weight|variable>-<subset>.woff2`, dazu
  `fonts.css` mit relativen `url()` und denselben `unicode-range`-Werten. Lizenz (meist
  OFL 1.1) ins MANIFEST.

## 8. Schritt 8 – Referenz-Screenshots

```bash
KEY=abc123 && t=$(tr -d '\r\n' < "$HOME/.figma-token") && curl -s -D .figma-cache/headers.txt -o .figma-cache/ref-urls-1.json -w "%{http_code}\n" -H "X-Figma-Token: $t" "https://api.figma.com/v1/images/$KEY?ids=45:2195,301:1107&format=png&scale=1"
```

- Reihenfolge nach Nutzen, nicht nach Größe: erst die Screens, dann Dialoge und Overlays,
  Design-System-Canvases zuletzt. (DABubble: nach Fläche sortiert kamen erst 30 kleine
  Overlays, dann war das Budget weg und alle 67 Screens fehlten.)
- Pakete bis etwa 10 Screens; sehr hohe Frames (mehrere tausend px) einzeln oder weglassen.
- Antwortet ein Paket mit 429: die Schleife sofort beenden, nicht das nächste Paket senden.
- Dateiname: `<frame-name-kebab>__<node-id mit : → - und ; → _>.png`, z. B.
  `summary-user__45-2195.png`. Download ohne Token wie in 6A.
- `null` = versteckter Frame → Spec 6.7. Muss für einen Riesen-Frame die Skalierung sinken,
  den Wert in der Spec nennen.

## 9. Limits und Fehler

| Meldung | Bedeutung | Reaktion |
|---|---|---|
| 403 `Invalid token` / `Token expired` | Token ungültig | abbrechen, setup.md |
| 403 `Invalid scope` | Endpunkt braucht anderen Scope (`/styles`) | Endpunkt auslassen |
| 404 `Not found` | falscher Key oder Node-ID | Key der eigenen Kopie, IDs aus dem Cache |
| 429 | Budget aufgebraucht; `Retry-After` in Sekunden, Starter-Plan: Tage (`x-figma-rate-limit-type: low`) | abbrechen, Wartezeit als Datum nennen, nie `--retry`; Rest nach Ablauf oder per manuellem Export |
| `images: {id: null}` | Node versteckt oder leer | geometry=paths (Icons) bzw. Spec 6.7 (Frames) |
| S3-Download 403 | Bild-URL abgelaufen | `image-fills.json` bzw. Render-URLs neu holen |

Jeden API-Aufruf zählen (`-w`-Zeilen) und die Summe im Bericht nennen.
