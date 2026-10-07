# Creation authorization and the link section

Branch: `fix/creation-authorization`
Status: implemented and independently verified; delivery decided by the user (merge `--no-ff`, push,
delete branch)
Base: `main` at `acbb26b`

## Problem

The user reported, as `tier: 0`, seeing the "Añadir correlativa" and "Añadir link"
controls. An audit separated the reported symptom from the real defect.

### Already correct: deletion

All four delete actions authorise against the row's owner with the tier-2 bypass, and the
UI mirrors it:

| Action | Check |
| --- | --- |
| `tps/delete.action.ts:22` | `tp.idUser !== session.user.id && session.user.tier !== 2` |
| `midterms/delete.action.ts:22` | same shape |
| `responses/delete.action.ts:23` | same shape |
| `links/delete.action.ts:21` | same shape |

UI: `moduleContainer.tsx:53`, `moduleResponse.tsx:56`, `courseLinks.tsx:52`.
A `tier: 0` user can only delete their own content. No change needed.

### Defect 1 — `createCorrelative` has no server-side tier check

`correlatives/create.action.ts:13-15` validates the session and nothing else:

```ts
const session = await userUseCases.getSession();
if (!session) throw new Error('Necesitas iniciar sesion!');
```

The only gate is the modal's own guard, `ModalCreateCorrelativeContent.tsx:31`
(`if (session.user.tier === 0) throw ...`), and `course.tsx:55` renders the opener for any
session. Two consequences: a `tier: 0` user sees the button and only learns of the
restriction when the submit fails, and a Server Action is an HTTP endpoint, so the rule is
skippable by calling the action directly without the modal.

### Defect 2 — `createLink` has no tier check at all

`links/create.action.ts:18-20` also checks only the session, and unlike correlatives there
is no client-side check anywhere. Any signed-in user can create links, including ones
marked `official: true` (`schema:15`, `:27`).

### Defect 3 — the dedicated report flow was removed; only a dislike-as-report survives

