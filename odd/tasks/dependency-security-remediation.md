# Dependency security remediation

Branch: `fix/dependency-security-remediation`
Status: dependency remediation verified, committed, natively reviewed and approved, and
merged to `main`; GitHub cleanup done; T4 declined by the user; the pdfjs-dist residual
risk was analysed and the decision is to stay, documented below
Commits: `7c82bdb` — `fix(deps): patch the next/og RCE and two transitive advisories`;
`fd6c28d`, `db9fc39`, `acd61df` — evidence, review result and the T4 decision; merged to
`main` as `dd3033e` and pushed
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
- **T4 declined by the user, and its original justification was wrong.**
  `.github/dependabot.yml` does not affect the dependency graph or Dependabot alerts;
  it configures scheduled version-update pull requests. The stale alerts came from a
  graph snapshot left behind by the npm -> pnpm refactor, and T5 resolved them by other
  means. Since Dependabot security updates now cover known vulnerabilities, the user
  decided the file would only add pull-request noise, so it was not created.
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
- Secret scanning and secret scanning push protection: **enabled** at the user's
  decision. Both are free on a public repository and required no repository change.
  Zero open secret alerts at enablement, so nothing had leaked; push protection now
  blocks a secret before it can enter the history.
- Still disabled, each worth its own decision: secret scanning validity checks and
  code scanning (no analysis).

## Residual risk: `pdfjs-dist` 3.11.174

**Decision, taken by the user after the analysis below: stay as is, documented, and
revisit only when an advisory appears that no configuration flag can mitigate.**

### Exposure, and why it is controlled

Two advisories affect the pinned `3.11.174`. Both require an insecure default that this
project already overrides in `src/app/components/pdf-viewer-impl.tsx`:

| Advisory | Requires | Our value |
| --- | --- | --- |
| `CVE-2024-4367` (`GHSA-wgrm-67xf-hhpq`, CVSS 8.8) | `isEvalSupported: true` | `false`, line 68 |
| `CVE-2026-16633` (`GHSA-hq66-cqwq-w95j`) | `enableScripting: true` and a `script-src` CSP that does not restrict | `false`, line 69 |

The second row is the fragile one. The CSP in `next.config.mjs:38` allows
`script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com`, so it does **not**
restrict `script-src`. `enableScripting: false` is therefore the sole control for that
advisory, and removing or renaming that option silently reopens the vulnerability. That
is the one line worth protecting.

Exposure is real but bounded: the attack requires opening a malicious PDF, and responses
are user-uploaded public content, so a hostile file could in principle be uploaded for
others to open. The flags, not the library version, are what close that path today.

### Why the dependency cannot simply be bumped

Three independent barriers, any one of which is enough to break the viewer:

1. `@react-pdf-viewer/core@3.12.0` is the **latest published version and has been frozen
   since 2023-03-21**; its peer range is `pdfjs-dist: "^2.16.105 || ^3.0.279"`, which
   excludes 4.x.
2. `core` loads pdfjs through CommonJS — `core/lib/cjs/core.js:4` is
   `require('pdfjs-dist')` — while pdfjs 4.x and later are ESM-only.
3. `pdf-viewer-impl.tsx:17` hardcodes the worker to
   `pdfjs-dist@3.11.174/build/pdf.worker.min.js`, so any API-to-worker mismatch breaks
   rendering outright.

Upstream confirms there is no path. The react-pdf-viewer issue #1767 ("Pdfjs-dist
Library Upgrade to V4") has been **open since 2024-06-03**, has 17 comments, has been
closed by no pull request, and users who tried v4 reported errors when closing documents.
Separately, the pdf.js maintainers stated that security fixes will **not** be backported
to the 3.x branch, which they describe as unsupported for a long time. Forcing an
override is therefore not a fix.

### Blast radius, for whenever migration is reconsidered

Much smaller than it looks:

- The entire viewer coupling is **one file**: `src/app/components/pdf-viewer-impl.tsx`
  (76 lines).
