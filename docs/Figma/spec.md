# Design spec — DABubble

Source: Figma file **DABubble (Slack Clone) (Kopie)** — Thomas' own copy of the Developer Akademie file
File key `hG2eUDuNMyBF949FkvUOSS` · `lastModified 2026-10-21T14:26:38Z` · `version 2412825337076141628` · role `owner`

This spec documents exclusively what is in the Figma file. Nothing is estimated.
Where a value is missing, it says **not defined in Figma**. Contradictions are not
resolved but collected in section 6.

Raw data in the cache (local only, never committed): `.figma-cache/file.json` (24.6 MB), `.figma-cache/image-fills.json`.
Scope of the file: 3 pages, 98 top-level frames (1 hidden), 110 COMPONENT_SETs with 419 variants, 32 styles,
2146 text nodes, 1 raster image used by the app.

Related files: `components.md` (full component inventory), `MANIFEST.md` (assets), `reference/` (screenshots).

> **State of this spec:** complete. Reference screenshots exist for all 97 visible frames: 30 from the
> REST API, 67 from the Figma export panel after the API rate limit for the Starter plan was exhausted
> (section 6.7).

---

## 1. Foundations

### 1.1 Color styles

Several styles exist twice, once local and once from a library (remote), with identical values.

| Style name | Actual value | Fills / strokes | Role in the design | Note |
|---|---|---|---|---|
| Purple 1 | `#444DF2` | 1106 / 49 | primary button, links, send icon, active input text | local `84:1049`, remote `1808:15589` |
| Purple 2 | `#797EF3` | 708 / 52 | primary button hover, own message bubble, secondary button border, "Passwort vergessen?" | local `72:694`, remote `1808:15590` |
| Purple 3 | `#535AF1` | 205 / 40 | icon hover, input focus border, "Bearbeiten" links, reply count link | `75:779` |
| Bg color | `#ECEEFE` | 449 / 37 | app background, input fill, hover fill of messages and list items, other people's bubbles | `20:22` |
| Ligth purple (Lines) | `#ADB0D9` | 356 / 466 | borders, separators, reaction chips | typo in name; local `60:132`, remote `1808:15591` |
| Text gray | `#686868` | 616 / 9 | placeholders, timestamps, secondary text, disabled primary button | three styles with this value: `61:325`, `1808:15732`, `2215:19476` |
| Black | `#000000` | 2406 / 221 | default text and icons | local `60:259`, remote `1808:15577` |
| White | `#FFFFFF` | 2169 / 319 | surfaces, text on purple | local `20:21`, remote `1808:15575` |
| Rosa error | `#ED1E79` | 137 / 0 | error messages under fields | `145:167` |
| online green | `#92C83E` | 321 / 0 | online dot on avatars (also part of the logo) | `92:2448` |
| menu color | `#42526E` | 8 / 0 | label of the privacy checkbox (`79. Privacy policy check mark`) | remote `5538:20926` |
| Blue 1, Gray 1, Gray 2, Gray 4, Gray 5 | `#2F80ED`, `#333333`, `#4F4F4F`, `#BDBDBD`, `#E0E0E0` | ≤ 18 each | only in the Gmail mock-up `1898:19353` | not app UI |
| red-40 | `#FD5B4F` | 1 / 0 | only on page TN | not app UI |

Further solid colors without a style that matter for the UI:

| Value | Fills | Where |
|---|---|---|
| `#1381FF` | 16 | e-mail address link in profile views (`163:235`, `894:17353`) |
| `#313AE5` | 3 | start colour of the intro gradient `GRADIENT_LINEAR(#313AE5 → #797EF3)` on `128:765` and `609:17310` |
| `#1C1B1F` | 81 | icon colour in some Material Symbols instances (e.g. `more_vert`, `edit`) |

Not UI colours: `#D9D9D9` (1283, icon bounding boxes), `#9747FF` (COMPONENT_SET frames), grid colours
`#F047FF` / `#DC3FF5`, and about 60 illustration colours of avatars, emojis and logo (`#1B1464`, `#F4C19F`,
`#EBA352`, `#FFDD67`, …; full list in `.figma-cache/analysis/colors.md`).

### 1.2 Text styles

Only three text styles exist; most text nodes carry no style.

| Style name | Family | Size | Weight | Line height | Occurrences |
|---|---|---|---|---|---|
| Bold Display | Nunito | 46 px | 700 | 55.2 px (120 %) | 8 |
| Bold Mobile Display | Nunito | 32 px | 700 | 38.4 px (120 %) | 4 |
| Version 2/body | Open Sans | 16 px | 400 | 19.2 px (120 %) | 8 |

Typical unstyled combinations (from the screens):

| Role | Family / size / weight / line height | Example node |
|---|---|---|
| Page title in auth card | Nunito 46/700/55.2, `#444DF2` | "Anmeldung" `142:133` |
| Mobile page title | Nunito 32/700/38.4 | style Bold Mobile Display |
| Toast | Nunito 36/700/49.1, white on `#444DF2` | "Konto erfolgreich erstellt!" `182:280` |
| Profile name in header | Nunito 32/700/43.6 | `I379:2444;379:2251` |
| Dialog / chat title | Nunito 24/700/32.7 | "Entwicklerteam" `364:2317`, "Channel erstellen" |
| Search field placeholder | Nunito 24/400/32.7, `#686868` | "Devspace durchsuchen" `I116174:22563;116174:20651` |
| Sidebar section | Nunito 20/700 | `17. Channels UX`, `23. Direktnachrichten UX` |
| Intro text in auth card | Nunito 20/400/24 | `145:150` |
| Body, message text, inputs | Nunito 18/400/24.6 (inputs 18/500/21.6) | `463:3850`, `662:13054` |
| Author name | Nunito 18/700/24.6 | `I463:7009;463:6975` |
| Buttons | Nunito 18/700/24.6 | `10. Button primary` |
| Text links in auth footer | Figtree 18/400/21.6 (hover 500) | "Passwort vergessen?", "Impressum" |
| Timestamps, error messages | Nunito 14/400/19.1 | "14:25 Uhr" `463:3848`, error `662:13055` |
| Privacy checkbox label | Open Sans 16/400 | `5538:20930` |

### 1.3 Fonts actually in use

| Family | Weights (text nodes) | Text nodes | Role | Loaded |
|---|---|---|---|---|
| Nunito | 400 (1221), 700 (647), 500 (132), 600 (58) | 2043 | entire UI | yes, variable 400–700 |
| Figtree | 400 (29), 500 (2), 800 (1) | 32 | footer links (Impressum, Datenschutz), "Passwort vergessen?", "Konto erstellen"; 800 only on TN | yes, 400–500 |
| Open Sans | 400 (10), 600 (4) | 13 | privacy checkbox label; 600 only in the Gmail mock-up | yes, 400 |
| Inter | 400 (23) | 23 | font-size documentation canvas `653:13221` only | no |
| Roboto | 400, 500, 700 | 20 | Gmail mock-up only | no |
| Patrick Hand | 400 (15) | 15 | designer notes only | no |

All loaded families are on Google Fonts (specimen pages answer 200). Files and `fonts.css` in `public/fonts/`.

Font sizes in use (px, text nodes): 10 (1), 12 (20), 13 (14), 14 (198), 15 (4), 16 (218), 17 (53),
18 (1156), 19 (1), 20 (235), 22 (4), 24 (161), 26 (3), 32 (50), 36 (3), 38 (1), 40 (15, notes),
46 (9), 48 (1), 209 (1, thumbnail).

### 1.4 Layout grid

