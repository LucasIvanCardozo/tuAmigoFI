# Delete action authorization

Branch: `fix/delete-action-authorization`
Status: implemented and verified by an executed exploit-and-fix check, pending the user's
merge decision
Base: `main` at `ee4dcb1`

## Problem

Four delete actions authorise on a **client-supplied owner id** instead of the row's real
owner. Confirmed by an independent audit.

| Action | Schema | Check | Row mutated |
| --- | --- | --- | --- |
| `tps/delete.action.ts` | `:10-11` `{ id, idUser }` | `:17` | `:36` `db.tp.delete({ where: { id } })` |
| `midterms/delete.action.ts` | `:11` | `:17` | `:34` |
| `responses/delete.action.ts` | `:12` | `:18` | `:34` |
| `links/delete.action.ts` | `:10` | `:16` | `:19` — and it never reads the row at all |

Every one gates on `session.user.id !== idUser && session.user.tier !== 2`, where `idUser`
arrives from the client. Server Actions are HTTP endpoints, so the modals' own guards are
decorative: sending your own id as `idUser` together with a victim's `id` passes the check
and deletes their content.

### Why the client value is worthless here

This is the part that makes the defect easy to miss: **every call site passes the target
row's owner, not the caller.**

```
ModalDeleteTpContent.tsx:33        deleteTp({ id: tp.id, idUser: tp.idUser })
ModalDeleteMidtermContent.tsx:33   deleteMidterm({ id: midterm.id, idUser: midterm.idUser })
ModalDeleteResponseContent.tsx:34  deleteResponse({ id, idUser })   // from the row
ModalDeleteLinkContent.tsx:25      deleteLink({ id: link.id, idUser: link.idUser })
```

The modals need that value for their own UI guard — "show the delete control only to the
owner or a moderator" — which is legitimate. The mistake is also *sending* it and letting
the server treat it as the caller's identity. The owner's id is public data: it already
travels to the browser in the row, so a server that trusts it is trusting a value the
client controls and can already read.

### Impact

Deleting a `Tp` or `Midterm` also deletes its child responses and their UploadThing files
(`:25-29` in each), so the blast radius is the whole subtree of another user's
contributions, plus their stored files.

## Reconnaissance

- **All four models have an owner column**, so every one can be checked against the row:
  `Tp.idUser` (`schema.prisma:183`), `Midterm.idUser` (`:114`), `Response.idUser` (`:151`),
  `Link.idUser` (`:99`). None nullable.
- **The fix is exactly four files.** No other action takes an owner-ish id from the client:
  the five create actions derive `idUser` from `session.user.id`, and
  `reactions/upsert.action.ts:19` unpacks it from the session. There is no report/flag
  action in the live tree.
- **`tier` is server-derived and not writable by a client.** It is set to `0` at creation
  (`users/create.action.ts:19`), injected into the session from the database
  (`authOptions.ts:64,78,101`), and no action or schema writes it. `2` is the moderator
  bypass. So `session.user.tier` can be trusted.
- **Three of the four already load the row**, so ownership can be checked without a new
  query: `tps` (`:20-23`), `midterms` (`:20-23`) and `responses` (`:21-24`) all
  `findUnique`, they just do not `select` the owner. `links/delete.action.ts` has no read
  and needs one.
- **No tests and no OpenSpec** exist in this repository, and `AGENTS.md` forbids adding
  tests. Verification is therefore lint, a production build, and an executed
  authorization check.

## Design

For each of the four actions:

1. **Remove `idUser` from the Zod schema** and from the destructured callback parameters.
   The caller's identity is the session, and nothing else.
2. **Read the row's owner.** Add `idUser: true` to the existing `select` in `tps`,
   `midterms` and `responses`. For `links`, add the read the action is missing.
3. **Authorise against the row**, preserving the moderator bypass exactly:
   `if (row.idUser !== session.user.id && session.user.tier !== 2) throw ...`, keeping the
   existing permission-error message string unchanged so the UI's error text does not move.
4. **Fail cleanly when the row is absent.** `links/delete.action.ts` had no read at all, so
   an absent row reached Prisma and surfaced `P2025`; it now has an explicit error. The
   other three already threw (`'No existe el TP'`, `'No existe el examen'`,
   `'No existe la respuesta'`) — a claim in the first draft of this document that they
   would surface a TypeError was wrong, and the independent verifier corrected it. What
   actually changes for those three is that the authorisation check necessarily moves
   *after* the read, because the owner comes from the fetched row.
5. **Clean the modals.** Drop `idUser` from the four action calls. Their own UI guards stay
   untouched, since they legitimately need the owner to decide what to render. Note that
   Zod strips unknown keys by default, so leaving the calls as they are would still work —
   the cleanup is to stop a client-sent identity from looking meaningful to the next reader.

Nothing else about these actions changes: the UploadThing cleanup order and its per-file
try-safety, the child-record iteration, the cascade behaviour, the `updateTag` calls and
the error messages all stay as they are.

