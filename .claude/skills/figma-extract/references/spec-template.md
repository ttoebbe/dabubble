# Vorlage: spec.md und MANIFEST.md

Gliederung nach dem bewährten Join-Ergebnis. Die Spec ist Englisch. Die `<!-- … -->`-
Kommentare sind Schreibanweisungen und kommen nicht in die fertige Datei. Abschnitte ohne
Inhalt bleiben stehen und sagen das („No layout grid is defined.“) – eine fehlende
Überschrift wirkt wie vergessen.

## Regeln für den Inhalt

- Jeder Wert mit Node-ID oder Stilname als Beleg. Was die Datei nicht hergibt:
  **not defined in Figma**.
- Widersprüche nicht auflösen, sondern in 6.4 mit allen Kandidaten und Herkunft sammeln.
- Kollisionen Design ↔ Projektregel in 6.5 mit beiden Seiten; nichts still entscheiden.
- Empfehlungen sind erlaubt, wenn sie als solche markiert sind (z. B. Token je Bauteil statt
  eines Radius-Tokens) – sie ersetzen nie den Ist-Wert.
- Notizen aus der Datei wörtlich in der Originalsprache, englische Übersetzung kursiv dahinter.

Erfahrungsgemäß häufige Funde für 6.4: Stilname ≠ Stilwert; gleicher Stilname mit mehreren
Werten; Textstil-Namen nicht monoton zur Größe; zwei Schriftfamilien für dieselbe Rolle;
eine Schrift nur an einer Stelle; Grid passt zu keinem Frame; zwei Content-Breiten;
Padding der Komponente ≠ Padding der platzierten Instanz; versteckte Alternativentwürfe
(`visible: false`); hover und click identisch; Tippfehler in Varianten-Namen.

Häufig für 6.5: Schrift unter 16 px; Touch-Target unter 44 px; Kontrast unter 4,5 : 1;
Strichstärke wechselt je Zustand (Layout-Shift); kein Focus-Zustand; Bedienung nur per
Drag & Drop; keine Vorgabe für die geforderte Mindestbreite.

## spec.md