```
Mobile:   COLUMNS count=4  width=87.5  gutter=16 offset=16 STRETCH   on 25 nodes, all 430 px wide
Desktop:  COLUMNS count=12 width=106.17 gutter=20 offset=20 STRETCH  on 14 nodes, all 1534 px wide
Desktop:  COLUMNS count=15 width=106.67 gutter=20 offset=20 STRETCH  on 2 nodes, 1920 px wide (`1823:16557`, `719:15163`)
```

Check: 4 × 87.5 + 3 × 16 + 2 × 16 = 430 ✓ · 12 × 106.17 + 11 × 20 + 2 × 20 = 1534 ✓ · 15 × 106.67 + 14 × 20 + 2 × 20 = 1920 ✓.
The 12-column grids sit on hidden helper frames named "Grids" inside the desktop screens (e.g. `849:13890`
at x = 386, the area right of the workspace menu). The UI does not follow the 12-column grid exactly
(main chat 989 px, thread 485 px).

### 1.5 Effects (shadows)

| Style name | x | y | Blur | Spread | Color | Occurrences | Where |
|---|---|---|---|---|---|---|---|
| header | 0 | 2 | 10 | 0 | `#000000` 8 % | 63 | chat headers, cards (`210:1110`, auth card `141:14`) |
| overlay | 0 | 6 | 10 | 0 | `#000000` 20 % | 33 (+30 unstyled) | dialogs, profile views, floating edit button |
| — | 0 | 2 | 10 | 0 | `#000000` 10 % | 27 | |
| — | 4 | 4 | 7 | 0 | `#000000` 20 % | 20 | hide/show navigation tab `77.` |
| — | 0 | −3 | 10 | 0 | `#000000` 20 % | 13 | mobile bottom sheets |
| — | 0 | 6 | 14 | 0 | `#000000` 20 % | 7 | |
| — | 0 | 4 | 61 / 42 / 50 | 0 | `#000000` 55 / 25 / 25 % | 1 each | single nodes |

```css
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); /* header */
box-shadow: 0 6px 10px rgba(0, 0, 0, 0.20); /* overlay */
box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.20); /* navigation tab */
```

### 1.6 Radii

24 distinct uniform radii. The ones that carry UI meaning:

| Radius | Occurrences | Role |
|---|---|---|
| 100 px / 50 px | 195 / 55 | pill shapes: auth inputs, Google button, avatars, icon buttons (fully round) |
| 42 px | 42 | search bar |
| 40 px | 66 | text box with icon (`33.`), avatar frames |
| 35 px | 252 | dialog parts, add-members chips |
| 30 px | 1047 | main panels (workspace menu, main chat, thread), dialogs, date separator |
| 25 px | 89 | primary and secondary buttons |
| 20 px | 850 | message box, icon button hover circles, reaction chips |
| 15 px | 70 | sidebar items |
| 10 / 12 px | 61 / 85 | small frames |
| 5 px | 110 | only COMPONENT_SET frames (Figma helper, not UI) |

Asymmetric radii carry meaning: speech bubble of others `0/30/30/30`, own bubble `30/0/30/30`,
reaction bar `25/25/0/25`, dropdowns below a field `0/20/20/20`, mobile bottom sheet `30/30/0/0`.
Recommendation: one radius token per component type, not a single scale.

## 2. Breakpoints and responsive behavior

### 2.1 What the file specifies

The file contains no note about breakpoints or resizing behavior. The only layout instruction is the
reaction limit in note `114942:24051` (section 5).

### 2.2 Existing artboard widths

| Tier | Artboard width | Frame count | Evidence |
|---|---|---|---|
| Mobile | 430 x 932 | 26 screens | `609:17202` 01-Log In … `116336:22036` |
| Desktop | 1920 x 1080 | 25 screens | `125:2` 01-Log In … `5538:16655` 19. Datenschutz |
| Dialogs / overlays | 166–872 | 36 (incl. 3 mobile sheets 430 px wide) | profile views, add channel, add members, toasts |
| Design-system canvases | 2069 | 10 | page Components |
| Thumbnail | 1920 x 1080 | 1 | page TN |

### 2.3 Uncovered viewport ranges

| Range | Status |
|---|---|
| 320–429 px | **no artboard**; DA checklist requires responsiveness down to 320 px |
| 431–1919 px | **no artboard** (tablets, laptops 1024–1440) |
| > 1920 px | no artboard; no maximum content width defined |

These ranges are implementation decisions, not design directives.

### 2.4 App shell

Desktop, from `210:750` "06-Slack Clone Desktop general view" (positions relative to the frame):

| Element | Node | Value |
|---|---|---|
| Background | `210:750` | `#ECEEFE` |
| Logo block (logo 70 + gap 16 + name 156) | `235:430` | x 45, y 25, 255 x 70 |
| Search bar | `116174:22563` | x 406, y 25, 989 x 70, radius 42, padding 17.5/45, white |
| Profile menu (name 32/700 + avatar 70 + arrow) | `379:2444` | x 1544, y 25, 342 x 70, gap 20 |
| Workspace menu | `210:1203` | x 20, y 115, 366 x 940, radius 30, padding 32/30, gap 25, white |
| Main chat | `210:971` | x 406, y 115, 989 x 940, radius 30, white |
| Thread ("Secondary chat") | `210:752` | x 1415, y 115, 485 x 940, radius 30, white |
| Gaps | — | 20 px left, between panels and right; header row 25 px from top, panels start 20 px below it, 25 px bottom margin |
| Hide/show navigation tab | `1854:19320` | x 0, y 581, 56 x 347, radius 0/30/30/0, vertical text 20/500 |
| Chat header | `210:1110` | 989 x 96, padding 25/45, shadow "header" |
| Message box | `516:6870` | x 35 in chat, 919 x 145, radius 20, padding 20, stroke `#ADB0D9` |
| Date separator | `210:1106` | line `#ADB0D9` + chip 189 x 35, radius 30, padding 5/15, text 18/400 |

Mobile, from `678:15601` (menu) and `609:17393` (chat):

| Element | Node | Value |
|---|---|---|
| Header | `684:16489` | 430 x 80, padding 15/16, `#ECEEFE`; logo 45 + name 106 x 16; avatar 50 at x 364 |
| Menu | `678:15602` | x 16, y 92, 398 x 820, radius 0/0/30/30, padding 20, gap 25 |
| New-message button | `693:14384` | 60 x 60 round `#444DF2` at x 354, y 815, shadow overlay |
| Chat header | `678:13870` | y 80, 430 x 60, padding 10/16, shadow header |

## 3. Frames per tier

Reference column: file in `docs/Figma/reference/` and how it was produced. **API** = REST render
`GET /v1/images` (exact frame bounds). **UI export** = Figma export panel, PNG 1x, via Chrome; the
image includes effect bounds (drop shadows add 20 px) and is not clipped to the frame of an instance,
so its pixel size can differ from the frame size (shown in brackets).

### 3.1 Desktop screens (1920 x 1080, page Prototype) — 25 frames

