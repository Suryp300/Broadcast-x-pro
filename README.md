# Broadcast-x-pro

Convert Excel/CSV contact lists into clean WhatsApp Business Broadcast CSVs — entirely in your browser.

## Why it's private by design
Every step — parsing, cleaning, validating, exporting — runs client-side with SheetJS and PapaParse.
No file is ever uploaded, no server exists, and no data is stored anywhere but your own browser's
localStorage (used only to remember your theme and last column mapping).

## Features
- Drag-and-drop or click-to-browse upload for `.xlsx`, `.xls`, and `.csv`
- Automatic column detection for Business Name, Phone, City, and Address, with manual override
- Phone cleaning engine that strips spaces, hyphens, slashes, dots, and parentheses
- Country code (+91/91) and trunk prefix (0) normalization
- Landline and toll-free rejection by STD code (040, 020, 022, 011, 033, 080, 044, 0471, 0484, 1800, 1860, 140)
- Strict validation: exactly 10 digits, starting with 6, 7, 8, or 9
- Duplicate detection (first occurrence kept)
- Missing-number detection, routed to its own report
- Live statistics dashboard: Total, Valid, Invalid, Duplicate, Landline, Missing, Ready to Export
- Searchable, sortable, paginated results table with status badges
- Five one-click CSV exports: WhatsApp, Invalid, Duplicate, Missing, Landline
- Undo/redo, dark/light mode, persisted preferences, toast notifications, keyboard shortcuts

## Keyboard shortcuts
| Shortcut | Action |
|---|---|
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z (or Ctrl+Y) | Redo |
| Ctrl/Cmd + K | Focus search |
| Ctrl/Cmd + J | Toggle dark/light mode |

## Getting started
\`\`\`bash
npm install
npm run dev
\`\`\`

## Build & deploy to GitHub Pages
\`\`\`bash
npm run build
npm run deploy
\`\`\`
Or push to `main` — the included GitHub Actions workflow builds and publishes automatically.

## Tech stack
React · TypeScript · Vite · Tailwind CSS · Zustand · React Hook Form · Zod · SheetJS · PapaParse · Lucide React

## Known limitation
A 10-digit number written without its leading 0 (e.g., a Bangalore landline typed as `8012345678`
instead of `08012345678`) is indistinguishable from a genuine mobile number and will pass validation.
This is a structural ambiguity in the input format, not a bug in the cleaning logic.

## License
MIT — see [LICENSE](./LICENSE).
