# Asset manifest

Source: Figma file `DABubble (Slack Clone) (Kopie)`, file key `hG2eUDuNMyBF949FkvUOSS`,
state `lastModified 2026-10-21T14:26:38Z`, version `2412825337076141628`.
All measures in px. "Display size" = size of the node in the Figma design.
Asset root: `public/` (Angular asset folder; images under `public/img/`, fonts under `public/fonts/`).

## 1. Logos (SVG, exported from Figma)

| File | Source node | Node name | Display size | Origin |
|---|---|---|---|---|
| `img/logos/logo-mark.svg` | `169:96` | Logo (in `1. Logo animation` › Default) | 187 x 184 (header instances 70 x 70, mobile 45 x 45) | Figma /v1/images SVG |
| `img/logos/logo-name-black.svg` | `2104:21344` | Logo name (in `14. Home-Workspaces` › Default) | 156 x 24 | Figma /v1/images SVG |
| `img/logos/logo-name-white.svg` | derived from `2104:21344` | — | 156 x 24 | Copy of `logo-name-black.svg` with `fill="black"` → `fill="white"`. The white originals (`2410:19668`, `I609:17311;2410:19668`, intro animation) render as `null` because they are invisible in their start state; glyphs are identical (same 8 vectors, scale 3:1) |
| `img/logos/google-g.svg` | `163:93` | Google (in `12. Google Log in` › Default) | 38 x 38 | Figma /v1/images SVG |

## 2. Icons from Figma (SVG)

| File | Source node | Node name | Display size | Origin |
|---|---|---|---|---|
| `img/icons/hide-navigation.svg` | `1852:19277` | `15. Hide/Show menu` instance in `77. Hide/show navigation bar` › Default | 32 x 32 | Figma /v1/images SVG (the set `432:2906` itself is hidden) |
| `img/icons/hide-navigation-hover.svg` | `1854:19286` | same, › hide nav hover | 32 x 32 | Figma /v1/images SVG |
| `img/icons/show-navigation.svg` | `1854:19293` | same, › show nav | 32 x 32 | Figma /v1/images SVG |
| `img/icons/show-navigation-hover.svg` | `1854:19300` | same, › show nav hover | 32 x 32 | Figma /v1/images SVG |
| `img/icons/checkbox-default.svg` | `5538:21004` | `78. Check button` › Default | 24 x 24 | Figma /v1/images SVG |
| `img/icons/checkbox-default-hover.svg` | `5538:21005` | › Default hover | 24 x 24 | Figma /v1/images SVG |
| `img/icons/checkbox-checked.svg` | `5538:21003` | › Checked | 24 x 24 | Figma /v1/images SVG |
| `img/icons/checkbox-checked-hover.svg` | `5538:21008` | › Checked hover | 24 x 24 | Figma /v1/images SVG |

## 3. Icons from an external library

The file states the source itself: text node `813:12259` "Icons from: Material Symbols by Google Fonts".
Style **Rounded**, weight 400, grade 0, optical size 24 — chosen by visual comparison of 24 Figma
renders (`.figma-cache/compare/figma-*.svg`) against the Outlined and Rounded sources: rounded line
ends on `add`, `close`, `arrow_back`; `send` is filled. The SVGs carry no `fill` attribute (default black);
colour them in CSS. Figma colours in use: `#000000`/`#1C1B1F` default, `#686868` inactive, `#535AF1` hover,
`#FFFFFF` on purple, `#444DF2` send.