| Node ID | Frame | W x H | Reference |
|---|---|---|---|
| `128:765` | 00-Intro | 1920 x 1080 | `00-intro__128-765.png` · UI export |
| `125:2` | 01-Log In | 1920 x 1080 | `01-log-in__125-2.png` · UI export |
| `171:66` | 02-Sign In | 1920 x 1080 | `02-sign-in__171-66.png` · UI export |
| `6179:15943` | 03-Choose avatar | 1920 x 1080 | `03-choose-avatar__6179-15943.png` · UI export |
| `182:319` | 04-Send email | 1920 x 1080 | `04-send-email__182-319.png` · UI export |
| `182:372` | 05-Reset password | 1920 x 1080 | `05-reset-password__182-372.png` · UI export |
| `210:750` | 06-Slack Clone Desktop general view | 1920 x 1080 | `06-slack-clone-desktop-general-view__210-750.png` · UI export |
| `516:7084` | 07-Slack Clone hidden menu | 1920 x 1080 | `07-slack-clone-hidden-menu__516-7084.png` · UI export |
| `516:7949` | 08-Slack Clone hidden aux chat | 1920 x 1080 | `08-slack-clone-hidden-aux-chat__516-7949.png` · UI export |
| `516:9116` | 09-Slack Clone hidden menu and chat | 1920 x 1080 | `09-slack-clone-hidden-menu-and-chat__516-9116.png` · UI export |
| `849:13065` | 10-Slack Clone Desktop- Office Team | 1920 x 1080 | `10-slack-clone-desktop-office-team__849-13065.png` · UI export |
| `723:10986` | 11-Slack Clone Desktop new message | 1920 x 1080 | `11-slack-clone-desktop-new-message__723-10986.png` · UI export |
| `890:13086` | 12 A-Slack Clone Desktop- Direct message Noah | 1920 x 1080 | `12-a-slack-clone-desktop-direct-message-noah__890-13086.png` · UI export |
| `890:13446` | 12 B-Slack Clone Desktop- Direct message Elise | 1920 x 1080 | `12-b-slack-clone-desktop-direct-message-elise__890-13446.png` · UI export |
| `890:13806` | 12 C-Slack Clone Desktop- Direct message Elias | 1920 x 1080 | `12-c-slack-clone-desktop-direct-message-elias__890-13806.png` · UI export |
| `890:13831` | 12 D-Slack Clone Desktop- Direct message Steffen | 1920 x 1080 | `12-d-slack-clone-desktop-direct-message-steffen__890-13831.png` · UI export |
| `890:14526` | 12 E-Slack Clone Desktop- Direct message Frederik | 1920 x 1080 | `12-e-slack-clone-desktop-direct-message-frederik__890-14526.png` · UI export |
| `757:12479` | 12-Slack Clone Desktop- Direct message Sofia | 1920 x 1080 | `12-slack-clone-desktop-direct-message-sofia__757-12479.png` · UI export |
| `1823:16615` | 13 -Slack Clone Desktop edit message view | 1920 x 1080 | `13-slack-clone-desktop-edit-message-view__1823-16615.png` · UI export |
| `1823:16556` | 14-Slack Clone hidden menu - edit message | 1920 x 1080 | `14-slack-clone-hidden-menu-edit-message__1823-16556.png` · UI export |
| `1823:16496` | 15-Slack Clone hidden aux chat - edit message | 1920 x 1080 | `15-slack-clone-hidden-aux-chat-edit-message__1823-16496.png` · UI export |
| `1823:16439` | 16-Slack Clone hidden menu and chat -  edit message | 1920 x 1080 | `16-slack-clone-hidden-menu-and-chat-edit-message__1823-16439.png` · UI export |
| `1898:19353` | 17. Gmail - email | 1920 x 1080 | `17-gmail-email__1898-19353.png` · UI export |
| `5538:15876` | 18. Impressum | 1920 x 1080 | `18-impressum__5538-15876.png` · UI export |
| `5538:16655` | 19. Datenschutz | 1920 x 1080 | `19-datenschutz__5538-16655.png` · UI export |

### 3.2 Mobile screens (430 x 932, page Prototype) — 26 frames

| Node ID | Frame | W x H | Reference |
|---|---|---|---|
| `609:17310` | 00-Intro | 430 x 932 | `00-intro__609-17310.png` · UI export |
| `609:17202` | 01-Log In | 430 x 932 | `01-log-in__609-17202.png` · UI export |
| `609:17276` | 02-Sign In | 430 x 932 | `02-sign-in__609-17276.png` · UI export |
| `6194:22230` | 03-Choose avatar | 430 x 932 | `03-choose-avatar__6194-22230.png` · UI export |
| `609:17234` | 04-Send email | 430 x 932 | `04-send-email__609-17234.png` · UI export |
| `609:17257` | 05-Reset password | 430 x 932 | `05-reset-password__609-17257.png` · UI export |
| `849:14773` | 06 B-Slack Clone mobile design - Main menu | 430 x 932 | `06-b-slack-clone-mobile-design-main-menu__849-14773.png` · UI export |
| `678:15601` | 06-Slack Clone mobile design - Main menu | 430 x 932 | `06-slack-clone-mobile-design-main-menu__678-15601.png` · UI export |
| `609:17393` | 07-Main Chat mobile | 430 x 932 | `07-main-chat-mobile__609-17393.png` · UI export |
| `742:12168` | 08-Secondary Chat mobile | 430 x 932 | `08-secondary-chat-mobile__742-12168.png` · UI export |
| `754:12776` | 09-New message | 430 x 932 | `09-new-message__754-12776.png` · UI export |
| `849:14440` | 10-New channel | 430 x 932 | `10-new-channel__849-14440.png` · UI export |
| `894:15100` | 11 A-Direct message mobile - Noah | 430 x 932 | `11-a-direct-message-mobile-noah__894-15100.png` · UI export |
| `894:15220` | 11 B-Direct message mobile - Elise | 430 x 932 | `11-b-direct-message-mobile-elise__894-15220.png` · UI export |
| `894:15340` | 11 C-Direct message mobile - Elias | 430 x 932 | `11-c-direct-message-mobile-elias__894-15340.png` · UI export |
| `894:15350` | 11 D-Direct message mobile - Steffen | 430 x 932 | `11-d-direct-message-mobile-steffen__894-15350.png` · UI export |
| `894:15580` | 11 E-Direct message mobile - Frederik (Du) | 430 x 932 | `11-e-direct-message-mobile-frederik-du__894-15580.png` · UI export |
| `116336:22036` | 11-Direct message mobile - Sofia | 430 x 932 | `11-direct-message-mobile-sofia__116336-22036.png` · UI export |
| `696:13540` | Add Channel | 430 x 932 | `add-channel__696-13540.png` · UI export |
| `719:15164` | Channel edition | 430 x 932 | `channel-edition__719-15164.png` · UI export |
| `1823:21307` | Channel edition | 430 x 932 | `channel-edition__1823-21307.png` · UI export |
| `156062:17306` | Datenschutz | 430 x 932 | `datenschutz__156062-17306.png` · UI export |
| `156062:17209` | Impressum | 430 x 932 | `impressum__156062-17209.png` · UI export |
| `116184:23002` | Searching bar channels | 430 x 932 | `searching-bar-channels__116184-23002.png` · UI export |
| `116184:22571` | Searching bar person | 430 x 932 | `searching-bar-person__116184-22571.png` · UI export |
| `116336:22744` | Tagging person | 430 x 932 | `tagging-person__116336-22744.png` · UI export |

### 3.3 Dialogs, overlays and toasts (page Prototype, other sizes) — 36 frames

