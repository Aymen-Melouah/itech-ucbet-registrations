# i-Tech UCBET – membership form

Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS 3. Black background, white outlines, Outfit font, animated ASCII art in the background.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/app/page.tsx` | Page layout: logo, title, form |
| `src/components/MembershipForm.tsx` | The form, validation, success screen |
| `src/components/AsciiBackground.tsx` | The six animated ASCII figures |
| `src/data/faculties.ts` | Faculties and departments, edit to match the university's offer |
| `src/data/ascii.ts` | Generated ASCII frames (logo, globe, rings, chip, robot) |
| `src/data/terminal.ts` | Terminal typing animation |
| `public/logo.png` | The club logo |

## Receiving applications

The form only shows its confirmation screen until you give it somewhere to post. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_FORM_ENDPOINT` to a Formspree, Google Apps Script or your own API URL. The form sends the application there as JSON.

Animations stop automatically for visitors who prefer reduced motion.
