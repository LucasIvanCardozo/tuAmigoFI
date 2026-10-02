# Upload customId and upload seam guard

Branch: `feat/upload-custom-id`
Status: implemented and independently verified, with the dashboard grouping left unconfirmed
Commit: see below
Base: `main` at `ac6f326`

## Problem

Two defects in the same seam.

**1. Uploads are anonymous in storage.** `uploadFile` passes the raw `File` to
`utapi.uploadFiles([file])` (`src/app/lib/server/utils/uploadthing.ts:100`) with no
`UTFile` and no `customId`, so UploadThing assigns an opaque key and the dashboard is a
flat list. The `UploadMeta` that gets built at every call site is only passed to
`console.info` (`:86-93`), and its `entityId` is the literal `'__pending__'` at all three
callers because the row does not exist yet — `withUploadRollback` uploads *before* the
insert runs (`:180`). Verified: `UTFile` and `customId` appear nowhere in `src/`.

**2. The seam does not authenticate, and the write path trusts the client for identity.**
`uploadFile` has no `auth()` call and imports nothing auth-related; the only gate is a
session check in each calling action. Worse, all three actions take `idUser` from
`FormData` and pass it straight into the insert:

| Action | Client supplies | Server uses |
| --- | --- | --- |
| `tps/create.action.ts` | `ModalAddTpContent.tsx:27` → `idUser: session.user.id` | inserted as `Tp.idUser` |
| `midterms/create.action.ts` | `ModalAddMidtermContent.tsx:27` → `idUser: session.user.id` | inserted as `Midterm.idUser` |
| `responses/create.action.ts` | `ModalAddResponseContent.tsx:31` → `idUser: session.user.id` | inserted as `Response.idUser`, and used in the duplicate check |

`AGENTS.md` (Security) states *"do not trust client-supplied `idUser`"*. The write path
does exactly that, even though the session has already been resolved in each action.

## Decision

User decisions, taken after the reconnaissance below.

1. **Prefix: readable course slug.** `analisis-matematico-i/tp/a1b2c3d4`.
2. **Scope includes hardening the seam**, not only the cosmetic customId.

### Reconnaissance that shaped the design

- **The UploadThing skill in this repository is carta-qr's, copied verbatim.**
  `.agents/skills/uploadthing/SKILL.md:3` reads *"Integrate UploadThing in carta-qr
  (Next.js 16 App Router, cacheComponents, multi-tenant)"*, and it prescribes a
  FileRouter, `<NextSSRPlugin />` and an `/api/uploadthing` route — all of which
  `AGENTS.md` forbids. It says nothing about `customId` either way: that design lives in
  carta-qr's archived OpenSpec change, not in the skill. Only its `utapi` and size-cap
  guidance applies here. Left untouched by this work unit.
- **`Course` has no slug or code.** Fields are `id` (cuid), `name` (`@unique`, with
  spaces and accents), `nameNormalized` (accents stripped, spaces kept), `cg`, `hs`,
  `optional`. A readable prefix therefore needs a slug helper.
- **`courseUseCases.getById` is already cached** (`'use cache: remote'`, `cacheLife
  ('weeks')`, `cacheTag('courses')`), so looking the course up for its name costs a
  cache read rather than a new query on repeat uploads.
- **`Response` has no `idCourse`.** The response action already resolves it through the
  parent, and the relation field on `Tp`/`Midterm` is named **`courses`** (plural), so
  the parent's course name can be selected in the same query.
- **UploadThing 7.7.4 declares no limit on `customId`.** `UTFilePropertyBag` types it as
  `customId?: string | undefined` and the SDK only forwards it as the `x-ut-custom-id`
  header. carta-qr's 50-character cap is its own budget, and the "~64" it cites comes
  from external docs with no local evidence. This work unit keeps carta-qr's 50-char
  discipline as a deliberate, documented budget rather than a library requirement.
- **Two constructor details must be respected.** The signature is
  `UTFile(parts, name, options)` — three arguments; the two-argument form does not
  compile. And the `UTFile` must be constructed **inside** the retry closure so each
  attempt gets a fresh UUID; hoisting it freezes the `customId` and can collide if the
  first attempt was accepted server-side but its response was lost.

## Design

### `src/app/utils/slugify.ts` (new)

A pure function: NFD-normalize, strip combining marks, lowercase, collapse every run of
non-alphanumeric characters to a single `-`, trim leading and trailing `-`.

### `src/app/lib/server/uploadthing/meta.ts`