| Node ID | Frame | W x H | Reference |
|---|---|---|---|
| `609:17308` | 02B-Overlay Three | 166 x 70 | `02b-overlay-three__609-17308.png` · API |
| `182:281` | 03B-Overlay One | 531 x 149 | `03b-overlay-one__182-281.png` · API |
| `609:17303` | 03B-Overlay Two | 269 x 70 | `03b-overlay-two__609-17303.png` · API |
| `609:17301` | 04B-Overlay One | 323 x 70 | `04b-overlay-one__609-17301.png` · API |
| `182:544` | 04B-Overlay Two | 441 x 149 | `04b-overlay-two__182-544.png` · API |
| `182:546` | 05B-Overlay Three | 273 x 149 | `05b-overlay-three__182-546.png` · API |
| `324:2281` | 31. Workspaces menú | 362 x 223 | hidden, not rendered |
| `332:2317` | 37. Add channel | 872 x 539 | `37-add-channel__332-2317.png` · UI export (892 x 559) |
| `578:8542` | 38. Add Members after add channel | 710 x 279 | `38-add-members-after-add-channel__578-8542.png` · API |
| `746:12764` | 38b. Add Members after add channel | 430 x 345 | `38b-add-members-after-add-channel__746-12764.png` · API |
| `556:10162` | 41. Add members R corner | 514 x 294 | `41-add-members-r-corner__556-10162.png` · API |
| `746:12783` | 41b. Add members R corner | 430 x 340 | `41b-add-members-r-corner__746-12783.png` · API |
| `740:11548` | 41b. Add members R corner | 398 x 379 | `41b-add-members-r-corner__740-11548.png` · API |
| `740:11440` | 43. Members | 398 x 364 | `43-members__740-11440.png` · API |
| `388:2847` | 43. Members | 415 x 411 | `43-members__388-2847.png` · API |
| `379:2221` | 64.  Edit user and Log out | 282 x 181 | `64-edit-user-and-log-out__379-2221.png` · API |
| `609:17627` | 64b.  Edit user and Log out - mobile | 430 x 206 | `64b-edit-user-and-log-out-mobile__609-17627.png` · API |
| `1814:15819` | 65. Profile view other users | 398 x 708 | `65-profile-view-other-users__1814-15819.png` · API |
| `894:18365` | 65. Profile view other users | 398 x 705 | `65-profile-view-other-users__894-18365.png` · API |
| `894:18250` | 65. Profile view other users | 398 x 705 | `65-profile-view-other-users__894-18250.png` · API |
| `894:18251` | 65. Profile view other users | 398 x 705 | `65-profile-view-other-users__894-18251.png` · API |
| `609:17630` | 65. Profile view other users | 398 x 705 | `65-profile-view-other-users__609-17630.png` · API |
| `609:17629` | 65. Profile view other users | 398 x 705 | `65-profile-view-other-users__609-17629.png` · API |
| `1808:16192` | 65. Profile view other users | 453 x 704 | `65-profile-view-other-users__1808-16192.png` · API |
| `894:17481` | 65. Profile view other users | 280 x 705 | `65-profile-view-other-users__894-17481.png` · API |
| `894:17370` | 65. Profile view other users | 280 x 705 | `65-profile-view-other-users__894-17370.png` · API |
| `894:17371` | 65. Profile view other users | 453 x 705 | `65-profile-view-other-users__894-17371.png` · UI export (520 x 725) |
| `463:7318` | 65. Profile view other users | 280 x 705 | `65-profile-view-other-users__463-7318.png` · API |
| `463:7263` | 65. Profile view other users | 453 x 705 | `65-profile-view-other-users__463-7263.png` · UI export (520 x 725) |
| `1817:19254` | 76.  Edit message button | 308 x 73 | `76-edit-message-button__1817-19254.png` · API |
| `114992:20339` | Beispiel | 368 x 98 | `beispiel__114992-20339.png` · API |
| `114992:20608` | Beispiel | 368 x 138 | `beispiel__114992-20608.png` · API |
| `364:2288` | Channel Edition | 872 x 616 | `channel-edition__364-2288.png` · UI export (892 x 636) |
| `1817:19196` | Channel Edition (not functional but a preview) for check it functional go to the prototype view | 872 x 616 | `channel-edition-not-functional-but-a-preview-for-check-it-fu__1817-19196.png` · UI export (892 x 636) |
| `609:17312` | Profile view main | 398 x 600 | `profile-view-main__609-17312.png` · API |
| `163:188` | Profile view main | 500 x 600 | `profile-view-main__163-188.png` · API |

### 3.4 Design-system canvases (page Components, 2069 px) — 10 frames

| Node ID | Frame | W x H | Reference |
|---|---|---|---|
| `578:8624` | 00. General - Buttons \| Illustrations \| icons | 2069 x 2909 | `00-general-buttons-illustrations-icons__578-8624.png` · UI export |
| `578:8623` | 01. Onboarding - Log In \| Sign up \| Restore Password | 2069 x 2909 | `01-onboarding-log-in-sign-up-restore-password__578-8623.png` · UI export |
| `6194:22288` | 01b.  Sign up mobile | 2069 x 2909 | `01b-sign-up-mobile__6194-22288.png` · UI export |
| `578:8909` | 02. Main Menu | 2069 x 4118 | `02-main-menu__578-8909.png` · UI export |
| `680:15883` | 02B. mobile Main menu and chat | 2069 x 2909 | `02b-mobile-main-menu-and-chat__680-15883.png` · UI export |
| `578:8940` | 03. Channel info \| Add channel overlay \| Add members overlay(s) \| Members overlay | 2069 x 2909 | `03-channel-info-add-channel-overlay-add-members-overlay-s-me__578-8940.png` · UI export |
| `1811:15787` | 03B. Channel info \| Add channel overlay \| Add members overlay(s) \| Members overlay | 2069 x 2909 | `03b-channel-info-add-channel-overlay-add-members-overlay-s-m__1811-15787.png` · UI export |
| `578:8968` | 04. Chats - Message hover main chat \| Message hover aux chat \| Text Buton \| Reactions menu overlay | 2069 x 2909 | `04-chats-message-hover-main-chat-message-hover-aux-chat-text__578-8968.png` · UI export |
| `578:8969` | 05. Writing Message \| Profil Overlay \| Profile preview | 2069 x 3647 | `05-writing-message-profil-overlay-profile-preview__578-8969.png` · UI export |
| `1817:19999` | 05. Writing Message \| Profil Overlay \| Profile preview | 2069 x 2909 | `05-writing-message-profil-overlay-profile-preview__1817-19999.png` · UI export |

### 3.5 Thumbnail (page TN) — 1 frame

| Node ID | Frame | W x H | Reference |
|---|---|---|---|
| `3341:19494` | DABubble Tumbnail | 1920 x 1080 | `dabubble-tumbnail__3341-19494.png` · UI export |

## 4. Components

Full inventory with every variant: `components.md`. The variant is authoritative, never the set container.

### 4.1 Buttons

| Component | Variant | Size | Padding | Radius | Fill | Stroke | Text |
|---|---|---|---|---|---|---|---|
| `10. Button primary` | Default `157:371` | hug x 49 | 12/25 | 25 | `#444DF2` | – | Nunito 18/700 white |
| | Hover `157:373` | | | | `#797EF3` | – | |
| | Click `157:376` | | | | `#444DF2` | – | |
| | Disable `187:164` | | | | `#686868` | – | |
| `11. Button secondary` | Default `157:381` | hug x 49 | 12/25 | 25 | – | `#797EF3` 1 | Nunito 18/700 `#444DF2` |
| | Hover `157:383` | | | | `#535AF1` | – | white |
| | Click `157:385` | | | | `#444DF2` | – | white |
| | Variant4 `429:2043` | | | | – | `#686868` 1 | (disabled look) |
| `58. Button primary + icon` | Default / Hover / Click | 150 x 49 | 12/25 | 50 | `#444DF2` / `#797EF3` / `#444DF2` | – | |
| `12. Google Log in` | Default `163:50` | 500 x 60 | 11/32, gap 10 | 100 | `#ECEEFE` | – | Nunito 18/400 `#444DF2` |
| | Hover `163:56` | | gap 30 | | | `#444DF2` 1 | 18/700 |
| | Click `163:62` | | gap 30 | | | `#686868` 1 | 18/500 |
| Icon buttons `16. edit_square`, `45. Close`, `44. Add members button` | Default / Hover | 40 x 40 | 8 | 20 | – / `#ECEEFE` | – | icon 24 |
| `19. add` | Default / Hover / Click | 30 x 30 | 3 | 15 | – / `#ECEEFE` | – | icon 24 |
| `59. add reaction` | Default / Hover | 34 x 34 | 5 | 20 | white / `#ECEEFE` | – | icon 24 |
| `8. Sign up` ("Konto erstellen") | Default / Hover | 173 / 174 x 42 | 10/15 | – / 30 | – | – / `#ADB0D9` 1 | Figtree 18/400 → 500 `#797EF3` |
| `9. Forgot my password` | Default / Hover | 200 / 201 x 32 | 5/15 | – / 30 | – / `#ECEEFE` | – | Figtree 18/400 → 500 |