- **No** file imports `pdfjs-dist` directly; its only consumer is
  `@react-pdf-viewer/core`.
- Two render sites: `moduleResponse.tsx:102` and `moduleContainer.tsx:103`.
- The API surface is `Worker` plus `Viewer` with six props, seven toolbar slots
  (`GoToPreviousPage`, `GoToNextPage`, `CurrentPageLabel`, `NumberOfPages`, `ZoomOut`,
  `CurrentScale`, `ZoomIn`), and one direct pdfjs call —
  `doc.getPage(1).getViewport({ scale: 1 })`, used to compute the aspect ratio.

### Alternatives measured, not guessed

| Option | pdfjs brought | React peer | Weekly downloads | Status |
| --- | --- | --- | --- | --- |
| `react-pdf` 11.0.0 | 6.3.289 (dependency) | `^19.0.0` | 8,131,865 | published 2026-09-10, maintained |
| `@react-pdf-kit/viewer` 2.10.0 | 5.4.530 | `^18.2` or `^19.0` | 9,068 | published 2026-10-01 |
| `@react-pdf-viewer/core` (current) | 3.11.174 | `>=16.8.0` | 454,640 | frozen since 2023 |

`react-pdf` leads by three orders of magnitude in adoption, but it exposes only
`<Document>` and `<Page>`, so migrating would mean rebuilding the seven-control toolbar.
Since this repository has no test framework, such a migration could only be verified
manually in a browser — and that, not the dependency itself, is the real risk.

### Consequence for the repository's safety net

`pnpm audit --prod` reports this finding and **Dependabot reports nothing**, because
GitHub's dependency graph still does not reflect `pnpm-lock.yaml`:
`dependency-graph/sbom` returns 404, and the open-alert list is empty while the local
audit finds a high-severity issue. Local `pnpm audit` is therefore the only working
check on this dependency, and the finding must stay visible rather than be dismissed.

## Operational notes

- `pnpm install` rewrites `neverBuiltDependencies` from `["canvas"]` into a multi-line
  array whenever it actually re-resolves; a no-op `--frozen-lockfile` install leaves it
  alone. Expect that cosmetic hunk on every future dependency update, and do not treat
  it as a deliberate change.
- The override left stale `node_modules/.pnpm/brace-expansion@1.1.18` and
  `fast-uri@3.1.7` directories behind. They predate this session, are unreferenced by
  the lockfile, and are gitignored, so they are safe to leave.

## Review

Native review **approved**, authority burned. Lineage `review-02b16f57474898ee`, target
`sha256:8db51adc31eb76effd17e01fac7f89ccf04f3618aaa4e1ea2928665802b25a96`, risk tier
high, four lenses (`review-risk`, `review-resilience`, `review-readability`,
`review-reliability`), 4/4 reviewers admitted, consumed revision
`sha256:9ddb71d1bbbaea8366f968273f1c15aee1b343e3e4e37402a271e968073de159`, burn
evidence `gentle-ai.review-acknowledged/v1`, delivery `ordinary-repository-policy`. No
correction was opened; the correction budget of 148 lines was never used.

Six advisory findings, all informational and non-blocking, kept as later work:

| ID | Lens | Location | Severity |
| --- | --- | --- | --- |
| `R1-residual-pdfjs` | risk | `package.json:29` | WARNING |
| `R4-override-scope` | resilience | `package.json:65` | WARNING |
| `R3-001` | reliability | `odd/tasks/dependency-security-remediation.md:4-5` | WARNING |
| `R2-001` | readability | `odd/tasks/dependency-security-remediation.md:84` | SUGGESTION |
| `R2-002` | readability | `package.json:65-66` | SUGGESTION |
| `R3-002` | reliability | `package.json:65-66` | SUGGESTION |

The two `package.json:65-66` findings concern the new `pnpm.overrides` entries, and the
two document findings concern this file's own accuracy. None required a change to the
approved revision.

Delivery (push, pull request, merge) remains a separate user decision under ordinary
repository policy.
