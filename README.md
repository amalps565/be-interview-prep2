# be-interview-prep2

Five Spring Boot features built for a backend interview prep assignment. Each feature is delivered on
its own branch and merged into `main` through its own pull request, in order from Q1 to Q5.

## Questions

| # | Question | PR link |
|---|---|---|
| 1 | Task Manager API | |
| 2 | URL Shortener | |
| 3 | Authentication & Roles | |
| 4 | Product Catalog | |
| 5 | Order Service | |

**Video:**

## Stack

- Java 21 and Spring Boot 3.5 (Web, Validation, Data JPA, Cache with Caffeine, Actuator)
- H2 in-memory database; the schema is created by Hibernate on startup
- Maven (wrapper included), JUnit 5, Spotless with google-java-format

## Run the app

```bash
./mvnw spring-boot:run
```

On Windows PowerShell run `mvnw.cmd spring-boot:run`. The app starts on `http://localhost:8080`;
`GET /actuator/health` returns `{"status":"UP"}` once it is ready.

## Run the tests

```bash
./mvnw test                                    # every test
./mvnw test -Dtest=BeInterviewPrepApplicationTest   # one test class
```

The tests run with the `test` profile on their own in-memory database.

## Format and checks

```bash
./mvnw spotless:apply             # format the code
./mvnw spotless:check             # fail if anything is unformatted
node scripts/check-changelog.cjs  # validate CHANGELOG.md against the version in pom.xml
```

Every pull request into `main` runs these checks, the full test suite and a secret scan on GitHub
Actions.

## API collection

`api-collections/be-interview-prep` is a [Bruno](https://www.usebruno.com/) collection with one
folder per question and one request per file.

1. In Bruno, choose **Open Collection** and select `api-collections/be-interview-prep`.
2. Pick the `local` environment in the top-right environment selector.
3. Start the app, then send any request. `health/health` checks the app is up.

Requests that need a login send `{{accessToken}}`, a secret variable whose value Bruno keeps on your
machine, never in the repository.

From the terminal, with the [Bruno CLI](https://docs.usebruno.com/bru-cli/overview)
(`npm i -g @usebruno/cli`) and the app running:

```bash
cd api-collections/be-interview-prep
bru run --env local
```