```ts
export type EntityType = 'tp' | 'midterm' | 'response';

export type UploadMeta = {
  courseSlug: string;
  entityType: EntityType;
};
```

`courseId` and `entityId` are dropped: `entityId` was always the literal
`'__pending__'` and carried no information, and the slug is derived from the course row
rather than from the client.

### `src/app/lib/server/utils/uploadthing.ts`

- Authenticate first, before any storage contact: resolve the session and return
  `{ success: false, error: 'Necesitas iniciar sesion!' }` when absent.
- Build the `customId` as three segments joined by `/`:
  `courseSlug.slice(0, 32)`, `entityType.slice(0, 8)`, `crypto.randomUUID().slice(0, 8)`
  — a total of at most 50 characters, which is the documented budget.
- Build the `UTFile` **inside** the retry closure, preserving `file.name` and
  `file.lastModified`.
- `meta` becomes required, since the `customId` cannot be built without it.

### The three actions

- Resolve `idUser` from `session.user.id`; stop reading it from `FormData`.
- Resolve `courseSlug` from the course row: `slugify(course.name) || course.id`, so a
  name that slugifies to nothing still yields a valid segment.
- Pass the new `UploadMeta` shape.
- `responses/create.action.ts` selects the parent's course name through the `courses`
  relation in the query it already runs, adding no round trip.

### The three modals

Drop `idUser` from the action call. Keep the existing session guard, which the modals
still use to show `Necesitas iniciar sesion!`.

### `AGENTS.md`

Update only the Metadata bullet (around line 262) to describe the new `UploadMeta`
shape. Do not touch the `nextjs-agent-rules` block, which `next dev` rewrites.

## Allowed edit surfaces

- `src/app/utils/slugify.ts` (new)
- `src/app/lib/server/uploadthing/meta.ts`
- `src/app/lib/server/utils/uploadthing.ts`
- `src/app/lib/server/actions/tps/create.action.ts`
- `src/app/lib/server/actions/midterms/create.action.ts`
- `src/app/lib/server/actions/responses/create.action.ts`
- `src/app/components/layout/modals/ModalAddTpContent.tsx`
- `src/app/components/layout/modals/ModalAddMidtermContent.tsx`
- `src/app/components/layout/modals/ModalAddResponseContent.tsx`
- `AGENTS.md` (the Metadata bullet only)
- `odd/tasks/upload-custom-id-and-seam-guard.md`

## Tasks

- **T1 done.** `slugify` added at `src/app/utils/slugify.ts`.
- **T2 done.** `UploadMeta` is `{ courseSlug, entityType }`.
- **T3 done.** The seam authenticates first and builds the three-segment `customId` inside
  the retry closure.
- **T4 done.** The three actions derive `idUser` from the session and resolve the course
  slug, with the response path reusing the query it already ran.
- **T5 done.** `idUser` removed from the three modal calls, guards kept.
- **T6 done.** The `AGENTS.md` Metadata bullet rewritten; the `nextjs-agent-rules` block
  untouched.
- **T7 done.** See Verification.

## Verification

Executed by an independent verifier against the working tree, which the code commit below
snapshots byte-identically.

### Confirmed

- **The `customId` reaches the wire.** A real request against UploadThing's ingest endpoint
  carried `x-ut-custom-id=analisis-matematico-i%252Ftp%252F3fe92fc9`, i.e. the three
  segments built by the seam, on the real ingest URL. This is the strongest available
  evidence that the mechanism is wired correctly.
- **The session guard precedes any storage contact.** At
  `src/app/lib/server/utils/uploadthing.ts` the order is `!file` (L89), `getSession()`
  (L92) and its guard (L93), the size check (L96), then `utapi.uploadFiles` (L118).
  Executed with only the session and `utapi` modules stubbed: a session-less call returned
  `{ success: false, error: 'Necesitas iniciar sesion!' }` with **zero** fetch calls, and
  an oversized session-less call returned the session error rather than the size error,
  proving the order.
- **The length budget cannot overflow.** Executed with the identical expression and a
  100-character slug: `tp` 44, `midterm` 49, `response` **50**, matching
  `32 + 1 + 8 + 1 + 8`. An empty slug is possible at the seam but unreachable from the
  three actions: `slugify(course.name) || course.id` / `|| tp.idCourse`, `slugify` cannot
  emit `/`, and cuids are `[a-z0-9]`, so a malformed segment always has a real fallback.
- **A fresh UUID per attempt.** The `UTFile` is built inside the closure at L109-117.
  With two forced transient failures the three attempts produced three distinct
  ids (`ecde624d`, `06c2392b`, `b140eabd`), with `name` and `lastModified` preserved.
