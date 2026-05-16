# Contributing to LUXE Commerce

Thanks for investing time here. These guidelines aim to keep review cycles short, regressions rare, and the codebase consistent across the **React (Vite) client**, **Express API**, and **MongoDB** layers.

---

## Table of contents

1. [Code of conduct](#code-of-conduct)
2. [Before you contribute](#before-you-contribute)
3. [Development setup](#development-setup)
4. [Branching and commits](#branching-and-commits)
5. [Pull requests](#pull-requests)
6. [Coding standards](#coding-standards)
7. [Testing expectations](#testing-expectations)
8. [Security](#security)
9. [Documentation and changelog](#documentation-and-changelog)

---

## Code of conduct

- Be constructive in review; assume good intent.
- Disagreement is fine; personal attacks are not.
- Prefer clear, searchable questions over vague “FYI” comments when something blocks merge.

(A formal CoC adapter like Contributor Covenant may be adopted later via maintainers.)

---

## Before you contribute

1. Check **existing issues / PRs** for overlap.
2. For non-trivial work, consider opening an **issue** first (problem statement, acceptance criteria).
3. Read [README.md](README.md) for architecture and env vars.
4. Never commit `.env`, API keys, or production database URLs.

---

## Development setup

```bash
npm run install-all
cp .env.example .env   # then fill values
npm run seed           # optional: local MongoDB catalogue + demo users
npm run dev            # client + API
```

Common paths:

| Work area | Typical commands |
|-----------|------------------|
| Client | `cd client && npm run dev`, `npm run build` |
| Server | `cd server && npm run dev`, `node server.js` |
| Lint / format | Add when introduced (ESLint / Prettier in CI) |

If your change touches **Stripe**, **SMTP**, or **Cloudinary**, document any new toggles under **Configuration** in [README.md](README.md).

---

## Branching and commits

**Branches**

- `main` — release-ready; merge only via PR unless emergency hotfix policy says otherwise.
- Feature branches — `feat/short-topic`, fixes — `fix/short-topic`, chores — `chore/short-topic`.

**Commits**

- Imperative mood: “Add checkout validation”, “Fix cart total rounding”.
- One logical concern per commit when possible so `git revert` stays safe.
- Do not squash unrelated refactors into a feature PR without calling it out in the PR description.

---

## Pull requests

Every PR should include:

1. **Summary** — what changed and **why** (not only what files moved).
2. **Test plan** — bullet checklist: “ran `npm run build`”, “seeded DB and hit `/api/products`”, “clicked checkout”.
3. **Screenshots / screen recording** — for UI-visible changes (before/after if helpful).
4. **Breaking changes** — API contract, env renames, or migration steps flagged up front.

**Review bar**

- No secrets or machine-specific paths committed.
- New env vars mirrored in [.env.example](.env.example).
- Accessible patterns where applicable (semantic HTML, keyboard nav for interactive widgets you add).

Request review when CI (when present) is green or explain known failures inline.

---

## Coding standards

**Client**

- Match existing patterns: functional components, hooks, Redux Toolkit for global state that already lives in slices.
- Prefer **focused diffs**: avoid unrelated reformatting of whole files.
- Tailwind `luxury-*` utility usage should stay consistent with the design system already in [`client/src/index.css`](client/src/index.css).

**Server**

- Controllers thin; reusable logic in `utils/` or services if you introduce a layer.
- Validate input with **`express-validator`** (or equivalent) at route boundaries used today.
- New routes: document in README **API summary** section or in route file JSDoc for non-obvious behavior.

---

## Testing expectations

Automated suites are minimal today; contributing should **not** lower verification:

- **`npm run build`** (client) must pass before merge for any client change touching build graph.
- For API behavior changes, manually exercise affected endpoints or add tests if you introduce a harness.

When Vitest/Jest landed, extend this section with concrete commands (`npm test`, coverage thresholds).

---

## Security

- Report sensitive issues privately to maintainers (email or security policy if added later).
- Do not open public issues disclosing undisclosed exploits.
- Dependency bumps: prefer PRs grouped by semver impact; scan release notes for breaking changes.

---

## Documentation and changelog

- README updates for behaviors users or operators rely on end-to-end.
- User-visible or operator-visible fixes/features: add an entry under **[Unreleased]** in [CHANGELOG.md](CHANGELOG.md), following Keep a Changelog categories (`Added`, `Changed`, `Fixed`, `Removed`, `Security`).

Questions? Open a discussion thread or issue and tag `@maintainers` if that convention exists in your fork.
