# Auth user provisioning

Branch: `fix/auth-user-provisioning`
Status: implemented and verified on the branch, pending the user's merge decision
Commit: `434c54f` — `fix(auth): provision users with an idempotent upsert`
Base: `main` at `42be3b4`

## Problem

After `pnpm db:pr:reset` on production, signing in with Google failed and redirected to
`/api/auth/error` with:

```
invalid `prisma.user.create()` invocation:
unique constraint failed on the constraint: `user_email_key`
```

The reset was not the cause. It only removed the one `User` row that had been masking a
defect that made new-user provisioning impossible.

## Root cause

`authOptions.ts` guards a **non-idempotent write with a cached read**:

1. `src/app/lib/server/auth/authOptions.ts:57` calls `userUseCases.findByEmail`, which
   is declared `'use cache: remote'` with `cacheLife('hours')` and `cacheTag('users')`
   (`src/app/lib/server/usecases/user.usecases.ts:27-32`). A cached read can disagree
   with the database by design.
2. When it returns a stale `null`, `signIn` calls `createUser`
   (`src/app/lib/server/actions/users/create.action.ts:13`), which uses
   `db.user.create` — not `upsert`.
3. `db.user.create` **succeeds and commits**, then `updateTag('users')` runs
   (`create.action.ts:23`) and **throws**. Next 16 documents this explicitly:
   *"`updateTag` can only be called from within Server Actions. It cannot be used in
   Route Handlers, Client Components, or any other context."* `signIn` runs inside the
   NextAuth Route Handler (`src/app/api/auth/[...nextauth]/route.ts:5`), reached from
   `signIn('google')` in `src/app/components/layout/nav.tsx:137` — never a Server
   Action. The cache tag is therefore never invalidated, so the stale `null` survives.
4. `createAction` catches the throw and returns it as `{ error }`
   (`src/app/lib/server/actions/createActions.ts:14-22`), so `signIn` throws and the
   user gets the error page — while the row now exists.
5. Every retry repeats step 1 with the same stale `null`, reaches `db.user.create`, and
   fails with the reported `unique constraint failed on the constraint: user_email_key`.

## Evidence

| Fact | Value |
| --- | --- |
| Reset migrations applied | `2026-10-02 16:25:38` UTC |
| Rows in `User` | 1 |
| That row's `created_at` | `2026-10-02 18:28:53` |

The single row was created **two hours after** the reset: a login attempt did reach
`db.user.create` and committed, and that same attempt still failed. This is what proves
the flow is broken after the write, not before it.

### Why it was invisible until now

Before the reset, `findByEmail` found the existing row, so `existingUser` was truthy,
`createUser` was never called, and `updateTag` was never reached. The defect activates
only when the user does **not** exist — that is, **new-user registration has never
worked**.

### Why the failure is intermittent

`next.config.mjs` does not configure `cacheHandlers`, and Next 16 documents that without
it *"Next.js uses an in-memory LRU cache for both `default` and `remote`"*. So
`'use cache: remote'` is not remote at all here: it is per-instance memory, and the cache
key includes the deployment id. The stale `null` therefore lives in particular warm
instances, and does not survive a deploy.

## Fix

Make provisioning idempotent, and stop letting a cached read decide a write.

- **Repository:** add `upsertByEmail`, keyed on the unique `email`. `update` must carry
  only `name` and `image` so that `tier` and `banned` are never reset by a login.
- **Use case:** add `ensureByEmail` with **no** `'use cache'` directive, no `cacheLife`
  and no `cacheTag`. The auth path needs consistency, not caching; caching it is what
  created this bug.
- **Auth:** `signIn` calls `ensureByEmail` and keeps only the banned check.

Removing the `createUser` action call also removes the invalid `updateTag` from this
path, so nothing in the auth flow depends on invalidation working.

## Allowed edit surfaces

- `src/app/lib/server/db/repository/user.repository.ts`
- `src/app/lib/server/usecases/user.usecases.ts`
- `src/app/lib/server/auth/authOptions.ts`

## Tasks

- **T1 done.** `upsertByEmail` added to the repository, keyed on the unique `email`, with
  `update` limited to `name` and `image` so a login can never reset `tier` or `banned`.
- **T2 done.** `ensureByEmail` added to `userUseCases` with no `'use cache'` directive, no
  `cacheLife` and no `cacheTag`.
- **T3 done.** `signIn` now calls `ensureByEmail` and keeps only the banned check. The
  cached read, the `createUser` call and the invalid `updateTag` are gone from this path.
- **T4 done.** See Verification.
- **T5 done.** `434c54f`.

## Verification

Executed against the local PostgreSQL (`localhost:5432`, database `tuamigofi`, schema
applied). The harness `edit` tool had to be followed by `biome check --write` on only the
touched files, and the diff was confirmed purely semantic before this ran.

```
RED    create() x2   -> code=P2002: Unique constraint failed on the constraint: `User_email_key`
GREEN  alta          -> tier=0 (esperado 0) banned=false (esperado false)
GREEN  segundo login -> idEstable=true name=B image=b tier=3 (esperado 3) banned=true (esperado true)
       filas con ese email: 1 (esperado 1)
```

- **RED reproduces the reported failure.** Two `create()` calls on one email raise `P2002`
  on the unique email constraint — the same error the production redirect carried.
- **GREEN proves idempotency.** A second `upsertByEmail` updates `name` and `image` and
  leaves the row count at one.
- **GREEN proves moderation state survives.** With `tier` and `banned` deliberately set to
  `3` and `true` between the two calls, the second call left both untouched. A login can
  no longer clear a ban or reset a tier.
- `pnpm lint`: 0 errors, 1 warning (the accepted `src/app/globals.css:50`).
- `pnpm build`: passes; TypeScript finished, 9/9 static pages generated.

Not verified, and not verifiable locally: the end-to-end Google sign-in. It needs the
OAuth provider and a deployed environment, so it stays a post-deploy check.

## Operational note

The harness `edit` tool rewrites touched files to double quotes and changes line splits,
which violates this repository's Biome configuration (`quoteStyle: 'single'`,
`expand: 'auto'`). Running `biome check --write` on only the three touched files restored
the original formatting and produced a purely semantic diff. A repository-wide formatter
pass is not the remedy: it would rewrite dozens of unrelated files.

## Open follow-ups

- `src/app/lib/server/actions/users/create.action.ts` becomes unused after this change.
  It is a `'use server'` export, so it stays reachable as a server action endpoint while
  it exists. Removal is a separate decision.
- The `session` callback calls `userUseCases.getById(session.user.id)` — a cached
  `findFirstOrThrow` — before `session.user` is reassigned from `token.idUser` on the
  following lines. It throws when the id is absent instead of degrading, which matters
  after any database wipe. Out of scope here, deliberately.
- Because `'use cache: remote'` is an in-memory LRU without `cacheHandlers`, no cached
  data is shared across instances in production. That affects every use case in this
  repository, not only auth.
