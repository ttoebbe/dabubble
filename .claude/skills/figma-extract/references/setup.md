# Setup: eigene Kopie, File-Key, Token

Lesen, wenn noch keine eigene Figma-Kopie existiert, `TOKEN_FILE` fehlt oder Schritt 0
mit 403/404 abgebrochen hat. Die Schritte 1–4 macht Thomas im Browser, Schritt 5 in
PowerShell auf seinem Windows-Rechner – du gibst sie ihm im Format „Manuelle Schritte“
aus der globalen `CLAUDE.md` (System, vollständiger Befehl, erwartete Ausgabe).

## 1. Fremde Datei exportieren

In der Figma-Datei der Akademie (Browser oder Desktop-App): **Menü oben links → File →
Save local copy…** → eine `.fig`-Datei im Download-Ordner.

Ist der Menüpunkt ausgegraut, fehlt die Berechtigung: „Duplicate to your drafts“ nutzen,
falls angeboten, sonst beim Ersteller nachfragen.

## 2. In den eigenen Account importieren

figma.com → **Drafts** → `.fig`-Datei per Drag & Drop ins Fenster ziehen, warten, bis sie in
der Übersicht erscheint, öffnen.

## 3. File-Key holen

Aus der URL der **eigenen Kopie**: `figma.com/design/<FILE_KEY>/Projektname?node-id=…` –
der Teil zwischen `/design/` und dem nächsten `/`. Beim Import ändern sich die Node-IDs; ein
Key oder eine Node-ID aus dem Originallink führt zu 404 oder falschen Frames.

## 4. Token erzeugen

figma.com → Icon oben links → **Settings** → Reiter **Security** → „Personal access tokens“
→ **Generate new token**

- Name frei wählbar, Ablauf z. B. 90 Tage
- **File content: Read**, alles andere „No access“ (der `/styles`-Endpunkt bräuchte
  zusätzlich „Library content: Read“ – wird nicht gebraucht)
- Der Token wird genau einmal angezeigt und beginnt mit `figd_`. Sofort kopieren.

Ein bestehender Token lässt sich weiterverwenden, solange er nicht abgelaufen ist.

## 5. Token ablegen

Thomas, in PowerShell auf diesem Windows-Rechner, direkt nachdem der Token in Figma kopiert
wurde (der Befehl schreibt den Inhalt der Zwischenablage ohne Zeilenumbruch in die Datei):

```powershell
[IO.File]::WriteAllText("$HOME\.figma-token", (Get-Clipboard).Trim())
```

Prüfen – diese beiden Befehle verraten den Token nicht und dürfen von dir ausgeführt werden:

```powershell
(Get-Content "$HOME\.figma-token" -Raw).Length
```

```powershell
(Get-Content "$HOME\.figma-token" -Raw).StartsWith("figd_")
```

Erwartet: eine Zahl um 40–45 und `True`. Bei `0`, einer sehr großen Zahl oder `False` war
etwas anderes in der Zwischenablage → Token erneut kopieren (ist der Figma-Dialog schon
zu, einen neuen erzeugen) und Schritt 5 wiederholen.

Danach die Zwischenablage leeren:

```powershell
Set-Clipboard -Value " "
```

Kein Notepad, kein VS Code zum Anlegen – beide hängen einen Zeilenumbruch an. Die
Skill-Befehle entfernen ihn zwar, ein Fremdwerkzeug aber nicht.

## Token abgelaufen

Schritt 0 meldet 403 mit `err` wie „Invalid token“ oder „Token expired“. Dann Schritt 4
und 5 wiederholen und den alten Token in Figma unter Security löschen. Ein Token, der doch
einmal in einem Commit gelandet ist, gilt als verbrannt: sofort in Figma widerrufen – GitHub
meldet ihn ohnehin automatisch an Figma.

## Fallstricke

- `curl` in PowerShell ist ein Alias für `Invoke-WebRequest` – immer `curl.exe`.
- Mehrzeiliges Einfügen in PowerShell erzeugt `>>`: Strg+C und Zeilen einzeln eingeben.
- Dateinamen mit Leerzeichen in Anführungszeichen setzen.
- `.figma-cache/` nach dem Lauf behalten – Nachfragen kosten dann keinen API-Aufruf.