| File | Symbol | Style | Source URL | Replaces node (example) | License |
|---|---|---|---|---|---|
| `img/icons/account-circle.svg` | account_circle | Rounded | `symbols/web/account_circle/materialsymbolsrounded/account_circle_24px.svg` | `813:12108` | Apache 2.0 |
| `img/icons/add.svg` | add | Rounded | `…/add/materialsymbolsrounded/add_24px.svg` | `210:1567` | Apache 2.0 |
| `img/icons/add-circle.svg` | add_circle | Rounded | `…/add_circle/materialsymbolsrounded/add_circle_24px.svg` | `235:367` | Apache 2.0 |
| `img/icons/add-reaction.svg` | add_reaction | Rounded | `…/add_reaction/materialsymbolsrounded/add_reaction_24px.svg` | `813:12127` | Apache 2.0 |
| `img/icons/alternate-email.svg` | alternate_email | Rounded | `…/alternate_email/materialsymbolsrounded/alternate_email_24px.svg` | `813:12163` | Apache 2.0 |
| `img/icons/arrow-back.svg` | arrow_back | Rounded | `…/arrow_back/materialsymbolsrounded/arrow_back_24px.svg` | `210:1628` | Apache 2.0 |
| `img/icons/arrow-drop-down.svg` | arrow_drop_down | Rounded | `…/arrow_drop_down/materialsymbolsrounded/arrow_drop_down_24px.svg` | `235:344` | Apache 2.0 |
| `img/icons/check-circle.svg` | check_circle | Rounded | `…/check_circle/materialsymbolsrounded/check_circle_24px.svg` | `1814:16197` | Apache 2.0 |
| `img/icons/close.svg` | close | Rounded | `…/close/materialsymbolsrounded/close_24px.svg` | `813:12181` | Apache 2.0 |
| `img/icons/comment.svg` | comment | Rounded | `…/comment/materialsymbolsrounded/comment_24px.svg` | `813:12172` | Apache 2.0 |
| `img/icons/edit.svg` | edit | Rounded | `…/edit/materialsymbolsrounded/edit_24px.svg` | `842:12274` | Apache 2.0 |
| `img/icons/edit-square.svg` | edit_square | Rounded | `…/edit_square/materialsymbolsrounded/edit_square_24px.svg` | `235:366` | Apache 2.0 |
| `img/icons/expand-more.svg` | expand_more | Rounded | `…/expand_more/materialsymbolsrounded/expand_more_24px.svg` | `842:12283` | Apache 2.0 |
| `img/icons/keyboard-arrow-down.svg` | keyboard_arrow_down | Rounded | `…/keyboard_arrow_down/materialsymbolsrounded/keyboard_arrow_down_24px.svg` | `842:12280` | Apache 2.0 |
| `img/icons/lock.svg` | lock | Rounded | `…/lock/materialsymbolsrounded/lock_24px.svg` | `I609:17297;662:13438` | Apache 2.0 |
| `img/icons/logout.svg` | logout | Rounded | `…/logout/materialsymbolsrounded/logout_24px.svg` | `842:12325` | Apache 2.0 |
| `img/icons/mail.svg` | mail | Rounded | `…/mail/materialsymbolsrounded/mail_24px.svg` | `662:13051` | Apache 2.0 |
| `img/icons/mode-comment.svg` | mode_comment | Rounded | `…/mode_comment/materialsymbolsrounded/mode_comment_24px.svg` | `813:12194` | Apache 2.0 |
| `img/icons/more-vert.svg` | more_vert | Rounded | `…/more_vert/materialsymbolsrounded/more_vert_24px.svg` | `I761:20143;761:19585` | Apache 2.0 |
| `img/icons/person.svg` | person | Rounded | `…/person/materialsymbolsrounded/person_24px.svg` | `I609:17295;662:13274` (layer name "person_filled", drawn as outline) | Apache 2.0 |
| `img/icons/person-add.svg` | person_add | Rounded | `…/person_add/materialsymbolsrounded/person_add_24px.svg` | `813:12110` | Apache 2.0 |
| `img/icons/search.svg` | search | Rounded | `…/search/materialsymbolsrounded/search_24px.svg` | `210:1597` | Apache 2.0 |
| `img/icons/send.svg` | send (fill 1) | Rounded, filled | `…/send/materialsymbolsrounded/send_fill1_24px.svg` | `813:12250` | Apache 2.0 |
| `img/icons/sentiment-satisfied.svg` | sentiment_satisfied | Rounded | `…/sentiment_satisfied/materialsymbolsrounded/sentiment_satisfied_24px.svg` | `813:12145` | Apache 2.0 |
| `img/icons/tag.svg` | tag | Rounded | `…/tag/materialsymbolsrounded/tag_24px.svg` | `813:12093` | Apache 2.0 |
| `img/icons/workspaces.svg` | workspaces | Rounded | `…/workspaces/materialsymbolsrounded/workspaces_24px.svg` | `813:12191` | Apache 2.0 |

