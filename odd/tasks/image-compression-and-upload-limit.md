# Client image compression and the Server Action upload limit

Branch: `feat/client-image-compression`
Status: done
Commit: `ce7acc0` — `fix(upload): raise the body limit and compress images before upload`
Base: `main` at `3f1df85`

## Problem

Two separate defects on the upload path, both verified before any edit.

### 1. Live bug: uploads over 1 MB already failed

Server Actions cap the request body at 1 MiB by default and Next enforces it on
multipart bodies. Verified in Next's own source:
`node_modules/next/dist/server/app-render/action-handler.js:518-519`
(`defaultBodySizeLimit = '1 MB'` → `1024 * 1024`) and the enforcement at `:546-548`
and `:669`; documented at
`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md:27`.

`next.config.mjs` did not configure it, yet the app advertises 5 MB in three
places: `src/app/lib/shared/constants/upload.ts:1` (`5 * 1024 * 1024`),
`src/app/lib/shared/schemas/tp.schema.ts:13` and `response.schema.ts:4`
(`size < 5_000_000`). Because TPs and midterms are PDF-only, this broke the core
contribution path for any file above ~1 MB, with no user-reachable workaround.

Reproduced before the fix against the dev server, same action, same body shape,
only the attached file differing: a 4-byte file returned HTTP 200 and a
1,740,994-byte file returned HTTP 500
`{"message":"Body exceeded 1 MB limit.\nTo configure the body size limit for Server Actions, ..."}`.

### 2. No size reduction on upload

`uploadFile` (`src/app/lib/server/utils/uploadthing.ts:82`) sent the original bytes
to UploadThing. No conversion or compression existed anywhere and the project had
no image-processing dependency.

## Decision

Copy carta-qr's client-side image compressor verbatim, plus the two changes that
make it correct and meaningful here.

