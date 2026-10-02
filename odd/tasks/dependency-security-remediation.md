# Dependency security remediation

Branch: `fix/dependency-security-remediation`
Status: dependency remediation verified and committed; GitHub cleanup done; T4 is a
pending user policy decision
Commit: `7c82bdb` — `fix(deps): patch the next/og RCE and two transitive advisories`
Base: `main` at `ab77e75`

## Problem

The repository carries real, currently-installed dependency vulnerabilities, and its
GitHub-side security tooling reports a set of alerts that does not describe the
current tree at all. Two universes disagree, and both need action.

### The real state: `pnpm audit` over the shipped lockfile

`pnpm audit --prod` reports **6 findings: 1 critical, 3 high, 2 moderate**, across
only three packages.

| Severity | Package | Installed | Fixed in | Path | Practical exposure |
| --- | --- | --- | --- | --- | --- |
| critical | `next` | 16.3.4 | >= 16.3.6 | direct | RCE in `next/og` ImageResponse (`GHSA-vcvr-r3jv-pc5j`). The app does not use `next/og`. |
| high | `pdfjs-dist` | 3.11.174 | >= 4.2.67 | direct | Arbitrary JavaScript execution when opening a malicious PDF (`GHSA-wgrm-67xf-hhpq`, CVE-2024-4367, CVSS 8.8). Real surface: the app renders uploaded PDFs. |
| high | `brace-expansion` | nested | >= 1.1.20 | `pdfjs-dist > canvas > @mapbox/node-pre-gyp > rimraf > glob > minimatch` | Build-time only; `canvas` is in `neverBuiltDependencies`. |
| high | `brace-expansion` | nested | >= 1.1.19 | same | same |
| moderate | `brace-expansion` | nested | >= 1.1.21 | same | same |
| moderate | `fast-uri` | nested | >= 3.1.8 | `@hookform/resolvers > ajv` | Validation-time. |

`next` is the only finding on a package the app actually routes through, and its
advisory concerns a subsystem the app never imports. The `pdfjs-dist` finding is the
one with genuine product surface, and it is already mitigated at runtime by the
pinned-worker configuration (`isEvalSupported: false`, `enableScripting: false`).

### The GitHub state: 84 open alerts, all stale

`gh api repos/LucasIvanCardozo/tuAmigoFI/dependabot/alerts?state=open` returns 84
open alerts: 48 on `package-lock.json` and 36 on `package.json`. None of them
describes the current tree.

- **`package-lock.json` does not exist on `main` and is not tracked.** It survives
  only on the obsolete remote branch `vercel/react-server-components-cve-vu-xowxcp`.
  The repository uses pnpm (`pnpm-lock.yaml`).
- **Every one of the 24 distinct `next` ranges reported is `< 15.5.x` or lower**; the
  widest is `>= 10.0.0, < 15.5.24`. The installed version is 16.3.4, which satisfies
  none of them.
- Alerts are open for packages that are no longer in the tree at all: `cloudinary`
  (removed in the refactor), `lodash`, `picomatch`, `minimatch`, `glob`, `nanoid`,
  `uuid`, `postcss-selector-parser`.
- Counter-proof: the `postcss` alert declares vulnerable `<= 8.5.22` with a fix in
  `8.5.23`, and the installed version is `8.5.28`.

Repository settings compound it: Dependabot security updates **disabled**, secret
scanning **disabled**, push protection **disabled**, code scanning has no analysis,
and there is **no `.github/` directory** — so no config points Dependabot at
`pnpm-lock.yaml`, the only manifest that exists.

### The Vercel state: an obsolete branch, nothing pending

Vercel left no open pull request. Its only artifact is the automated branch
`vercel/react-server-components-cve-vu-xowxcp` (commit `ade2fad`, 2025-12-16), from
the December 2025 RSC CVE campaign. It is based on `893b0ab`, the pre-refactor npm
tree, and its commit only adds a `package-lock.json` and bumps `next` in
`package.json`. It is superseded by the refactor and is the likely cause of the
polluted dependency graph.

Corrected during T5: that branch **no longer existed on the remote**. The campaign
opened pull request #1, which was closed on 2026-03-12 without being merged, and
GitHub deleted the head branch with it. The only surviving trace was a stale local
remote-tracking ref, removed with `git remote prune origin`. No branch deletion was
needed; the planning note that one was pending came from that stale ref.

## Decision

Three user decisions, taken after the audit above.

1. **Fix scope: `next` plus the two transitive overrides.** Bump `next` to the
   patched 16.3.x and add `pnpm.overrides` entries for `fast-uri` and
   `brace-expansion`. `pdfjs-dist` is out of scope (see Residual risk).
2. **Full GitHub cleanup.** Delete the obsolete remote branch, enable Dependabot
   security updates, and dismiss the 84 stale alerts.
3. **Document the residual risk** rather than forcing a viewer rewrite into this
   work unit.

The last two findings are addressed with `pnpm.overrides`, the mechanism this
`package.json` already uses for exactly this purpose, rather than with a direct
dependency bump that would not reach the nested copies.

