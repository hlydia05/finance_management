# Finance Manager

> A personal finance tracker for staying on top of income, expenses, and budgets — with a clean dashboard, category-level spending breakdowns, and monthly budget alerts.

## Features

- **Clerk-Powered Authentication** — Secure sign-up/sign-in, session management, and just-in-time user provisioning on first request
- **Income & Expense Tracking** — Add, edit, delete, and categorize every transaction
- **Live Dashboard** — Monthly income vs. expense totals, savings rate, spending distribution, and recent activity at a glance
- **Budgets & Alerts** — Set per-category monthly budgets and track spend against them in real time
- **Excel Export** — Download income or expense history as `.xlsx` for offline records
- **Responsive UI** — Usable from a phone in the checkout line or a desktop at month-end review

## Tech Stack

### Frontend (`frontend/`)

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| Clerk React (`@clerk/clerk-react`) | Authentication UI and session hooks |
| Axios | HTTP client with auth-token interceptor |
| React Router 7 | Client-side routing |
| Recharts | Spending distribution and trend charts |
| Heroicons | Icon set |
| Headless UI | Unstyled accessible primitives (modals, menus) |
| react-hot-toast | Toast notifications |
| date-fns | Date formatting/manipulation |

### Backend (`backend/`)

| Technology | Purpose |
|---|---|
| Express 5 | HTTP server framework |
| Mongoose 9 | MongoDB ODM |
| Clerk (`@clerk/clerk-sdk-node`) | Session token verification, user lookup |
| MongoDB Atlas / local MongoDB | Data storage |
| xlsx | Excel export generation |
| cors | Cross-origin policy |
| dotenv | Environment variable management |
| nodemon | Development auto-reload |

## Project Structure

```
finance_management/
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client + auth-token interceptor
│   │   ├── components/
│   │   │   ├── common/        # Header, Sidebar, Modal, Toast, LoadingSpinner
│   │   │   ├── dashboard/     # StatsCard, SpendingChart, RecentTransactions, BudgetProgress
│   │   │   ├── forms/         # IncomeForm, ExpenseForm, BudgetForm, ProfileForm
│   │   │   ├── layout/        # App shell (Layout.jsx)
│   │   │   └── transactions/  # TransactionList, TransactionItem, TransactionFilters
│   │   ├── context/           # AuthContext (wraps Clerk session state)
│   │   ├── hooks/              # useAuth, useModal, useToast
│   │   ├── pages/              # Dashboard, Income, Expense, Budget, Profile, Login, Register
│   │   └── utils/               # constants.js, helpers.js
│   └── package.json
├── backend/
│   ├── routes/                 # Express route definitions (auth-protected)
│   ├── controller/             # Request validation + response shaping
│   ├── services/               # Business logic, Mongoose queries
│   ├── model/                  # Mongoose schemas (user, income, expense, budget)
│   ├── middleware/             # Clerk auth middleware
│   ├── config/                 # DB connection
│   ├── utils/                   # Shared helpers (date-range filtering)
│   └── server.js
├── DESIGN.md                    # Visual identity & design system
├── AGENTS.md                    # AI agent behavioral rules
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or Atlas)
- **npm** (this project uses `package-lock.json` — not `pnpm` or `yarn`)
- A **Clerk** account (https://dashboard.clerk.com) for auth keys

### Installation

```bash
# Clone the repository
git clone https://github.com/hlydia05/finance_management.git
cd finance_management

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file in `backend/` (see `backend/.env.example`):

```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=development
```

Create a `.env` file in `frontend/` (see `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:4000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_**************************
```

### Development

```bash
# Start the backend (with auto-reload)
cd backend && npm run dev

# Start the frontend (Vite dev server)
cd frontend && npm run dev
```

The API runs at `http://localhost:4000/api` and the client at `http://localhost:5173` by default.

## API Overview

All routes below (except `/api/health`) require a valid Clerk session token in the `Authorization: Bearer <token>` header.

| Resource | Routes |
|---|---|
| **User** | `GET /api/user/me` · `PUT /api/user/profile` · `GET /api/user/stats` |
| **Income** | `POST /api/income/add` · `GET /api/income/all` · `PUT /api/income/update/:id` · `DELETE /api/income/delete/:id` · `GET /api/income/downloadexcel` · `GET /api/income/overview` |
| **Expense** | `POST /api/expense/add` · `GET /api/expense/all` · `PUT /api/expense/update/:id` · `DELETE /api/expense/delete/:id` · `GET /api/expense/downloadexcel` · `GET /api/expense/overview` |
| **Budget** | `POST /api/budget/set` · `GET /api/budget/all` · `GET /api/budget/alerts` · `GET /api/budget/progress/:category` · `PUT /api/budget/update/:id` · `DELETE /api/budget/delete/:id` |
| **Dashboard** | `GET /api/dashboard` · `GET /api/dashboard/trends` · `GET /api/dashboard/top-categories` · `GET /api/dashboard/summary` |

## Design Philosophy

The interface favors clarity over decoration: soft cards, a single accent color (sky blue), and clear red/green signaling for expenses vs. income. The full design system is documented in [`DESIGN.md`](./DESIGN.md), including the color palette, component classes, and iconography rules.

## Agent Rules

AI agent behavioral constraints and development conventions are defined in [`AGENTS.md`](./AGENTS.md). Covers package manager usage, the routes → controllers → services → models pipeline, auth rules, and response/error conventions.

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Recharts Documentation](https://recharts.org/)
