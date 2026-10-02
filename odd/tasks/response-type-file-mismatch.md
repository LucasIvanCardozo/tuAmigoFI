# Response type and file mismatch

Branch: `fix/response-type-file-mismatch`
Status: done (delivered without a native review, at the user's decision — see Review below)
Commit: `370b74b` — `fix(response): reject a file that does not match the response type`
Base: `main` at `27d561a`

## Problem

Pre-existing defect, surfaced by the native review of the upload work unit (finding
R3-001 was the asynchronous entry path into this same corrupt state, and it is
already corrected).

Switching the response `type` did not clear the `file` field, so a submission could
carry a pair that does not match: `{type: 'IMAGE', file: <application/pdf>}` or
`{type: 'PDF', file: <image/jpeg>}`. `src/app/lib/shared/schemas/response.schema.ts`
validated the file against an allow-list (`application/pdf`, `image/jpeg`,
`image/png`) **independently of `type`**, and the action's own schema in
`src/app/lib/server/actions/responses/create.action.ts` did the same, so nothing
rejected the mismatch.

The reader then renders by `type`, not by the file's real content:

- `src/app/components/feature/materias/moduleResponse.tsx:90` renders `IMAGE`
  through `next/image`, whose optimiser cannot process a PDF.
- `src/app/components/feature/materias/moduleResponse.tsx:100` renders `PDF`
  through `PdfView` (`pdf.js`), which cannot parse a JPEG.

Either way the card is permanently broken for every student who opens that course,
and the row is public user-generated content that only its author can delete.

Local data was clean before and after: one `Response` row, `type: PDF`, whose
`fileUrl` serves `content-type: application/pdf`.

## Two entry paths

The native review established there are two ways to reach the mismatched state, not
one:

1. **Asynchronous** — the compression handler could commit a compressed image after
   the user changed the type. Closed by the R3-001 correction in
   `ResponseForm.tsx` (the `latestType` guard), and re-tested here.
2. **Synchronous** — the user picks a file, then changes the type. This work unit.

## Decision

Two layers, with different jobs, and the rule written once.

- **Correctness: a pairing rule at both validation boundaries.** It belongs in the
  object-level `superRefine` that both schemas already have, because it depends on
  two fields rather than on the file alone. To avoid duplicating the rule and its
  messages, the logic is a single exported predicate,
  `getResponseFileTypeError(type, file)`, living next to the shared schema and
  imported by the action. A predicate returning a message keeps the rule in one
  place and avoids depending on zod's internal refinement context type.
- **Usability: clear `file` when the type changes.** Without it the user reaches a
  dead end: the old file stays in form state and the schema rejects the submission
  until they pick a new one. Covered in two halves:
  - `shouldUnregister` on the file `Controller`, so switching to `TEXT` or `CODE`
    removes the value when the field unmounts.
  - the existing `latestType` effect in `ResponseFileField`, extended to clear the
    field on an `IMAGE` ↔ `PDF` change, where the component stays mounted. The
    effect returns early when the type has not changed, so a mount never clears.

## Allowed edit surfaces

- `src/app/lib/shared/schemas/response.schema.ts`
- `src/app/lib/server/actions/responses/create.action.ts`
- `src/app/components/layout/form/ResponseForm.tsx`

## Tasks

- [x] T1 Add `getResponseFileTypeError` to `response.schema.ts` and apply it in its
  existing `superRefine`, reporting the issue on `path: ['file']`.
- [x] T2 Import the same predicate into `create.action.ts` and apply it in its
  existing `superRefine`, so the server boundary rejects the mismatch too.
- [x] T3 Clear `file` on type change in `ResponseForm.tsx`: `shouldUnregister` on the
  file `Controller`, plus the `latestType` effect clearing on `IMAGE` ↔ `PDF`.
- [x] T4 Verify with lint, types, and browser checks that a mismatched pair can no
  longer be submitted while both legitimate pairs still can.
- [x] T5 Commit the work unit.

## Evidence

### Static: one rule, two boundaries

| What | Location |
| --- | --- |
| Predicate definition, the only one in `src/` | `response.schema.ts:11` |
| Client call site, inside the existing `superRefine` | `response.schema.ts:52` |
| Server call site, inside the action's own `superRefine` | `create.action.ts:44` |
| Import | `create.action.ts:5` |

`Para una imagen selecciona` and `Para un PDF selecciona` appear once each in
`src/`. The running dev server compiled both modules together, and the action
module's chunk source contains the call — so the server boundary cannot drift from
the client one, because it calls the same function.

Pre-existing and untouched by this diff: the *allow-list* text is still duplicated
in several places (`response.schema.ts:7` vs `create.action.ts:25-27`, plus the tp
and midterm schemas and actions). That is separate debt; the new pairing rule and
its two messages exist exactly once.

### Commands

- `pnpm lint` → exit 0, 0 errors, exactly 1 warning, the pre-existing
  `src/app/globals.css:50` `noImportantStyles`.
- `pnpm exec tsc --noEmit` → exit 0, empty output.
- `pnpm exec biome check` on the three changed files → `No fixes applied`.
- Work-unit close, project-wide check: `pnpm exec biome check --write .` over 176
  files reported `No fixes applied`, all three file md5s unchanged, and
  `git diff --stat` unchanged. The repo was already formatted; the single remaining
  `FIXABLE` is `globals.css:50`, whose fix Biome itself marks unsafe and which must
  stay as it is (removing `!important` would break sileo's toast stacking).

### Decisive client test — a mismatched pair is blocked

Type `PDF` with `/tmp/tafi-big.jpg` attached (compression correctly bypassed, so the
JPEG did reach form state):
`{type: 'PDF', file: {name: 'tafi-big.jpg', size: 4658166, type: 'image/jpeg'}}`.
Submitting produced `{field: 'file', message: 'Para un PDF selecciona un archivo PDF'}`,
`isValid: false`, and **0 network requests** of any kind — no POST, no `Next-Action`.

### Legitimate pairs still pass validation

Discriminator: validation clean (`errors: []`, `isValid: true`) **and** the flow
stopping at the session guard with the `Necesitas iniciar sesion!` toast.

| Pair | Form state | Validation | Requests |
| --- | --- | --- | --- |
| PDF + `/tmp/tafi-big.pdf` | 1,740,994 B `application/pdf` | clean | 0 |
| IMAGE + `/tmp/tafi-small.jpg` | 1,000 B `image/jpeg`, untouched | clean | 0 |
| IMAGE + `/tmp/tafi-big.jpg` | compressed to 337,183 B | clean | 0 |

Compression path unchanged by this work unit: 1 worker created, the posted
`imageCompressionLibUrl` is the absolute `http://localhost:3001/browser-image-compression.js`,
8 messages (`progress` 5→100 plus one `file`) with no worker error, **0** main-thread
`OffscreenCanvas` constructions and **0** `createImageBitmap` calls, and
4,658,166 → 337,183 bytes.

### Clearing on type change

- **IMAGE ↔ PDF**: switching cleared the field (`file: undefined`), the name span
  disappeared, and submitting reported `Debes subir un archivo`. Verified in both
  directions.
- **TEXT/CODE (`shouldUnregister`)**: after switching to `Texto`, the `file` key was
  **removed from form state entirely** and `registeredFields` no longer listed it;
  switching back to `Imagen` re-registered it empty with no stale span.

### R3-001 re-tested, genuinely in flight

The first attempt was invalid (the switch landed ~10.5 s after compression had
already resolved at +165 ms) and was discarded. The second attempt armed a page-side
`MutationObserver` that switched the type the instant `Procesando imagen...`
appeared, so the switch provably landed mid-flight:

```
939901  auto-switch fired, processingVisible=true, workersSoFar=1, timedSoFar=0
939905  switch to PDF dispatched   → _formValues.file = 'undefined'
940092  worker's FINAL {file,id} arrives, 337,183 B image/jpeg   (+187 ms after the switch)
950402  final state: {type:'PDF', file:'undefined'}, no span
```

The compressed JPEG reached the page and was never written into form state; no
`{type:'PDF', file:<JPEG>}` state existed at any observation point. Submitting that
state produced `Debes subir un archivo` and 0 requests.

### Hygiene

Console and page errors empty across 7 submits, 4 compression runs and every type
switch; no CSP violation; no jsdelivr request; the CSP grants no jsdelivr source, so
a CDN URL would have failed the worker. Database: `Tp` 0, `Response` 0, `Midterm` 0
rows created in the window (column `created_at`), totals unchanged at 4 / 1 / 0.
`git status` and all file md5s stable across the run.

## Not verified

- **Server boundary at runtime.** While logged out,
  `ModalAddResponseContent.tsx:27` throws the session error *before* calling
  `createResponse`, so the action is unreachable from the UI — legitimate pairs
  validated clean and produced the toast with 0 requests. The action id was not
  isolated from the client chunks and no `Next-Action` POST was forged. The server
  side therefore rests on static evidence: the same imported predicate, the same
  call path, `tsc` clean, and the compiled action module containing the call.
- `image/png` was never exercised; only JPEG and PDF.
- Over-limit and non-allowed file paths (`El archivo debe pesar menos de 5 MB`,
  `Solo se admite PDF, JPEG o PNG`, server `Max 5MB`) were not exercised.
- The worker's own `importScripts` request is not visible in the browser request log,
  so "no jsdelivr request" rests on the posted absolute `libURL`, the CSP having no
  jsdelivr grant, `workerErrors: []` and a filtered request log — not on an observed
  worker fetch.
- A production build (`next build` was not run), so nothing confirms the rule
  survives bundling.

## Accepted behaviour and follow-ups

- With `submitCount > 0`, RHF's `reValidateMode: 'onChange'` makes the cleared field
  surface `Debes subir un archivo` immediately after a type switch. Accepted: once
  the type is IMAGE or PDF a missing file really is invalid.
- Switching type mid-compression can leave `Procesando imagen...` visible under the
  new field until the in-flight promise settles (~190 ms). Cosmetic; the guard
  already protects the value.
- The pairing rule is a no-op for `TEXT`/`CODE`. Safe: the action only uploads when
  `type` is `IMAGE` or `PDF`, so a file on a `TEXT` payload is ignored and never
  reaches stored `fileUrl`.
- Informational findings from the same lineage as the upload work unit, **not**
  addressed here: **R3-002** (WARNING) and **R3-003** (SUGGESTION).

## Review

The native review of this candidate was **not performed**. The fresh consent envelope
returned `declined_this_candidate` (`action: declined`, `lineage_created: false`,
`mutation_performed: none`), and the user confirmed the decline was deliberate and
chose to deliver under ordinary repository policy instead.

Stated plainly: this is the only work unit of the session delivered **without** a
native review. Its independent verification passed all eight checks, and that
verification — not a review — is the evidence behind it.

Two observations for whoever reads this:

- A previous START attempt had failed with `consent-binding-stale`: a consent
  binding created by the reminder machinery had expired after 10 minutes without an
  answer, so the decline arrived on the second, fresh envelope.
- The provider bases the review candidate on `origin/main`, not local `main`. With
  local `main` five commits ahead, the declined envelope reported
  `changed_files: 10, changed_lines: 692` — this work unit's three files plus the
  seven files of the already-approved and already-merged uploads work unit.

## Integration notes from the merged tree

The merged tree was smoke-tested after both sibling branches landed. Two things
surfaced that this branch does not address and that no per-branch verification could
have seen, because the API involved only exists once the branches meet:

- `compressImageForUpload` runs for ~2 s and never reports pending, so the global
  spinner stays silent during compression even though `useLoaderPending` now exists.
  Feedback is limited to the inline `Procesando imagen...` span and a disabled input.
- `Loader` renders as `fixed bottom-0 right-0` with no `z-index`, while modals use a
  `z-100` backdrop. Whether the loader can paint underneath an open modal is
  unverified; no path that shows the loader with a modal open was found today.
