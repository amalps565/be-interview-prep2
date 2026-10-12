# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2026-10-12

### Added

- **Setup: The app builds, starts and answers a health check with one command each.** A Spring
  Boot 3.5 project on Java 21 with an in-memory H2 database whose tables Hibernate creates on
  startup. `./mvnw spring-boot:run` starts it, `./mvnw test` runs the tests, and
  `GET /actuator/health` returns `{"status":"UP"}`. Only the health endpoint is exposed, without
  component details. The dependencies the five questions share (web, validation, JPA, cache) are in
  place, so later PRs only add code. Security is left for Q3, because adding it now would lock
  every Q1 and Q2 endpoint behind a login. [#1](https://github.com/amalps565/be-interview-prep2/issues/1)
- **CI: Every PR into main is checked automatically.** GitHub Actions validates the changelog,
  checks formatting and runs the full test suite in parallel jobs, and a separate job scans every
  commit for secrets with gitleaks. They run on GitHub's standard runners with no stored secrets,
  and a newer push to a PR cancels the older run.
  [#1](https://github.com/amalps565/be-interview-prep2/issues/1)
- **Docs: Every API can be tried from one Bruno collection.** `api-collections/be-interview-prep`
  has a `local` environment, a secret `accessToken` variable that is never written to the
  repository, and a `health` request with tests. The README explains how to open it in Bruno or run
  it with `bru run`. [#1](https://github.com/amalps565/be-interview-prep2/issues/1)

### Changed

- **Setup: Line endings are LF in the repository and CRLF only for Windows scripts**, so formatting
  checks give the same result on Windows and on CI.
  [#1](https://github.com/amalps565/be-interview-prep2/issues/1)

## [0.0.1] - 2026-10-12

### Added

- **Docs: Every PR opens with the required description.** `.github/PULL_REQUEST_TEMPLATE.md`
  pre-fills the Problem, Approach, Decisions & trade-offs and How to test sections.
- **Docs: The changelog is checked on every PR.** `node scripts/check-changelog.cjs` fails when a
  release heading is not `## [X.Y.Z] - YYYY-MM-DD`, the newest version does not match `pom.xml`, a
  version or date is out of order, a date is impossible or in the future, or a release has no
  entries.