- **Client identity is gone from every create path.** All three actions set
  `const idUser = session.user.id` before use, including the `db.response.findFirst`
  duplicate check, and `idUser` is absent from all three Zod schemas and all three modal
  call sites. The modals still keep their session guards.
- **No unintended regressions.** The `idMidterm && idTp` throw, the duplicate check, the
  `'No se encontró la materia'` error, `withUploadRollback` (observed compensating a
  `deleteFiles` call when the save throws) and the three `updateTag` calls are intact.
  A bogus `idCourse` now fails earlier, before the upload, instead of leaving a
  compensating delete behind.
- **`courses` is the real relation name** on both `Tp` and `Midterm`, and the build
  compiles the select, with no `ignoreBuildErrors` in `next.config.mjs`.
- `pnpm lint`: `LINT_EXIT=0`, 177 files, exactly 1 warning at `src/app/globals.css:50`.
  `pnpm build`: `BUILD_EXIT=0`, run twice.
- **Nothing outside the declared surfaces changed.** `git status --short` after the
  verifier's cleanup listed exactly the nine modified files plus the two new ones.

### NOT confirmed, and why

**The dashboard grouping — the whole point of the change — is unverified.** The locally
configured `UPLOADTHING_TOKEN` is rejected by both UploadThing's ingest endpoint
(`400 Failed to verify URL: Invalid signature`) and its API (`401 Invalid API key`), and
`.env.production` contains no `UPLOADTHING_TOKEN` at all. The verifier's attribution run
proves this is the credentials and not this change: plain `File` with no `customId`,
`UTFile` with no options, a `customId` without a slash, and a `customId` with a slash all
failed the same way. The SDK sends the value verbatim as a header
(`x-ut-custom-id`, `node_modules/uploadthing/dist/upload-builder-BlFOAnsv.js:563`, no
`encodeURIComponent`), but the observed ingest URL carried it percent-encoded
(`%252F`), so whether UploadThing decodes that back into a `/` and renders folder
grouping is **unknown**. Note that carta-qr's spec asserts the grouping without a
dashboard test as well, so this is unverified in both projects. Confirming it costs one
real upload with a working token plus one look at the dashboard.

Also unverified: the end-to-end flow through the modal with a Google session, and the
`'use cache: remote'` call from inside a Server Action at runtime. The Next 16 docs place
no restriction on that pattern — they document Server Actions and caching composing — so
it is expected to work, but lint and build are the only evidence here.

### Defect the verifier found in this change, accepted as is

The session check (L92) sits outside the `try` that starts at L102, so if `getSession()`
itself throws, `uploadFile` propagates instead of returning a result union. Disposition:
**accepted, not changed.** The pre-existing guards were already outside the `try` for the
same reason, so this preserves the surrounding structure; the only reachable consequence
is that a NextAuth internal failure surfaces through `createAction`'s catch as the
standard error result instead of a generic upload message, which is strictly more
informative. There is no security consequence: a throw means no storage contact and no
insert.

### New findings outside this work unit's scope

- **A real authorization hole in four delete actions.** `tps/delete.action.ts:11,17`,
  `midterms/delete.action.ts:11,17`, `responses/delete.action.ts:12,18` and
  `links/delete.action.ts:10,16` still take `idUser` from the client and gate on
  `if (session.user.id !== idUser && session.user.tier !== 2)` before mutating the row
  named by a client-supplied `id`. Sending one's own `idUser` with someone else's `id`
  passes the check. Pre-existing, and the same class of defect — contradicting
  `AGENTS.md`'s Security rule — that this work unit fixed on the create path only.
- **`withRetry` is largely inert.** `uploadFiles` *returns* an `UPLOAD_FAILED` result on a
  transport 503 instead of throwing, and `withRetry` only retries on throws, so the common
  failure mode gets exactly one attempt. The fresh-UUID-per-attempt protection therefore
  rarely applies, though it remains correct.
- `cleanupCourseAssets` has no callers.

## Review workload

Ten files, most of them small. The risky one is `utils/uploadthing.ts`, which is on the
production path for every TP, midterm and response upload.

## Out of scope, deliberately

- Removing or replacing `.agents/skills/uploadthing/SKILL.md`, which describes the wrong
  project and the wrong architecture.
- The client-supplied `idCourse`, which stays a legitimate client choice: there is no
  session-derived course, and resolving the course row now validates it implicitly.
- Migrating existing opaque keys, and any change for already-uploaded files.
