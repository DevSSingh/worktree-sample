# Folio Expense Tracker

Expense tracking application in the `worktree-sample` repository, which is also used to practice Git worktree workflows.

A responsive personal expense tracker built with React, Next.js App Router, strict TypeScript, and Tailwind CSS. The dashboard uses an emerald and slate palette, accessible native modal dialogs, and locally stored expenses.

## Run locally

Use Node.js 22 LTS or a newer supported LTS release and npm.

```powershell
cd D:\Anya\react
npm install
npm run dev
```

Open http://localhost:3000. Your first visit starts with an empty ledger. Choose **Try sample data** to explore the dashboard or **Add expense** to start recording your own expenses. Sample entries are explicitly added to your local ledger and can be edited or deleted.

## Features

- Add and edit date, USD amount, category, and description.
- Six categories: Food, Transportation, Entertainment, Shopping, Bills, Other.
- Validate positive amounts with at most two decimal places, valid calendar dates, and descriptions of 1–140 characters.
- Search descriptions and categories; combine category and inclusive start/end date filters.
- Sort expenses newest first; delete with confirmation.
- All-time total, current calendar-month spending, average expense, and top category.
- Six-month bar chart and category donut with accessible textual labels and hover amounts.
- Export the currently filtered expenses as UTF-8 CSV, with quoting and spreadsheet formula protection.
- Responsive sidebar navigation, mobile menu, loading feedback, empty states, save errors, and notifications.
- Local storage persistence with validation; invalid existing data is preserved rather than overwritten.

Dashboard summaries and charts describe the entire saved ledger. Table filters and CSV export use the current filters. All amounts use USD; currency conversion is outside this demo's scope. Future dates are permitted for planned expenses.

## Automated verification

```powershell
npm run format
npm run format:check
npm run lint
npm run typecheck
npm test -- --runInBand
npx playwright install chromium
npm run test:e2e
npm run build
```

Jest covers the expense domain, repository validation, CSV output, state hook, forms, table, charts, dialogs, and application interactions. Its global coverage gate requires at least 80% for branches, functions, lines, and statements. Playwright runs complete expense workflows, persistence, analytics, corrupt storage, and navigation in desktop Chromium and mobile Chromium. It starts a local development server automatically.

For a production build:

```powershell
npm run build
npm start
```

## Manual feature checklist

1. Add an expense with a description, amount, date, and category. Try blank descriptions, zero/negative amounts, and three-decimal amounts to see validation.
2. Reload and confirm the expense remains. Add expenses in different categories and calendar months, then check summaries and charts.
3. Search by description and category. Combine a category with start/end dates, including same-day ranges. Clear filters and verify all rows return.
4. Edit an expense and verify totals update. Cancel a deletion, then confirm deletion and reload to verify persistence.
5. Export a filtered list and inspect its date, USD amount, category, and description in a spreadsheet.
6. Switch among Overview, Expenses, and Insights. Resize to a phone width and use the menu, form, and scrollable transaction table.
7. To exercise invalid storage, use browser developer tools to set `folio.expenses.v1` to invalid JSON and reload. The app displays an error and keeps the original value. Restore a valid backup or remove that key in developer tools to start over.

## Architecture and SOLID design

- `src/types/expense.ts`: domain types and the narrow `ExpenseRepository` interface.
- `src/lib/expenses/domain.ts`: pure validation, filtering, date formatting, and analytics. Calculations add integer cents to avoid floating-point accumulation errors.
- `src/lib/expenses/storage.ts`: localStorage adapter. The adapter accepts a minimal storage interface and rejects malformed records and duplicate IDs.
- `src/lib/expenses/use-expenses.ts`: client state and persistence coordination. It accepts a repository abstraction for tests or a future persistence adapter. State changes only after storage succeeds.
- `src/lib/expenses/csv.ts`: serialization and browser download.
- `src/components/expenses/`: focused form, list, chart, summary, and confirmation components; the app component coordinates interactions.
- `src/app/`: Next.js App Router page, root layout, and Tailwind styling. App Router replaces the earlier Pages Router organization as requested.
- `e2e/`: desktop and mobile workflow tests.

No backend, database, authentication, or server API is needed for the requested localStorage demo. Data belongs to the browser profile and origin. Clearing site data removes it; keep CSV backups. This application does not synchronize multiple open tabs. CSV is an export format; importing backups is not implemented.

## Verification status in this workspace

Implementation and automated tests have been written. Dependency installation was blocked by the environment: npm requests to the registry failed with `EACCES`. The full build, TypeScript, ESLint, Prettier, Jest coverage, and Playwright checks therefore could not be completed here. Offline syntax and domain smoke checks are recorded in `VERIFICATION.md`.

The initial implementation was prepared on `feature-expense-tracker`. See `VERIFICATION.md` for the checks and environment limitations recorded at that time. Run all verification commands above before committing further application changes.
