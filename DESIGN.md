# Finance Manager Visual Identity & Design System

## 1. Core Aesthetic: The "Calm Ledger" Philosophy
Finance Manager should feel like a trustworthy, unhurried place to look at your money — never alarming, never cluttered. Generous card padding, a single restrained accent color, and consistent red/green signaling let the *numbers* carry the visual weight, not the chrome around them. If a screen needs a new color to make sense, that's a sign the layout is doing too much.

## 2. Color Palette

### Primary (Tailwind `primary-*`, sky blue)
| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#f0f9ff` | Rare — tinted backgrounds only |
| `primary-100` | `#e0f2fe` | Hover backgrounds on light surfaces |
| `primary-500` | `#0ea5e9` | Chart accents, focus rings |
| `primary-600` | `#0284c7` | Default button background, links |
| `primary-700` | `#0369a1` | Button hover state |

### Semantic colors (money always speaks for itself)
| Meaning | Color | Where |
|---|---|---|
| Income / positive | `green-500` / `green-600` | Income amounts, "Savings" stat, success toasts |
| Expense / negative | `red-500` / `red-600` | Expense amounts, budget-exceeded states, danger buttons |
| Warning / near-limit | `yellow-500` / `yellow-600` | Budget progress bars at 80–99% used |
| Neutral surface | `gray-50` / `gray-100` / `gray-900` | Page background, borders, body text |

**Rule:** amounts are never colored by theme preference — they are colored by sign. Income is always green, expenses are always red, regardless of what section of the app you're in.

## 3. Layout & Spacing
- **App shell:** a persistent `Sidebar` (navigation) + `Header` (page context, user menu) wrapping a scrollable content area (`Layout.jsx`). This is the only chrome; everything else is page content.
- **Grid discipline:** dashboard stat cards use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`; chart/side-panel sections use `lg:grid-cols-3` with the primary chart spanning `lg:col-span-2`. Don't invent new breakpoint patterns — reuse these two.
- **Spacing rhythm:** sections are separated with `space-y-6`; content inside a card uses Tailwind's default spacing scale (`gap-3`, `gap-4`, `p-6` on `.card`). No arbitrary pixel values in `style={}` outside of computed values (e.g. a progress bar's `width: %`).
- **Cards, not tables**, for transaction lists — a `.card` containing a `divide-y divide-gray-100` list of rows. Dense data tables are reserved for exports (Excel), not the UI.

## 4. Component Classes
Defined once in `index.css` under `@layer components` — always reuse these instead of rewriting utility strings inline:

| Class | Use for |
|---|---|
| `.btn-primary` | Primary actions ("Add Income", "Save") |
| `.btn-secondary` | Cancel / secondary actions |
| `.btn-danger` | Destructive actions (delete confirmations) |
| `.btn-success` | Rare — explicit positive confirmations |
| `.input-field` (+ `.input-field-error`) | All form inputs, selects, and dates |
| `.card` / `.card-hover` | Any bordered content block |
| `.badge-success` / `.badge-danger` / `.badge-warning` / `.badge-info` | Small status labels (budget status, category tags) |

If a new pattern is needed more than twice, add it to `index.css` as a component class rather than repeating the Tailwind string across files.

## 5. UI States & Feedback
- **Loading:** `LoadingSpinner` for full-page/section loads; skeleton pulses (`animate-pulse`) for smaller in-place widgets like `BudgetProgress`.
- **Empty states:** every list (transactions, budgets, spending chart) has a centered, single-sentence empty message — never a blank card. E.g. *"No expense entries yet"*, *"No budgets set. Start tracking your spending limits!"*
- **Toasts:** `react-hot-toast` for every mutation result — a success toast on add/update/delete, an error toast on failure. Toasts are the *only* place transient status text lives; don't duplicate it inline in the form.
- **Budget health:** progress bars shift color by threshold — `primary-500` under 80% used, `yellow-500` from 80–99%, `red-500` at 100%+ — paired with a short text label (`% used`, `⚠️ Near limit`, `⚠️ Exceeded`).
- **Optimistic-feeling updates:** after any add/edit/delete, refetch the affected list immediately so the UI reflects the server state within the same interaction — never leave the user relying on a manual refresh to see their own change.

## 6. Typography & Interaction Language
- **Font:** system font stack (`font-sans`) — no custom webfont loading. Numbers should be legible at a glance, not decorative.
- **Amount formatting:** always two decimal places and a `$` prefix (`$1,234.56`), with an explicit `+`/`-` sign prefix wherever income and expenses can appear side by side (e.g. recent transactions).
- **Interactive states:** every clickable element has a `transition-colors` (or `transition-all`) hover state, a visible `focus:ring-2 focus:ring-primary-500` on inputs, and a `disabled:opacity-50 disabled:cursor-not-allowed` state while a submit is in flight — this is baked into `.btn-*` and `.input-field` already, so custom buttons/inputs should extend those classes rather than bypass them.

## 7. Iconography: Heroicons
- **Icon set:** Finance Manager uses **Heroicons** (`@heroicons/react/24/outline`) exclusively. Don't mix in another icon library (e.g. `react-icons`, `@tabler/icons-react`) for new UI — consistency of stroke weight matters more than icon variety.
- **Semantic pairing:** `ArrowUpIcon` = income, `ArrowDownIcon` = expense, `WalletIcon` = savings/balance, `BanknotesIcon` = rate/summary metrics, `PencilIcon`/`TrashIcon` = row-level edit/delete actions revealed on hover.
- **Sizing:** `w-6 h-6` for stat-card icons, `w-5 h-5` for row-action buttons, `w-4 h-4` for inline badges and list-item glyphs. Stay on this three-size scale.
- **Color:** icons inherit color via explicit Tailwind text-color classes on the icon itself (`text-green-500`, `text-red-500`, `text-gray-400`) — wrapped in a soft tinted circle (`bg-green-100`, `bg-red-100`) for emphasis in list rows, matching the semantic color for that row.