Not defined in Figma: focus state of every button; disabled state of the secondary button (Variant4 is unnamed).
Layout-shift risks: Google button gap 10 → 30 and new stroke on hover; text links change weight on hover
(400 → 500/700) and grow by 1–3 px (`8.`, `9.`, `50. button Antworten` 104 → 107).

### 4.2 Input fields

Auth inputs `2. Email`, `3. Password`, `4. Name`, `5. Password Sign in` share one structure:

| Variant | Node (Email) | Box | Stroke | Content |
|---|---|---|---|---|
| Default | `662:13108` | 500 x 60, padding 18/32, radius 100, `#ECEEFE`, icon 24 + gap 30 | – | placeholder Nunito 18/500 `#686868` |
| Hover | `662:13109` | same | `#686868` 1 | |
| Click | `662:13117` | same | `#535AF1` 1 | caret |
| Write | `662:13133` | same | `#535AF1` 1 | text `#000000` |
| Done | `662:13141` | same | – | text `#000000` |
| Error | `662:13125` | 500 x 85 (field + gap 6 + message) | `#535AF1` 1 | message Nunito 14/400 `#ED1E79` |

Error texts in the file: "*Diese E-Mail-Adresse ist leider ungültig." (`662:13055`), "Falsches Passwort. Bitte noch einmal versuchen." (`I157:363;662:13526`).
The error variant grows the component from 60 to 85 px (layout-shift risk unless space is reserved).

Other fields:

| Component | Variants | Size | Padding | Radius | Stroke per state |
|---|---|---|---|---|---|
| `6. New password text box` | Default, Hover, Click, Write, Done | 400 x 58 | 18/32 | 100 | – / `#ADB0D9` / `#535AF1` / `#535AF1` / – (fill `#ECEEFE`) |
| `33. Text box + ICON` (channel name) | Default, Hover, Write | 792 x 60 | 18/20 | 40 | `#ADB0D9` / `#797EF3` / `#535AF1` |
| `35. Basic Text box` | Default, Hover, Click | 434 x 55 | 15/20 | 30 | `#ADB0D9` / `#797EF3` / `#444DF2` |
| `61. Message box main` | Default, Hover, Click for write, person search, channel search | 855 x 145 | 20 | 20 | `#ADB0D9` / `#797EF3` / `#444DF2` |
| `79. Privacy policy check mark` | Default, Variant2 | 368 x 32, gap 8 | – | – | checkbox icon 24 + Open Sans 16 |

Not defined in Figma: error state for channel name (duplicate check), for the message box and for the profile name.

### 4.3 Navigation (workspace menu)

| Component | Variants | Size | Padding | Text |
|---|---|---|---|---|
| `15. Channel name` (workspace header "Devspace") | 3 | 250 x 60 | gap 15 | workspace logo 60 + name |
| `17. Channels UX` | Default, Hover dropdown, Click, Default 2, Hover wrap, click wrap | 176 x 40 | 5/10/5/0, gap 15, radius 15 | Nunito 20/700 |
| `23. Direktnachrichten UX` | same six | 254 x 40 | 5/10/5/0, gap 15 | Nunito 20/700 |
| `21. Channels submenu` | Default; appears by # searching | 306 x 125; 348 x 169 | – ; 20/21, radius 0/20/20/20, stroke `#ADB0D9`, shadow header | Nunito 18/400 |
| `77. Hide/show navigation bar` | Default, hide nav hover, show nav, show nav hover | 56–60 x 310–339 | 20/12, radius 0/30/30/0 | 20/500 → hover 20/700 `#535AF1` |

Layout-shift risk: navigation tab grows 56 → 60 px on hover (bold text).

### 4.4 Messages, reactions, threads

| Component | Variant | Values |
|---|---|---|
| `48. Messages main chat` | Message 1 `463:3743` (others) | row padding 10/0/10/45, gap 30; avatar 70; name 18/700 + time 14/400 `#686868`; bubble padding 15, radius 0/30/30/30, `#ECEEFE`, text 18/400; footer "2 Antworten" 18/400 `#535AF1` + "Letzte Antwort 14:56" 14/400 |
| | Message 1 hover `463:4243` | row fill `#ECEEFE`; both variants contain the reaction bar `52B.` (210 x 46) at the top right |
| | message 2 `481:5496` (own) | padding 10/45/10/146, right-aligned; bubble radius 30/0/30/30, `#797EF3`, text white |
| | Edit message `1823:16282` | row fill `#ECEEFE`, edit field inside |
| `52. Reaction bar` | 7 variants | 255 x 46, padding 3/15/3/20, gap 5, radius 25/25/0/25, white, stroke `#ADB0D9`; buttons 40 x 40 radius 20: check, raising hands, add reaction, comment (thread), more (option) |
| `54.–57. … reaction` | per emoji | reaction chip 64 x 34, padding 5/10, radius 20, stroke `#ADB0D9`, emoji 24 + count 16/400; hover tooltip "<Name> hat reagiert" (name 18/700, text 16/400, white on `#797EF3`) |
| `76. Edit message button` | 1 | 308 x 73, padding 10/20, "Nachricht bearbeiten" |

Reaction limits and overflow: note `114942:24051` (section 5).

### 4.5 Dialogs and overlays

| Frame | Node | Size | Padding / gap | Radius | Shadow |
|---|---|---|---|---|---|
| 37. Add channel | `332:2317` | 872 x 539 | 40 / 20 | 30 | overlay |
| 38. Add Members after add channel | `578:8542` | 710 x 279 | 40 / 20 | 30 | overlay |
| 41. Add members R corner | `556:10162` | 514 x 294 | 40 / 20 | 30/0/30/30 | overlay |
| 43. Members | `388:2847` | 415 x 411 | 40 / 20 | 30/0/30/30 | overlay |
| Channel Edition | `364:2288` | 872 x 616 | – | 30 | overlay |
| 64. Edit user and Log out | `379:2221` | 282 x 181 | 30 / 15 | 30/0/30/30 | overlay |
| 65. Profile view other users | `463:7142` set | 500 x 705 | 40 / 45 | 30 | overlay |
| 65. Edit Profile | `1808:15920` | 500 x 596 | 40 / 45 | 30 | overlay |
| Toasts 03B / 04B / 05B | `182:281`, `182:544`, `182:546` | 273–531 x 149, fill `#444DF2` | 50 / 10–28 | 30/30/0/30 | overlay |

Mobile variants (`…b`) use 398–430 px width and sheets from the bottom with radius 30/30/0/0.

## 5. Notes from the source file

All notes are on page Prototype, font Patrick Hand 40/400.

**`849:13886` — "Note 1"**
> Button ist nur aktiv, wenn das Formular komplett ausgefüllt ist.

*The button is only active when the form is completely filled in.*