Base URL: `https://raw.githubusercontent.com/google/material-design-icons/master/`.
`check_box_outline_blank` appears only in hidden nodes and was not exported.

## 4. Raster images

| File | Source node(s) | imageRef | Original size | Display size | Format | Note |
|---|---|---|---|---|---|---|
| `img/workspace-logo.png` | `237:498` (Workspace logo in `15. Channel name`) and its instances | `e5c12f2d3133e14c4587218c1ddb2c9be6823a07` | 500 x 500 | 60 x 60 (desktop), 50 x 50 | png | — |

Not exported: the three images on page TN (`3341:19503`, `3341:19507`, `3341:19564`) belong to the
portfolio thumbnail, not to the app. `image-fills.json` lists 47 imageRefs in total; the other 43 are
not used by any visible node.

## 5. Avatars and emojis (SVG, exported from Figma)

| File | Source node | Node name | Display size | Origin |
|---|---|---|---|---|
| `img/avatars/frederik-beck.svg` | `578:14791` | `00c.Charaters` › Frederik Beck | 500 x 500 (used at 50–120) | Figma /v1/images SVG |
| `img/avatars/sofia-mueller.svg` | `578:14792` | › Sofia Müller | 500 x 500 | Figma /v1/images SVG |
| `img/avatars/noah-braun.svg` | `578:14793` | › Noah Braun | 500 x 500 | Figma /v1/images SVG |
| `img/avatars/steffen-hoffmann.svg` | `578:14794` | › Steffen Hoffmann | 500 x 500 | Figma /v1/images SVG |
| `img/avatars/elias-neumann.svg` | `578:14795` | › Elias Neumann | 500 x 500 | Figma /v1/images SVG |
| `img/avatars/elise-roth.svg` | `578:14796` | › Elise Roth | 500 x 500 | Figma /v1/images SVG |
| `img/avatars/avatar-placeholder.svg` | `6179:20538` | `81. Profile` › Default (circle `#797EF3` + person) | 168 x 168 | Figma /v1/images SVG |
| `img/emojis/rocket.svg` | `495:4857` | `51. Emojis` › rocket | 24 x 24 | Figma /v1/images SVG |
| `img/emojis/white-heavy-check-mark.svg` | `495:4858` | › white heavy check mark | 24 x 24 | Figma /v1/images SVG |
| `img/emojis/nerd-face.svg` | `495:4859` | › nerd face | 24 x 24 | Figma /v1/images SVG |
| `img/emojis/raising-hands.svg` | `495:4860` | › person raising both hands in celebration | 24 x 24 | Figma /v1/images SVG |

Emoji origin according to the file (`813:12082`): "taken as a resource from iconduck - Emojitwo Emoji Set".

## 6. Fonts

| Family | Weights | Subsets | Files | Source | License |
|---|---|---|---|---|---|
| Nunito | 400–700 (variable) | latin, latin-ext | `fonts/nunito-variable-latin.woff2`, `fonts/nunito-variable-latin-ext.woff2` | Google Fonts css2 | OFL 1.1 |
| Figtree | 400–500 (variable) | latin, latin-ext | `fonts/figtree-variable-latin.woff2`, `fonts/figtree-variable-latin-ext.woff2` | Google Fonts css2 | OFL 1.1 |
| Open Sans | 400 (variable file) | latin, latin-ext | `fonts/open-sans-variable-latin.woff2`, `fonts/open-sans-variable-latin-ext.woff2` | Google Fonts css2 | OFL 1.1 |

`fonts/fonts.css` holds the `@font-face` rules with the original `unicode-range` values.
Not loaded: Inter (only the font-size documentation canvas `653:13221`), Roboto and Open Sans 600
(only the Gmail mock-up `1898:19353`), Patrick Hand (only designer notes), Figtree 800 (only thumbnail).