```markdown
# Design spec — <project name>

Source: Figma file **<file name>**
File key `<KEY>` · `lastModified <…>` · `version <…>` · role `<role>`

This spec documents exclusively what is in the Figma file. Nothing is estimated.
Where a value is missing, it says **not defined in Figma**. Contradictions are not
resolved but collected in section 6.

Raw data in the cache: `.figma-cache/file.json` (<n> MB), `.figma-cache/image-fills.json`.
Scope of the file: <n> pages, <n> top-level frames, <n> COMPONENT_SETs, <n> styles,
<n> raster images in use.

---

## 1. Foundations

### 1.1 Color styles
<!-- Style name | Actual value | Occurrences | Note. Gleichnamige Stile einzeln. Danach alle
     Volltonfarben nach Häufigkeit (Hex | Occurrences | Where). Figma-Helfer kennzeichnen. -->

### 1.2 Text styles
<!-- Style name | Family | Size | Weight | Line height | Occurrences. Gruppen sichtbar lassen. -->

### 1.3 Fonts actually in use
<!-- Family | Weights | Text nodes | Role. Aus allen Text-Nodes, nicht aus den Stilen.
     Verfügbarkeit (Google Fonts / kommerziell) und was nach assets/fonts/ geladen wurde.
     Liste aller vorkommenden Schriftgrößen. -->

### 1.4 Layout grid
<!-- Parameter als Codeblock, Nachrechnung, auf welchen Frames es liegt und auf welchen nicht. -->

### 1.5 Effects (shadows)
<!-- Style name | x | y | Blur | Spread | Color | Occurrences | Where, danach als CSS-Zeilen. -->

### 1.6 Radii
<!-- Radius | Occurrences | Role. Asymmetrische Radien. Bei > 3 Werten: Empfehlung Token je Bauteil. -->

## 2. Breakpoints and responsive behavior

### 2.1 What the file specifies
<!-- Wörtliche Zitate aller Breakpoint-/Verhaltensnotizen mit Node-ID, Übersetzung kursiv. -->

### 2.2 Existing artboard widths
<!-- Tier | Artboard width | Frame count | Evidence. Arbeitsflächen separat nennen. -->

### 2.3 Uncovered viewport ranges
<!-- Range | Status. Ausdrücklich: Implementierungsentscheidung, keine Design-Vorgabe. -->

### 2.4 App shell
<!-- Element | Node | Value (Sidebar, Header, Content, Abstände) aus einem repräsentativen Screen. -->

## 3. Frames per tier
<!-- Je Tier eine Tabelle: Node ID | Frame | W x H | Auto-layout | Gap | Padding T/R/B/L | Fill | Visible.
     Quelle: .figma-cache/analysis/frames.md. -->

## 4. Components
<!-- Satz: vollständiges Inventar in components.md, Variante maßgeblich, nicht das Set.
     Je Gruppe (Buttons, Inputs, Cards, Navigation, projektspezifische Teile) die Varianten
     nebeneinander: Variant | Size | Padding | Radius | Fill | Stroke | Shadow | Text.
     Fehlende Zustände und Layout-Shift-Risiken direkt beim Bauteil nennen. -->

## 5. Notes from the source file
<!-- Je Notiz: **`<node id>` — "<frame name>" (page, font)**, Zitat als Blockquote, Übersetzung kursiv. -->

## 6. Open questions and conflicts

### 6.1 Reconciliation with the requirements — present in the design
<!-- Requirements item | Evidence in the design (Node-IDs) -->

### 6.2 Reconciliation with the requirements — NOT present in the design
<!-- Missing | Requirements reference -->

### 6.3 Present in the design, not mentioned in the requirements

### 6.4 Contradictions within the file
<!-- # | Contradiction | Candidates and origin -->

### 6.5 Collision design directive ↔ project rule
<!-- # | Design says | Project rule says | Affected -->

### 6.6 Not defined in Figma
<!-- Aufzählung -->

### 6.7 Technical limitations during extraction
<!-- Item | Finding: 403 auf /styles, versteckte Frames ohne Render, rekonstruierte Icons,
     429 und Wiederholungen, abgesenkte Render-Skalierung. -->

## 7. Provenance and reproducibility
<!-- Artifact | Produced by | Source: file.json, image-fills.json, geometry-nodes.json,
     SVG-Exporte, Material Symbols, Originalbilder, Fonts, components.md, Referenzbilder.
     Hinweis: Analyse lief gegen .figma-cache/ mit dem Skill figma-extract; Nachfragen
     brauchen keinen API-Aufruf. -->
```

## MANIFEST.md

```markdown
# Asset manifest

Source: Figma file `<name>`, file key `<KEY>`, state `lastModified <…>`, version `<…>`.
All measures in px. "Display size" = size of the node in the Figma design.

## 1. Logos (SVG, exported from Figma)

| File | Source node | Node name | Display size | Origin |
|---|---|---|---|---|

## 2. Icons from Figma (SVG)

| File | Source node | Node name | Display size | Origin |
|---|---|---|---|---|
<!-- Origin: "Figma /v1/images SVG" oder "Figma /v1/files/.../nodes?geometry=paths, SVG
     reconstructed (node hidden, render API returns null)" -->

## 3. Icons from an external library

| File | Symbol | Style | Source URL | Replaces node | License |
|---|---|---|---|---|---|

## 4. Raster images

| File | Source node(s) | imageRef | Original size | Display size | Format | Note |
|---|---|---|---|---|---|---|
<!-- Note: "original smaller than display size — quality risk", falls zutreffend. -->

## 5. Fonts

| Family | Weights | Subsets | Files | Source | License |
|---|---|---|---|---|---|
```