**`849:12142` — "Note 2"**
> Nur  aktiv, wenn eine E-Mail-Adresse eingegeben wurde.

*Only active when an e-mail address has been entered.*

**`182:427` — "Note 3"**
> In dem zu implementierenden Anwendungsszenario für das Zurücksetzen des Passworts, erhält der Nutzer zuerst eine E-Mail mit einem darin enthaltenen Link. Dieser Link leitet den Nutzer zur Seite weiter, auf der er sein neues Passwort festlegen kann. Beachte, dass dieser Schritt im Prototypen nicht berücksichtigt wurde.

*In the password-reset scenario to be implemented, the user first receives an e-mail containing a link. The link leads to the page where the new password is set. Note that this step is not part of the prototype.*

**`202:210` — "Note 4"**
> Der Button wird nur aktiv wenn die Passwörter übereinstimmen.

*The button only becomes active when the passwords match.*

**`324:2313` — "Note 5"**
> Die Suchleiste filtert und liefert Ergebnisse aus Kanälen, Benutzerprofilen und spezifischen Nachrichten innerhalb des Workspace.

*The search bar filters and returns results from channels, user profiles and specific messages within the workspace.*

**`719:15161` — "Note 6"**
> Button ist nur aktiv und klickbar, wenn eine Auswahl getroffen wurde.

*The button is only active and clickable once a selection has been made.*

**`334:2536` — "Note 7"**
> Nach Klick auf 'Erstellen' erscheint der neue Channel unten in der Channel-Sektion.

*After clicking "Erstellen" the new channel appears at the bottom of the channel section.*

**`516:10008` — "Note 8"**
> Ein Klick auf ein Mitglied, zeigt dessen Benutzerprofil an.

*Clicking a member shows that member's user profile.*

**`516:10110` — "Note9"**
> Beim Schreiben einer neuen Nachricht in DAbubble ermöglicht die Suchfunktion mit automcomplete eine einfache Bestimmung des Nachrichtenadressaten. Mit "#" und "@" kann nach Channels bzw.  Mitgliedern gefiltert werden.

*When writing a new message in DAbubble, the search with autocomplete makes it easy to pick the recipient. "#" filters channels, "@" filters members.*

**`4628:15879` — "Note 10"**
> Du kannst Threads auf zwei Arten öffnen:
> 1. Wenn du über eine Nachricht fährst, erscheint ein aufklappendes Menü mit einem “Thread starten” icon.
> 2. Bei Nachrichten, die schon Antworten haben, kannst du direkt auf den Textlink klicken, der die Anzahl der Antworten anzeigt. In unserem Fall werden "2 Antworten" als Textlink angezeigt. Das Design der thread componente kannst im Prototypen und unter „Components“-Tab -> Rahmen 04 Chat anschauen.

*Threads open in two ways: 1. hovering a message shows a menu with a "start thread" icon; 2. on messages that already have replies, the text link with the reply count ("2 Antworten") opens the thread. The thread component is on page Components, frame 04 Chat.*

**`114942:24051` — "Note 11"**
> Auf dem Desktop werden maximal 20 Reaktionen pro Nachricht angezeigt. In Threads und auf Mobilgeräten empfehlen wir, maximal 7 Reaktionen in zwei Zeilen darzustellen. Wenn es mehr als 7 sind, sollte ein Rahmen mit einem Hinweis wie „+X weitere“ erscheinen. Beim  Klicken können alle Reaktionen sowie die Option „Weniger anzeigen“ eingeblendet werden.

*On desktop at most 20 reactions per message are shown. In threads and on mobile at most 7 reactions in two rows are recommended; beyond 7 a chip such as "+X weitere" appears. Clicking it shows all reactions plus the option "Weniger anzeigen".*

**`609:17621` — "Note 1M"**
> this should not be connected. The reset password only opens with the link in the email. It is just conected for show it in the prototype.

*(English in the original.)*

**`609:17613` — "Note 2M"**
> Der Button wird erst aktiv, sobald die Passwörter identisch sind.

*The button only becomes active once the passwords are identical.*

**`116184:23250` — "Note 2M"**
> Dies sind die beiden Ansichten, wenn der Benutzer @ oder # in die Suchleiste eingibt. Schließen-Symbol oben rechts bringt Sie zur vorherigen Ansicht zurück.

*These are the two views when the user types @ or # into the search bar. The close icon at the top right returns to the previous view.*

**`609:17634` — "Note 3M"**
> Das ist nur eine Voransicht. Die Funktion kannst du im Prototypen nachvollziehen.

*This is only a preview. The function can be followed in the prototype.*

Other instruction text in the file:
- `813:12259`: "Icons from: Material Symbols by Google Fonts".
- `813:12082`: "The emoticons used for reactions were taken as a resource from iconduck - Emojitwo Emoji Set."
- Frame name `1817:19196`: "Channel Edition (not functional but a preview) for check it functional go to the prototype view".

Timing from the prototype connections (not notes, but the only motion data in the file):

| From | Trigger | To | Transition |
|---|---|---|---|
| Intro `128:765` / `609:17310` | after 2.5 s | 01-Log In | Smart animate 0.5 s ease-out |
| Logo animation Default `169:94` | after 0.5 s | Step 1 `169:107` | Smart animate 0.3 s ease-out |
| Step 1 `169:107` | after 0.001 s | Final `169:121` | Smart animate 0.5 s ease-out |
| Toasts 03B / 04B / 05B | after 1.3 s | next screen | Dissolve 0.2 s ease-out |
| Hover states (1626 hover triggers) | hover | variant | mostly Smart animate 0.08–0.1 s ease-in |

## 6. Open questions and conflicts

Requirements source: `docs/DA_Checkliste/DaBubble Checkliste.md` (DA checklist, version 2024).

### 6.1 Reconciliation with the requirements — present in the design

| Requirements item | Evidence in the design |
|---|---|
| Konto US1 registration (name, e-mail, password), avatar choice | `171:66` / `609:17276` 02-Sign In; `6179:15943` / `6194:22230` 03-Choose avatar; Note 1; toast "Konto erfolgreich erstellt!" `182:281` |
| Konto US1 specific error messages | error variants of `2. Email`, `3. Password` |
| Konto US2 login with errors under the field | `125:2` / `609:17202` 01-Log In, error texts in section 4.2 |
| Konto US3 forgot password | `182:319` / `609:17234` 04-Send email (Note 2), toast "E-Mail gesendet" `182:544`, Gmail mock-up `1898:19353`, `182:372` / `609:17257` 05-Reset password (Notes 3, 4, 1M, 2M) |
| Konto US4 edit name | `64. Edit user and Log out` `379:2221`, `65. Edit Profile` `1808:15920` ("Dein Profil bearbeiten", "Vollständiger Name", Abbrechen / Speichern) |
| Konto US5 collapse menu, separate mobile views | `77. Hide/show navigation bar`; `516:7084` 07 hidden menu, `516:9116` 09 hidden menu and chat; mobile `678:15601`, `609:17393`, `742:12168` |
| Konto US6 (optional) online status | online dot `#92C83E`, "Aktiv" / "Abwesend" in profile views (`I894:18251;894:16994`) |
| Schreiben US1 direct messages, also to oneself | `757:12479` … `890:14526` (12 E: "Frederik Beck (Du)"), mobile `116336:22036` … `894:15580` |
| Schreiben US2 reactions, two quick reactions, limits, who reacted | `52. Reaction bar`, `54.–57.` with tooltip "hat reagiert", Note 11 |
| Schreiben US3 emojis in messages, counters | `sentiment_satisfied` in `61. Message box main`, counter in reaction chips |
| Schreiben US4 new message with # and @ | `723:10986` 11 new message, `754:12776` 09-New message mobile, Note 9, `61. Message box main` › person search / channel search |
| Schreiben US5 threads in channels and DMs, # / @ | thread panel `210:752`, Note 10, comment icon in reaction bar |
| Schreiben US6 search with # / @, context, live filter | search bar `116174:20661`, Note 5, mobile `116184:22571` / `116184:23002`, Note 2M (`116184:23250`) |
| Channels US1 create with name and description, invite | `332:2317` 37. Add channel, `578:8542` 38. Add members ("Alle Mitglieder von Entwicklerteam hinzufügen" / "Bestimmte Leute hinzufügen"), Notes 6, 7 |
| Channels US2 add members later | `556:10162` 41. Add members, `388:2847` 43. Members, Note 8 |
| Channels US3 leave channel | "Channel verlassen" in Channel Edition `364:2288` |
| Channels US4 edit name and description | Channel Edition `364:2288`, "Bearbeiten" links, mobile `719:15164` |
| Allgemein design 1:1, cursor and states | hover / click variants for buttons, inputs, list items |

