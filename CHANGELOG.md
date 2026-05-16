# Changelog

All notable changes to **LUXE Commerce** may be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres roughly to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
once release tags exist.

---

## [Unreleased]

### Added

- —

### Changed

- Seed and demo accounts use **luxe.shop** emails (`admin@luxe.shop`, `john@luxe.shop`); Cloudinary upload folder renamed to `luxe-commerce`; client package name `luxe-commerce-client`.

### Fixed

- —

### Removed

- —

### Security

- —

---

## [1.0.0] - YYYY-MM-DD

Use this placeholder entry for the **first tagged release**. Replace date and bullets with reality before tagging `v1.0.0`.

### Added

- Full-stack storefront (Vite / React / Tailwind / Redux Toolkit) with lazy routes and checkout flows.
- Express REST API with MongoDB / Mongoose, JWT auth (cookie + Bearer), Stripe integration.
- Admin dashboard (products, orders, users, categories, coupons) and seeded catalogue (25 products across 5 categories).
- Contribution and changelog scaffolding ([CONTRIBUTING.md](CONTRIBUTING.md), this file).

<!-- Version diff links — uncomment when publishing:

[Unreleased]: https://github.com/ORG/REPO/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ORG/REPO/releases/tag/v1.0.0

-->

---

### Maintainer notes

1. Move items from **[Unreleased]** into a dated section when cutting a release.
2. Bump `version` fields in root / `client` / `server` **package.json** if you mirror versions (optional but common).
3. Tag: `git tag -a v1.0.0 -m "Release v1.0.0"` (after changelog + version alignment).
