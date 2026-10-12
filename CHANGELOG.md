# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-10-12

### Added

- **Docs: Every PR opens with the required description.** `.github/PULL_REQUEST_TEMPLATE.md`
  pre-fills the Problem, Approach, Decisions & trade-offs and How to test sections.
- **Docs: The changelog is checked on every PR.** `node scripts/check-changelog.cjs` fails when a
  release heading is not `## [X.Y.Z] - YYYY-MM-DD`, the newest version does not match `pom.xml`, a
  version or date is out of order, a date is impossible or in the future, or a release has no
  entries.