### 6.2 Reconciliation with the requirements — NOT present in the design

| Missing | Requirements reference |
|---|---|
| Avatar change in the profile (edit dialog only has the name; e-mail field is hidden) | Konto US4 |
| Registration with Google (button exists only as "Anmelden mit Google" on the login page) | Konto US1 (optional) |
| Confirmation e-mail after registration | Konto US1 (optional) |
| Offline state of the online status (only "Aktiv" and "Abwesend") | Konto US6 (optional) |
| Error / warning when editing a channel fails | Channels US4 |
| Error for a duplicate channel name | Channels US1, US4 |
| Focus jumps into the input field after switching chats (behaviour) | Schreiben US1 |
| Emoji picker content beyond the four emojis | Schreiben US3 |
| "+X weitere" chip and "Weniger anzeigen" (only described in Note 11) | Schreiben US2 |
| Favicon | Allgemein |
| Artboards for 320–429 px | Allgemein, responsiveness |

### 6.3 Present in the design, not mentioned in the requirements

- Guest login: secondary button "Gäste-Login" on 01-Log In (`I163:1326;157:382`).
- Intro animation `128:765` / `609:17310` with logo animation `169:93`.
- Impressum and Datenschutz pages `5538:15876`, `5538:16655`, mobile `156062:17209`, `156062:17306`; footer links on all auth screens.
- Privacy checkbox on registration (`79. Privacy policy check mark`).
- Edit own message: frames 13–16 (`1823:16615` …), `76. Edit message button`, variant `Edit message`.
- Date separators in the chat (`210:1106`).
- Success toasts "Konto erfolgreich erstellt!", "E-Mail gesendet", "Anmelden".
- Logout in `64. Edit user and Log out`.
- Members counter and avatars in the channel header (`46. Members Miniatures Chat info`).

### 6.4 Contradictions within the file

| # | Contradiction | Candidates and origin |
|---|---|---|
| 1 | Duplicate styles | Black, White, Purple 1, Purple 2, Ligth purple, Text gray exist as local and remote styles with identical values |
| 2 | Style name typo | "Ligth purple (Lines)" (`60:132`) |
| 3 | Body font | text style "Version 2/body" is Open Sans 16/400; actual body text is Nunito 18/400 on 1156 nodes |
| 4 | Link label | layer "Account erstellen" vs. text "Konto erstellen" (`171:58`); the component `8. Sign up` still shows "Account erstellen" |
| 5 | Umlaut | "Workspace-Menü schließen" (`1852:19282`) vs. "Workspace-Menu öffnen" (`1854:19294`) |
| 6 | Font size of "Passwort vergessen?" | 17 px on `01-Log In` vs. 18 px in the component `9. Forgot my password` |
| 7 | Layer vs. text in add members | layer "Alle Mitglieder von OfficeTeam hinzufügen" vs. text "… von Entwicklerteam …" (`I578:8542;578:8290`) |
| 8 | Icon name vs. drawing | layer "person_filled" is drawn as outline (`I609:17295;662:13274`) |
| 9 | Grid vs. layout | 12-column grid on 1534 px, but panels are 989 + 485 px with 20 px gaps |
| 10 | Many radii | 24 distinct values (section 1.6) |
| 11 | Toast text | the third success toast says "Anmelden" (`182:547`), not a success message |
| 12 | Hidden components | set `15. Hide/Show menu` `432:2906` and `31. Workspaces menú` `324:2281` are hidden, their instances are visible |

### 6.5 Collision design directive ↔ project rule

| # | Design says | Rule says | Affected |
|---|---|---|---|
| 1 | font sizes 10–15 px on 238 text nodes (timestamps, errors, "Letzte Antwort") | Thomas' global rule: at least 16 px (not in the project CLAUDE.md; DA requires design 1:1) | `48.` messages, input errors |
| 2 | icon buttons 30, 34, 40 px | touch targets ≥ 44 px (WCAG 2.5.5 recommendation) | `19. add`, `59. add reaction`, `16. edit_square`, `45. Close`, reaction bar |
| 3 | text `#797EF3` on white 3.45 : 1, on `#ECEEFE` 2.99 : 1 | contrast ≥ 4.5 : 1 for normal text | "Passwort vergessen?", "Konto erstellen", own bubble text white on `#797EF3` |
| 4 | error text `#ED1E79` 14 px on white 4.15 : 1 | contrast ≥ 4.5 : 1 | input error messages |
| 5 | hover changes font weight and size of text links and the nav tab; error variant grows the field 60 → 85 px | no layout shifts | `8.`, `9.`, `50.`, `77.`, auth inputs |
| 6 | no focus states | keyboard operability | all interactive components |
| 7 | mobile artboard 430 px | DA: responsive down to 320 px | all mobile screens |

### 6.6 Not defined in Figma

- Focus states; loading states; empty states (no channels, no messages, no search hits).
- Behaviour between 431 and 1919 px and below 430 px; maximum content width above 1920 px.
- Offline status; how "Abwesend" is determined.
- Emoji picker content and layout beyond the four reaction emojis.
- Character limits of names, channel names and messages.
- Error states for channel name, profile name and message box.
- Avatar change after registration.
- Favicon.
- Delete message.

### 6.7 Technical limitations during extraction

| Item | Finding |
|---|---|
| Rate limit | After 3 `GET /v1/files` and 6 `GET /v1/images` calls the API answered `429` with `Retry-After: 399126` (≈ 4.6 days), `x-figma-plan-tier: starter`, `x-figma-rate-limit-type: low`. Further renders possible from 2026-10-26 06:13 UTC (07:13 CET) |
| References after the limit | The 67 remaining frames (all screens, the component canvases, the thumbnail) were exported through the Figma export panel (PNG 1x) in Chrome on 2026-10-21; export settings removed afterwards. Duplicate layer names (`Channel edition`, `65. Profile view other users`) were matched visually; drop shadows enlarge some images by 20 px |
| Null renders | `2410:19668` and `I609:17311;2410:19668` (white logo name, invisible in the animation start state); white logo derived from the black one |
| Hidden frame | `324:2281` "31. Workspaces menú" not rendered |
| Icons | not exported from Figma; Material Symbols Rounded taken from the source (MANIFEST section 3) |
| Unused image fills | `image-fills.json` lists 47 imageRefs; only 4 are used, 1 of them in the app |

## 7. Provenance and reproducibility