- `image-compressor.ts` is copied literally from
  `carta-qr/lib/shared/image-compressor.ts` (documented reference for this repo, per
  the user's instruction). Final diff: exactly two added lines, no removals.
- `bodySizeLimit` is raised so the advertised 5 MB is reachable. This is what fixes
  the PDF path; the compressor only reduces weight.
- **`libURL` must be an absolute URL.** The library defaults it to
  `https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js`
  and the worker loads it with `self.importScripts(libURL)`. Two traps, both
  measured: (a) the default CDN is blocked by this repo's CSP, so the library's
  `$Try_1_Catch` silently falls back to main-thread compression; (b) after
  self-hosting, a root-relative `'/browser-image-compression.js'` still fails
  inside a `blob:` worker with `SyntaxError: The URL … is invalid`, because the
  blob worker cannot resolve root-relative URLs. The working form resolves against
  the origin at call time:
  `new URL(COMPRESSION_LIB_URL, window.location.origin).href`. Resolving inside the
  async function keeps `window` out of module scope, so SSR is unaffected.
- The dependency is pinned exactly (`2.0.2`) so the bundled main-thread copy and
  the vendored worker copy cannot drift.

Deliberately not copied from carta-qr: `ImageForm.tsx` (CSS Modules, FontAwesome,
its own `ImageValue` union and `Button`; AGENTS.md forbids a second form-input
pattern, and the host here is `ResponseForm.tsx`), and its vitest suite (this repo
has no test framework and AGENTS.md forbids tests).

## Files

Created:

- `src/app/lib/shared/image-compressor.ts` — literal copy plus the absolute
  `libURL`
- `public/browser-image-compression.js` — vendored dist, 57069 bytes, md5
  `3d6dfc9976fe6b936151b7406ec3ebe2`, byte-identical to
  `node_modules/browser-image-compression/dist/browser-image-compression.js`

Edited:

- `next.config.mjs` — added `experimental.serverActions.bodySizeLimit: '6mb'`
  between `cacheComponents` and `headers()`. The key must live under
  `experimental`: `next/dist/server/config-schema.js` defines `serverActions`
  inside a strict `experimentalSchema`, so a top-level key would fail validation.
- `package.json`, `pnpm-lock.yaml` — `browser-image-compression` pinned to `2.0.2`
- `src/app/components/layout/form/ResponseForm.tsx` — extracted a real
  `ResponseFileField` component (hooks cannot live in the `Controller` render
  callback) with compression for `IMAGE` only, plus a local error line. PDF and
  TEXT/CODE paths unchanged.

## Tasks

- [x] T1 Add `browser-image-compression` pinned to `2.0.2` and vendor its dist to
  `public/browser-image-compression.js`.
- [x] T2 Add `src/app/lib/shared/image-compressor.ts` as a literal copy plus the
  self-hosted `libURL`.
- [x] T3 Raise `experimental.serverActions.bodySizeLimit` to `'6mb'`.
- [x] T4 Wire compression into `ResponseForm.tsx` for the IMAGE type.
- [x] T5 Verify: lint, types, the body-limit probe with a negative control, and
  browser checks for the worker, the CSP and the resulting file size.
- [x] T6 Native review: correct the CRITICAL finding it raised, close the targeted
  validation, and commit the work unit.

## Evidence

Baselines: `pnpm lint` 0 errors + 1 pre-existing warning (`globals.css:50`);
`pnpm exec tsc --noEmit` exit 0.

### Body limit

| Attachment | Bytes | HTTP | Result |
| --- | --- | --- | --- |
| `tafi-small.pdf` (4 B) | 4 | 200 | action executed |
| `tafi-big.pdf` | 1,740,994 | 200 | no `Body exceeded 1 MB limit` |
| `tafi-5mb.pdf` | 5,242,880 | 200 | accepted, headroom under 6 MB |
| `tafi-huge.pdf` (negative control) | 7,340,032 | 500 | `Body exceeded 6mb limit` |

The negative control is what proves the limit was raised rather than removed. Dev
log corroborates: `⨯ Error: Body exceeded 6mb limit. … statusCode: 413`. The dev
server reloaded the config on its own (`✓ Running next.config.mjs`,
`Experiments · serverActions`), and the schema accepted the block. DB audit before
and after: `Tp 0 → 0`, `Response 0 → 0`, `Midterm 0 → 0`.

### Compressor

Literal-copy fidelity: `diff` against the carta-qr reference yields exactly two
hunks, both the declared exceptions, 2 added lines and 0 removals.

| Discriminator | Before the `libURL` fix | Final revision |
| --- | --- | --- |
| Worker library URL | `/browser-image-compression.js` (relative) | `http://localhost:3001/browser-image-compression.js` |
| Worker messages (progress/file/error) | 0 / 0 / **1** (`importScripts … invalid`) | **7 / 1 / 0** |
| Main-thread `OffscreenCanvas` | not instrumented | **0** |
| Main-thread `createImageBitmap` | not instrumented | **0** |
| Resulting `_formValues.file` | 337,183 B | 337,183 B |
| `cdn.jsdelivr.net` requests | 0 | 0 |
| Console / page errors | empty | empty |

The worker path is the one executing: the 687-byte bootstrap's only source of
`imageCompression` is the script imported at its line 9, and its catch posts only
`{error}`. Output byte count is identical on both paths, so the fix moved the work
off-thread without changing the result. Skip path (`tafi-small.jpg`, 1,000 B): zero
workers and the same `File` object (`lastModified` equal to the on-disk mtime). PDF
path: compressor never invoked.

### Verification rounds

Three independent read-only rounds. Round 1 passed five of six checks and found a
real blocker: the root-relative `libURL` made the vendored file dead weight and
silently sent every compression to the main thread. Round 2 confirmed the fix and
found a regression I introduced — the harness `edit` tool's formatter rewrote the
file with double quotes, failing `pnpm lint` and breaking the literal-copy
property. Round 3 confirmed the corrected revision: lint exit 0, `tsc --noEmit`
exit 0, two diff hunks, worker path proven positively and negatively, nothing
changed by the verifier.

## Native review

Lineage `review-6dcd714cd7441705` (compact-v2, generation 1). Risk tier **medium**,
one consolidated lens (`review-reliability`), frozen correction budget 182,
original changed lines 364.

### Finding R3-001 — CRITICAL, corrected

`src/app/components/layout/form/ResponseForm.tsx:42-68`, evidence class inferential,
`causal_disposition: worsened`:

> The new asynchronous image handler can commit a compressed file after the
> response type has already changed, because the handler remains tied to the
> change context captured when compression started while the submitted type can
> move to another field value. This creates a stale file-and-type submission path
> that did not exist when file selection committed synchronously.

The finding was correct and about this change: making file selection asynchronous
created a `{type: 'PDF', file: <JPEG>}` path that could not previously occur. It
worsens the pre-existing type/file mismatch listed under Out of scope, which is now
known to have two entry paths rather than one.

Correction, confined to that file: a `latestType` ref kept current by an effect,
and the compressed result is committed only while the type still matches.

```tsx
const compressed = await compressImageForUpload(file);
if (latestType.current === type) {
  onChange(compressed);
}
```

Twelve diff lines (10 added, 2 removed), declared to the provider **before** the
edit and recorded exactly as `correction_lines: 12`. Order matters: the correction
plan's binding carries the frozen target and is validated against the current
tree, so editing first moves the target and the capture is rejected with
`collectBinding does not carry one non-empty matching provider lineage and target
token`. The frozen file had to be restored (`md5 8fbe8ea5…`) before the plan could
be declared.

### Outcome

- Targeted validation of the corrected candidate: passed at the first attempt.
- Terminal state **approved**; final revision
  `sha256:ad4389d827027b39c23ced80789163d1d7b8c2a83cafe4f9fa6b904cb7336168`.
- Authority burned by the exact `acknowledge-approved` continuation, reported from
  its own returned envelope (`gentle-ai.review-acknowledged/v1`,
  `mutation_outcome: committed`). No STATUS was issued after the burn.
- Informational, non-blocking findings that opened no correction: **R3-002**
  (WARNING, `ResponseForm.tsx:38-81`) and **R3-003** (SUGGESTION,
  `ResponseForm.tsx:86-87`).

One operational episode is worth recording because the cause is not proven: in the
first session the targeted-validator `collectBinding` was rejected twice with
`collectBinding is unknown, expired, or belongs to a different session route`, and
it was accepted at the first attempt in a new session. Two hypotheses remain
compatible with the evidence — collect bindings are tied to the session route and
must be re-emitted by a STATUS in the current session, or the earlier transcription
differed in how `\n` sequences inside `proof`/`policyContent` were escaped. The
operating rule that survives both is the same: never retry a binding from another
session; re-query STATUS and transcribe literally.

## Accepted limitations

- `window.File` construction still happens once per compression on the main
  thread. This is expected and not fallback evidence: the library's
  `canvasToFile` returns a **Blob** from `convertToBlob`, so
  `result instanceof File` is false and the normalization at
  `image-compressor.ts:29` runs on both paths. That normalization also resets
  `lastModified` to `Date.now()`, because line 29 omits it.
- Counting main-thread `OffscreenCanvas` / `createImageBitmap` is the correct
  discriminator for worker vs fallback; counting `File` constructions is not.
- When editing files in this repo, normalise with
  `pnpm exec biome check --write <file>` afterwards: the harness `edit` tool
  rewrites string delimiters to double quotes, which breaks the Biome
  single-quote config. JSX attribute quotes are double by config
  (`jsxQuoteStyle: "double"`) and are correct, not an artifact.

## Not verified

- The `importScripts` load is not observable as an HTTP 200 from the page: the
  browser request log shows only the blob worker script, `performance` resource
  entries do not include it, and Next dev does not log `public/` asset requests.
  Success is proven by the worker's own message payloads, `curl` 200 with md5
  identity, and an in-page A/B (`relative → SyntaxError`, `absolute → loaded`).
- End-to-end authenticated upload through the real Server Action to UploadThing
  for a compressed image.
- Production behaviour: no `next build`, and any hosting-layer body cap is untested.
- `window.location.origin` correctness behind a non-root `basePath` or proxy
  rewrite (this repo sets none).
- Cross-origin CDN blocking under this CSP was inferred from `script-src`, never
  measured.
- RHF ref/unregister cleanup across TEXT ↔ IMAGE ↔ PDF transitions, and the
  TEXT/CODE branch at runtime: static review only.
- Image quality of the 337,183-byte output (dimensions, artifacts).

## Out of scope

### Pre-existing type/file mismatch (approved as the next work unit)

Switching the response type does not clear `file`, so `{type: 'IMAGE', file: <PDF>}`
can be submitted; `response.schema.ts` accepts `application/pdf` for any `type`. The
reader then renders `type: 'IMAGE'` through `next/image` (which cannot optimise a
PDF) or `type: 'PDF'` through `pdf.js` (which cannot parse a JPEG), leaving a
permanently broken card. Local DB has one `Response` row and it is consistent
(`type: PDF`, CDN `content-type: application/pdf`), so no local repair is needed.

The native review proved this defect has **two** entry paths, not one: the
asynchronous one opened by this change is now closed by the R3-001 correction, and
the synchronous type-switch path remains open. Agreed scope for the next work unit:
the pairing rule in the shared schema and in the action schema, plus clearing
`file` on type change.

### Native review follow-ups

- **R3-002** (WARNING, `ResponseForm.tsx:38-81`) and **R3-003** (SUGGESTION,
  `ResponseForm.tsx:86-87`). Neither opened a correction and neither justifies
  re-running the review of this candidate.
- The modal's *Aceptar* is not gated while compressing (~200 ms window where submit
  reports `Debes subir un archivo`); `localError` and `errorMessage` can render as
  two simultaneous `<p>`s.

### Production data audit

Feasible and cheap: UploadThing returns the real `Content-Type` on `HEAD`, so each
`Response` with `type` IMAGE or PDF can be compared against its `fileUrl`.