## Allowed edit surfaces

- `package.json`
- `pnpm-lock.yaml`
- `.github/dependabot.yml`

## Tasks

- **T1 done.** `next` 16.3.4 -> 16.3.8. Regression check passed: the 1.74 MB POST is
  not rejected by the body limit, and the 7 MB POST is (`Body exceeded 6mb limit`,
  413 internally). The loader/spinner path could not be re-verified only because local
  PostgreSQL is down, so no data-dependent search could run; that is an environment
  gap, not a regression result.
- **T2 done.** Overrides added as `brace-expansion: ^1.1.21` and `fast-uri: ^3.1.8`.
  Caret rather than the file's existing `>=` style, because each package is the single
  copy consumed by `minimatch@3.1.5` and `ajv@8.20.0`, and `>=` would have jumped to
  5.x and 4.x. Resolved to exactly 1.1.21 and 3.1.8. `pnpm audit --prod` fell from 6
  findings to 1.
- **T3 done.** First production build in this repository's current shape: exit 0,
  Next.js 16.3.8 (Turbopack), Cache Components enabled, PPR output produced, 9/9
  static pages, TypeScript finished. `pnpm lint`: 0 errors and 1 warning, the accepted
  `src/app/globals.css:50`.
- **T4 pending, and its original justification was wrong.** `.github/dependabot.yml`
  does not affect the dependency graph or Dependabot alerts; it configures scheduled
  version-update pull requests. The stale alerts came from a graph snapshot left
  behind by the npm -> pnpm refactor, and T5 resolved them by other means. Adding the
  file is a policy choice about receiving periodic update pull requests, not a fix, so
  it is left to the user.
- **T5 done.** See GitHub cleanup below.
- **T6 done.** This document.

## Verification

Every check below was executed by an independent verifier against the committed
revision `7c82bdb`, with per-file md5 comparison before and after: every tracked file
was byte-identical afterwards, and the working tree matched the baseline exactly.

- **Lockfile integrity — PASS.** `pnpm install --frozen-lockfile` succeeded and
  modified nothing. The lockfile pins only `brace-expansion@1.1.21` and
  `fast-uri@3.1.8`.
- **Audit delta — PASS.** `pnpm audit --prod` reports 1 vulnerability, severity high,
  `pdfjs-dist`, `GHSA-wgrm-67xf-hhpq`. No extra advisories. The same result holds
  including dev dependencies.
- **Lint — PASS.** 0 errors, exactly 1 warning.
- **Production build — PASS.** Exit 0, as described in T3.
- **Body limit — PASS.** 1.74 MB was accepted: no `Body exceeded` string anywhere in
  its response (the 500 it returns is a pre-existing Prisma error caused by the down
  database). 7 MB was rejected with `Body exceeded 6mb limit`, and the string `1 MB`
  appears in none of the three responses — which is the point of the check, since the
  original defect was the 1 MiB default.
- **Spinner — NOT VERIFIED.** Blocked by the down database and by the need for a
  browser session. Not inferred.

## GitHub cleanup

- All 84 stale alerts were resolved rather than left as noise. Before dismissing any,
  each alert's `vulnerable_version_range` was compared against every version actually
  installed for that package in `pnpm-lock.yaml`: **none of the 84 applied to the
  current tree**. 80 were dismissed as `inaccurate` (the package is installed but no
  installed version falls inside the vulnerable range) and 4 as `not_used`
  (`cloudinary`, `picomatch` and `postcss-selector-parser` are absent entirely).
- The dismissal did **not** require the `security_events` token scope, contrary to the
  expectation recorded at planning time; the existing `repo` scope sufficed.
- Dependabot security updates: **enabled** (was disabled).
- Open Dependabot alerts after cleanup: **0**.
- Still disabled, each worth its own decision: secret scanning, secret scanning push
  protection, secret scanning validity checks, and code scanning (no analysis).

## Residual risk

`pdfjs-dist` 3.11.174 stays vulnerable to `GHSA-wgrm-67xf-hhpq` and cannot be bumped
inside this work unit: `@react-pdf-viewer/core@3.12.0` declares the peer
`pdfjs-dist: "^2.16.105 || ^3.0.279"`, so 4.x or 6.x breaks the PDF viewer. The
runtime mitigations already in place (`isEvalSupported: false`,
`enableScripting: false` on the pinned 3.11.174 worker) remain the control. Removing
this risk requires replacing the viewer library, which is its own work unit.

## Operational notes

- `pnpm install` rewrites `neverBuiltDependencies` from `["canvas"]` into a multi-line
  array whenever it actually re-resolves; a no-op `--frozen-lockfile` install leaves it
  alone. Expect that cosmetic hunk on every future dependency update, and do not treat
  it as a deliberate change.
- The override left stale `node_modules/.pnpm/brace-expansion@1.1.18` and
  `fast-uri@3.1.7` directories behind. They predate this session, are unreferenced by
  the lockfile, and are gitignored, so they are safe to leave.

## Review

Pending. Native review runs only under the user-owned RDD switch.