| Artifact | Produced by | Source |
|---|---|---|
| `spec.md`, `components.md` | skill `figma-extract` (`analyze_cache.py`) plus manual analysis of the cache | `.figma-cache/file.json` version `2412825337076141628` |
| Assets in `public/img/` | `GET /v1/images?format=svg` (2 calls), Material Symbols (GitHub), original image `e5c12f2d…` | `.figma-cache/svg-urls-assets.json`, `.figma-cache/image-fills.json` |
| Fonts in `public/fonts/` | Google Fonts css2 API, variable woff2 | `.figma-cache/google-fonts.css` |
| `reference/*.png` (30) | `GET /v1/images?format=png&scale=1`, batches 1–3 of 21 | `.figma-cache/ref-urls-1..3.json`, plan in `.figma-cache/ref-plan.json` |
| `reference/*.png` (67) | Figma export panel, PNG 1x, pages Prototype, Components, TN | mapping frame → export entry in `.figma-cache/ref-ui-export.json` |
| Icon style decision | visual comparison Figma render ↔ Material Outlined / Rounded | `.figma-cache/compare/` |

API calls in this run: 3 × `GET /v1/files` (two access tests with `depth`, one full download),
1 × `GET /v1/files/:key/images`, 6 × `GET /v1/images` successful (3 SVG, 3 PNG), at least 2 × `GET /v1/images`
rejected with 429, plus 1 call rejected with the expired old token. Follow-up questions about values need no
API call: everything is in the cache.

## 8. Tokens in the implementation

`src/styles/_tokens.scss` holds the foundations as CSS custom properties. The origin of every value is
listed here, not as a comment in the stylesheet.

| Token | Value | Source |
|---|---|---|
| `--color-purple-1` | `#444DF2` | style Purple 1 (`84:1049`) |
| `--color-purple-2` | `#797EF3` | style Purple 2 (`72:694`) |
| `--color-purple-3` | `#535AF1` | style Purple 3 (`75:779`) |
| `--color-bg` | `#ECEEFE` | style Bg color (`20:22`) |
| `--color-lines` | `#ADB0D9` | style Ligth purple (Lines) (`60:132`) |
| `--color-text-gray` | `#686868` | style Text gray (`61:325`) |
| `--color-black`, `--color-white` | `#000000`, `#FFFFFF` | styles Black (`60:259`), White (`20:21`) |
| `--color-error` | `#ED1E79` | style Rosa error (`145:167`) |
| `--color-online` | `#92C83E` | style online green (`92:2448`) |
| `--color-label` | `#42526E` | style menu color (`5538:20926`), privacy checkbox label |
| `--color-mail-link` | `#1381FF` | e-mail link in profile views (`163:235`) |
| `--color-icon` | `#1C1B1F` | Material Symbols instances (`more_vert`, `edit`) |
| `--color-primary`, `--color-primary-hover`, `--color-accent`, `--color-disabled` | aliases | `10. Button primary` Default / Hover, input focus stroke, `Disable` variant (section 4.1, 4.2) |
| `--color-own-bubble`, `--color-other-bubble` | aliases | `481:5501`, `463:3849` (section 4.4) |
| `--gradient-intro` | `linear-gradient(0deg, #313AE5 0%, #797EF3 100%)` | fill of `128:765`; handles run from bottom (0.49, 1.0) to top (0.5, 0.0) |
| `--font-main`, `--font-link`, `--font-label` | Nunito, Figtree, Open Sans | section 1.3 |
| `--font-size-display` … `--font-size-small` | 46, 36, 32, 24, 20, 18, 16, 14 px | text styles and roles in section 1.2; sizes below 14 px are raised to 14 px (project rule, section 6.5) |
| `--line-height-auto`, `--line-height-tight` | 1.364, 1.2 | Nunito "auto" (24.6 / 18, 32.7 / 24) and the 120 % of the text styles |
| `--radius-*` | see file | section 1.6 |
| `--shadow-header`, `--shadow-overlay`, `--shadow-nav-tab`, `--shadow-sheet` | see file | section 1.5 |
| `--shell-*` | 20, 25, 70, 80, 366, 485 px | app shell, section 2.4 |
| `--touch-target-min` | 44 px | project rule, not from Figma (section 6.5) |
| `--duration-hover`, `--easing-hover` | 100 ms, ease-in | prototype transitions, section 5 |

Not from Figma (implementation decisions): the global focus outline (2 px `--color-accent`, section 6.6
lists no focus states) and the reset of default borders on inputs and buttons (DA checklist).

### 8.1 Shared components

`src/app/shared/components/`. Values come from section 4; deviations are listed with their reason.

| Component | Figma source | Deviation from Figma |
|---|---|---|
| `app-button` (`variant` primary / secondary) | `10. Button primary` `157:371`, `11. Button secondary` `157:381`, states Hover, Click, Disable / Variant4 | none; the 1 px border is drawn inside the 12/25 padding (11/24 + 1), so the height stays 49 px |
| `app-input-field` (`icon`, `error`) | `2. Email` `662:13108`–`662:13141` (same build as `3. Password`, `4. Name`) | the error line (14 px, 6 px gap) is always reserved, so the field is 85 px high in every state instead of 60 → 85 px only on error (no layout shift) |
| `app-avatar` (`size`, `status`) | `00c.Charaters`, presence dot `I740:11440;388:2756;298:846;281:383` (14 px on 50 px), `I1823:16460;379:2277` (17 px from 70 px) | none; away = `#686868` dot as in `I894:18251;894:16994` |
| `app-dialog` (`heading`, `open`) | `37. Add channel` `332:2317`, `38. Add Members` `578:8542`, `45. Close` `453:12978` | close button 44 × 44 px instead of 40 × 40 (touch-target rule); backdrop transparent because the prototype sets no overlay background |

### 8.2 Breakpoints and workspace frame

Breakpoints are an implementation decision (section 2.3), agreed in the team on 2026-10-21.
Mixins in `src/styles/_breakpoints.scss`.

| Range | Name | Behaviour |
|---|---|---|
| ≥ 1440 px | `wide` | menu, chat and thread side by side (366 / fill / 485 px, gutters 20 px), as `210:750` |
| 768–1439 px | `tablet` | at most two panels: menu + chat; an open thread replaces the menu (chat + thread, thread at most 485 px or half the width), as the "hidden menu" frames `516:7084`, `516:9116` |
| < 768 px | `mobile` | one panel at a time: menu → chat → thread, header 80 px, back arrow, as `678:15601`, `609:17393`, `742:12168` |

Frame `src/app/features/workspace/` (checked in the browser at 1920, 1440, 1024, 768, 430, 320 px,
no horizontal scroll):

| Element | Figma | Implementation |
|---|---|---|
| Panels at 1920 px | menu x 20 / 366, chat x 406 / 989, thread x 1415 / 485 | identical |
| Menu collapsed | chat x 20 / 1375 (`516:7084`) | identical; no width animation (Figma: Smart animate) |
| Mobile menu | x 16, y 92, 398 × 820 (`678:15602`) | identical |
| Navigation tab | `77.` at y 581–600 of 1080 | anchored 156 px above the bottom edge, so it stays inside the menu on lower screens |
| Mobile header in chat and thread | back arrow + "Devspace" (`15B. Channel name`) | back arrow + DABubble logo until the Devspace logo is exported (`docs/todo.md`) |

### 8.3 Legal pages

`src/app/features/legal/`, routes `/impressum` and `/datenschutz` (no login needed). Texts are the
placeholders of Figma (`5538:17437`, `5538:17487`, `165983:17011` …) until the team supplies real
content. Desktop: card centred in the window as in `5538:17434`, privacy title at y 138 as in
`165983:17007`; mobile: content at x 15 / y 122 as in `156062:17294`, `165983:20669`. The empty
lines Figma keeps after the text blocks (trailing line breaks) are not reproduced.