## Allowed edit surfaces

- `src/app/lib/server/actions/tps/delete.action.ts`
- `src/app/lib/server/actions/midterms/delete.action.ts`
- `src/app/lib/server/actions/responses/delete.action.ts`
- `src/app/lib/server/actions/links/delete.action.ts`
- `src/app/components/layout/modals/ModalDeleteTpContent.tsx`
- `src/app/components/layout/modals/ModalDeleteMidtermContent.tsx`
- `src/app/components/layout/modals/ModalDeleteResponseContent.tsx`
- `src/app/components/layout/modals/ModalDeleteLinkContent.tsx`
- `odd/tasks/delete-action-authorization.md`

## Tasks

- **T1** Fix `deleteTp` and `deleteMidterm` (same shape).
- **T2** Fix `deleteResponse`.
- **T3** Fix `deleteLink`, which needs the read it is missing.
- **T4** Drop `idUser` from the four modal calls.
- **T5** Verify and commit.

## Verification

Executed by an independent verifier, and the point of it was to **run** the exploit rather
than read the code.

### The vulnerability was real — RED, executed against the pre-fix code

The verifier rebuilt the pre-fix code in a temporary `git worktree` and ran the identical
harness there: user A, sending **A's own id** in the old `idUser` field together with a row
id belonging to B.

| Action | Pre-fix result | Row deleted | Children deleted |
| --- | --- | --- | --- |
| `deleteTp` | `success: true` | yes | 2 responses |
| `deleteMidterm` | `success: true` | yes | 1 response |
| `deleteResponse` | `success: true` | yes | — |
| `deleteLink` | `success: true` | yes | — |

The returned rows carried B's `idUser`, proving ownership. The same script against the
fixed tree rejected all four, which is the differential control.

### The fix blocks it — GREEN

With A attacking B's rows: all four returned `success: false` with the permission error,
**every row still existed afterwards**, and the stubbed `deleteUploadThingFile` recorded
**zero** calls. A rejected request touches no file.

### Everything else still works

- **Owner path.** B deleting B's own rows succeeded for all four, and the `Tp`/`Midterm`
  cleanup ran in the right order: child response `fileKey`s first, then the row's own.
- **Moderator bypass preserved.** A `tier: 2` user deleted B-owned rows of all four kinds.
- **Clean not-found.** `No existe el tp` / `No existe el examen` / `No existe la
  respuesta` / `No existe el link`, with no `P2025` and no TypeError. (The returned string
  is lowercased by `capitalize()` in `createActions.ts`, which is pre-existing.)
- **No other action trusts a client owner id.** An exhaustive scan of all 14 action files,
  the shared schemas and `src/app/api/` found zero remaining cases.
- **No unintended regressions.** `idUser` is gone from all four schemas; the four modals
  send only `{ id }`; every modal UI guard still compares the session against the row
  owner; the `updateTag` tag names are unchanged; and all pre-existing error strings are
  byte-identical to the previous revision except the one new `No existe el link`.
- **Lint and build**: `pnpm lint` exit 0 with the single accepted warning; `pnpm build`
  exit 0, 9/9 static pages.
- The verifier created 18 rows across three users and cleaned up all of them; the local
  database was verified empty afterwards and no scratch file or worktree survived.

### Residual, recorded honestly

- **An existence oracle.** Because the check now runs after the read, a non-owner gets
  `No existe el tp` for a nonexistent id and the permission error for an existing one.
  Two distinguishable messages for any authenticated caller. Low impact: cuids are not
  enumerable from the UI.
- **A parent owner can delete another user's child responses.** Deleting a `Tp` cascades
  to its responses and the action deletes every child `fileKey`, regardless of who owns
  each response. Demonstrated: B deleting B's `Tp` destroyed a response authored by A,
  including its file. This is pre-existing cascade behaviour, not a regression, and it may
  well be the intended product semantics — a contribution belongs to its container. It is
  recorded so the decision is deliberate rather than accidental.
- **A stale `tier` in an issued JWT.** Demoting a moderator does not take effect until
  they sign in again. Inherent to JWT sessions.

## Follow-ups found while auditing, out of scope

- `reactions/upsert.action.ts:22-27` looks a reaction up by `{ idUser, idTarget }` and
  ignores `typeTarget`, so a reaction lookup can match across target types.
- `links/delete.action.ts` having no read at all is also why it had no ownership data to
  check; the fix adds one.

## Review

**No native review was performed.** The switch was on and `review.start` was offered for
this candidate; consent was granted and lineage `review-7a78d5695add96e6` reached the
`reviewing` state, but the user then instructed that the review not continue, on the ground
that the executed verification above already covers this change. Concretely: no lens
artifact was collected, no authority was burned, no correction was opened, and this
candidate carries **no review verdict**. Report this work as verified, never as reviewed.

The gap is worth naming: the executed check proves the authorization behaviour, but it does
not give a second pair of eyes on the shape of the fix, which is what the native review
would have added.