The user remembered having built reporting for TPs and midterms, and asked whether it
really does not exist. Their memory was right and an earlier claim in this document ("no
report model exists, so there is no safety valve") was too broad. There are two distinct
mechanisms, and only one of them is gone:

**a. A dedicated report flow existed and was deleted as refactor collateral.**

- `3f1495b` ("se añaden reportes a tps y midterms", 2024-11-26) added report models to
  `prisma/schema.prisma`, `modalReportTp.tsx`, `modalReportMidterm.tsx`, their openers in
  `problemsTableTp.tsx` / `problemsTableMidterms.tsx`, and the `addReportTp` /
  `addReportMidterm` / `addReportLink` actions. It was a real confirmation modal writing to
  report rows, not a reaction.
- `91f9bb8` ("se mejoró muchisimo la estructura de los tps y parciales", 2025-02-04)
  deleted 21 files in one sweep, including both report modals and both
  `buttonReactionTp.tsx` / `buttonReactionMidterm.tsx`. The report feature went out with
  the restructure: no product decision, no replacement.
- Today only the residue is left: the commented-out actions in `actions.ts:87-128`
  referencing tables that no longer exist, the unreachable `ModalReportLinkContent.tsx`
  stub, and the orphaned `db/data.ts`.

**b. A negative reaction labelled "Reportar" is live today.**

`buttonReaction.tsx:81-90` renders a second button with `aria-label="Reportar"`,
`title="Reportar"` and a `TbAlertHexagon` icon whose handler is `handleLike(false)` — a
**dislike**, sent as `upsertReaction({ typeTarget: 'RESPONSE', reaction: false })`
(`:51-55`). This is exactly the "report gives it a negative reaction" the user described.
Two limits today:

- It is hardcoded to `typeTarget: 'RESPONSE'` and rendered only from
  `moduleResponse.tsx:110`, so it reports a *response*, never a TP, midterm or link.
- The plumbing for the other target types is nevertheless complete on the **read** side:
  `ReactionTo` still declares `TP`, `MIDTERM` and `LINK` (`schema.prisma:199-205`),
  `reaction.repository.ts:14-28` queries all three, `reactionUseCases.findSplitAll()`
  (`reaction.usecases.ts:10-19`) loads them, and `makeModules.ts:108` attaches
  `tpReactions` / `midtermReactions` to every module in the returned data shape. Only the
  write path in the UI is missing.

Consequence for the decision below: no dedicated report flow exists, but the negative
reaction already functions as one for responses, and extending it to `TP` / `MIDTERM` /
`LINK` is affordable because the read side and the enum already support it. Re-enabling the
link section may cost far less than building a reports table, writing a migration and a
moderator queue. Not decided here; recorded so the option is not lost.

### Also observed

`actions/users/` contains only `create.action.ts`, hardcoding `tier: 0`. No action or UI
writes `tier`, so ranks are changed directly in the database.

## Decisions taken by the user

1. **Correlativas**: require a superior rank, `tier >= 1`, enforced server-side.
2. **Threshold**: `tier >= 1` (any rank above 0), not `tier >= 2`.
3. **Links**: require the same `tier >= 1`.
4. **Link visibility**: the link list and the "Añadir link" button are hidden from
   `tier: 0` and remain visible to `tier >= 1`. The feature is not deleted; it stays
   behind rank until a reporting flow exists.
5. **Unchanged**: TPs, midterms, responses and comments stay open to `tier: 0`; deletion
   keeps its current owner-or-moderator rule.

## Design

Keep the repository's dominant inline authorization style: a single comparison at the top
of each action, right after the existing session check. No new abstraction is introduced
(`AGENTS.md`: do not invent architecture; align with the surrounding pattern).

1. `correlatives/create.action.ts` — after the session check, add
   `if (session.user.tier < 1) throw new Error('Debes tener un rango superior para añadir correlativas');`
   reusing the exact message already shown by the modal.
2. `links/create.action.ts` — after the session check, add the same comparison with
   `'Debes tener un rango superior para añadir links'`.
3. `course.tsx` — derive one boolean from the session and use it for both surfaces:
   - `const hasSuperiorRank = (session?.user.tier ?? 0) >= 1;`
   - render the `CourseLinks` block and the `CourseLinksSkeleton` fallback only when it is
     true, keeping the `linkUseCases.findByCourseId(id)` call inside that branch so no
     unused binding remains for Biome;
   - render `ModalCreateCorrelativeOpener` and `ModalAddLinkOpener` only when it is true,
     replacing the current `session?.user &&` condition, which the boolean already implies.
4. `ModalCreateCorrelativeContent.tsx:31` — keep the existing guard. It mirrors the
   dominant pattern of the delete modals, which also duplicate the server rule for
   fail-fast UX, and it is now unreachable for `tier: 0` through the UI.
5. `AGENTS.md` — add a short *Authorization (tiers)* subsection under **Security** stating
   the tier model, the `tier >= 1` and `tier: 2` rules, and that authorization belongs to
   the Server Action, never to the modal.

### Allowed edit surfaces

- `src/app/lib/server/actions/correlatives/create.action.ts`
- `src/app/lib/server/actions/links/create.action.ts`
- `src/app/components/feature/materias/course.tsx`
- `AGENTS.md`
- `odd/tasks/creation-authorization.md`

### Accepted trade-offs

- Existing links authored by `tier: 0` users become invisible to their own authors, who
  can no longer delete them from the UI. A moderator retains curation through
  `courseLinks.tsx`. Deliberate: the alternative was leaving unmoderated content public.
- `linkUseCases.findByCourseId` and the `updateTag('links')` calls become partially unused
  while the section is hidden for tier 0. Nothing is deleted, so re-enabling is a one-line
  reversal.
- `tier` lives in the issued JWT (`authOptions.ts:78`), so a rank change does not take
  effect until the user signs in again. Pre-existing and documented in
  `odd/tasks/delete-action-authorization.md`.

### Out of scope, recorded

- A dedicated report flow of the `3f1495b` kind: report tables, a migration, an action, and
  a moderator queue.
- Extending the existing dislike-as-report to `TP` / `MIDTERM` / `LINK`, which would reuse
  the already-live read side and could remove the need to hide the link section.
- `ModalReportLinkContent.tsx`, `actions.ts:87-128` and `db/data.ts` remain dead code.
- Rank management: nothing writes `tier`; ranks stay a manual database operation.
- The `reactions/upsert.action.ts:22-27` lookup ignores `typeTarget`.

## Tasks

- [x] Create the ODD artifacts and the feature branch.
- [x] Gate `createCorrelative` server-side at `tier >= 1`.
- [x] Gate `createLink` server-side at `tier >= 1`.
- [x] Gate the course UI at `tier >= 1` for links and correlativas.
- [x] Document the tier model in `AGENTS.md`.
- [x] Independent verification: lint, production build, and a diff readback.
- [x] Close out with the delivery decision.

## Verification plan

`AGENTS.md` forbids tests and no test framework exists, so verification is:

- `pnpm lint` clean.
- `pnpm build` exit 0.
- A readback confirming both gates sit after the session check and before the first
  database write, and that no other create action changed behaviour.

Not verifiable cheaply, and to be reported as such: an end-to-end click-through as a
`tier: 0` user, because sign-in is Google OAuth and no local session can be fabricated.

## Verification evidence

Performed by an independent verifier against the uncommitted working tree; the tree was
byte-identical before and after, and nothing was fixed, edited or committed by it.

- `pnpm lint` → exit 0. Its single warning is `src/app/globals.css:50:19
  lint/complexity/noImportantStyles` (`!important`), pre-existing and outside this diff;
  zero warnings in the four changed files.
- `pnpm build` → exit 0. Next.js 16.3.8 (Turbopack), Cache Components enabled, TypeScript
  clean, 9/9 static pages generated; no type errors.
- Gate placement confirmed: `correlatives/create.action.ts` session `:15`, gate `:16-17`,
  first write `:19`; `links/create.action.ts` session `:20`, gate `:21`, first write `:23`.
  Both diffs are pure additions, nothing reordered or dropped, and the success paths still
  reach their writes.
- No other create action changed; `tps`, `midterms`, `responses`, `comments` and
  `reactions` keep session-only checks, and `tier` appears in none of them.
- `course.tsx` leaves no unused binding: `session` `:25`, `linkUseCases` `:7`/`:45`,
  `CourseLinks` `:13`/`:45`, `CourseLinksSkeleton` `:3`/`:44`, both openers `:10`/`:57` and
  `:9`/`:58`, `id` `:23`/`:41`/`:45`/`:51`/`:61`/`:62`.
- The new correlativas message is byte-identical to the modal's existing one
  (`correlatives/create.action.ts:17` vs `ModalCreateCorrelativeContent.tsx:32`), so the
  tier-0 path never shows two texts for the same rule.
- `AGENTS.md` claims spot-checked true: `tier: 0` at provisioning
  (`users/create.action.ts:19`, `user.repository.ts:20`), no other `tier` writer, the
  `tier !== 2` bypass in exactly four delete actions, and the injected block at the end of
  the file untouched.

### Not verified, and not to be claimed

- **No runtime or end-to-end proof.** No click-through as `tier: 0`. The UI claim rests
  solely on the server-rendered condition at `course.tsx:25,43,56`; the action claim on
  inspection plus lint and build. No observed RED/GREEN, because no runnable deterministic
  test exists and `AGENTS.md` forbids adding one.
- **No executed authorization probe.** Local PostgreSQL is available, but both actions are
  session-gated, so invoking them as a forged `tier: 0` caller was not attempted and the
  database was not touched.

### Residual findings, pre-existing and out of scope

- `links/delete.action.ts:22` throws `No tienes permiso para eliminar este tp` for a link.
- `ModalCreateCorrelativeContent.tsx:31` uses `tier === 0` where the actions use `< 1`;
  equivalent for non-negative tiers.
- `course.tsx:26` still calls `courseUseCases.findAll()` outside the gate, so a tier-0 or
  anonymous render starts a course query whose promise is never consumed. Pre-existing and
  unchanged here, in contrast with the link fetch, which this change defers into the branch
  at `:45`.
- Hiding `CourseLinks` also hides the only UI path to delete a link, so a tier-0 author can
  no longer remove links they created before this change. Accepted above.
