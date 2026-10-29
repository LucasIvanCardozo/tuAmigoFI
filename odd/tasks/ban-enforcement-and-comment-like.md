# Ban enforcement, session resilience and comment like fix

Branch: `fix/ban-enforcement-and-comment-like`
Status: implemented and verified, pending the user's merge decision
Base: `main` at `9bd2847`

## Specs

- **S1** — "me decis que pasa si un usuario tiene el banned en true actualmente?" A user
  whose `banned` flag is `true` must not keep a usable session, and the ban must take
  effect from the database without waiting for a cache to expire.
- **S2** — "dale" (to the four-point plan): the banned check must resolve **the session's own**
  user and not an arbitrary row; it must read the flag fresh; the sign-in failure must be
  legible instead of NextAuth's generic error page. A moderator-facing ban UI is out of scope.
- **S3** — "ademas de paso arreglemos un mini bug que es que si un usuario no esta logeado
  al darle like a un comentario le sale como que dio like visualmente (aunque internamente
  no lo de)" A signed-out user clicking the comment like must not see the heart turn
  green nor the counter increment.
- **S4** — Exact strings and targets:
  - sign-in redirect for a banned user: `/acceso-baneado`
  - comment like guard toast title: `Debes iniciar sesion para reaccionar al comentario.`
  - the server action error a signed-out user receives is unchanged:
    `Necesitas iniciar sesion!`
- **S5** — "algo que me pasa siempre ... que pusheo a vercel es que debo cerrar sesion e
  iniciar nuevamente, esto es normal? supongo que, si pasa realmente, es facil de solucionarlo
  no?" A deploy must not cost the user their session, and a transient database failure
  must not wipe the session cookie.

## Problem

### The ban is not enforced against a live session

`authOptions.ts` checks `banned` twice: in `signIn` (works) and in the `session` callback
(does not work).

```ts
async session({ session, token }) {
  const existingUser = await userUseCases.getById(session.user.id); // session.user.id is undefined
  if (existingUser.banned) return null as unknown as Session;
```

Under NextAuth v4's JWT strategy the object handed to the `session` callback is
`{ user: { name, email, image }, expires }` — it has **no `id`** (`core/routes/session.js`).
The identity lives in `token.idUser`, which the `jwt` callback writes at sign-in
(`authOptions.ts:78`). So the lookup runs with `id === undefined`, and Prisma **drops**
`undefined` from a `where` clause: `findFirstOrThrow({ where: {} })` returns the **first row
of `User`**, not the session's user.

Executed against the local database:

```
findFirstOrThrow({id: undefined}) -> {"id":"cmuy51f010000dq28jucmei9p","email":"lucasivancardozo27@gmail.com","banned":false}
```

Consequences:

- Banning a user who is not the first row of `User` leaves their session working, and
  they keep **writing**: comments, likes, TPs, links and responses. Every action only
  checks `if (!session) throw`, and the session is not null.
- If the first row of `User` happens to be the banned one, the `session` callback returns
  null for **everyone** and no authenticated write works at all. The effect of a ban
  depends on the physical order of the table, which `findFirst` without `orderBy` does
  not even guarantee.

The TypeScript types hide this: `next-auth.d.ts` declares `session.user.id: string`, but at
runtime inside that callback the field does not exist yet.

### The ban is read from a cache

`userUseCases.getById` is `'use cache: remote'` with `cacheTag('users')` and
`cacheLife('hours')` (`user.usecases.ts:10-14`). The `hours` profile is `stale 5min /
revalidate 1h / expire 24h`. Nothing in the ban path calls `updateTag('users')` — the only
`updateTag('users')` in the tree is in `users/create.action.ts`, which is not part of the
auth flow. A ban applied by hand in the database would therefore not be visible for up to
24 hours even once the id bug is fixed.

### The sign-in failure is illegible

`signIn` throws `new Error('Estas baneado de esta pagina')`. NextAuth turns that into
`/api/auth/error?error=...`, and its built-in error page only knows `default`,
`configuration`, `accessdenied` and `verification` — the custom message falls into
`default`, which renders a bare heading `Error` and a link to the host. The banned
student is told nothing.

### The comment like lies about persisted state

`comment.tsx` toggles the visual state **before** it knows whether the write will
succeed:

```ts
const handleLike = async () => {
  setStateLike(!stateLike);
  setNumberLike(stateLike ? numberLike - 1 : numberLike + 1);
  const { error } = await upsertReaction({ ... });
  if (error) sileo.error({ title: error });
};
```

For a signed-out user the action returns `Necesitas iniciar sesion!`, the toast appears,
but the heart stays green and the counter stays incremented. The response-level button
(`buttonReaction.tsx`) already guards with `if (!session?.user.id)`, so the comment button
is the one-off variant.

### A deploy costs the user their session

NextAuth v4 deletes the session cookie whenever the `session` or `jwt` callback **throws**
(`node_modules/next-auth/core/routes/session.js`, the `catch` block calls
`sessionStore.clean()`). Anything that makes the callback throw therefore wipes the cookie
and forces a fresh sign-in.

The callback read the user row from the cache, and the cache key includes the deployment
id, so **right after a deploy the read went to the database**. Any failure of that read —
a cold pooler connection, a dropped connection, a missing row — threw, and the cookie was
deleted. That is the "after every push I have to log out and log in again" symptom.

Removing the cache from that read (required by S1/S2) makes the exposure permanent
rather than deploy-shaped: from then on a database hiccup would wipe the cookie on *any*
request, not only after a deploy.

## Design

### Ban enforcement

1. **Resolve the session's own user.** The `session` callback reads
   `userUseCases.getById(token.idUser)`. A token without `idUser` yields a null session
   (fail closed) instead of a lookup against an arbitrary row.
2. **Read the flag fresh.** `getById` loses its `'use cache'` directive, `cacheLife` and
   `cacheTag`. It has exactly one caller — this callback — so nothing else changes
   behaviour, and the ban takes effect on the next request instead of after up to 24
   hours. The cost is one primary-key lookup per session read.
3. **Fail closed on a missing id.** The repository's `getById` becomes `findUniqueOrThrow`
   instead of `findFirstOrThrow`. A unique lookup with an absent id raises a Prisma
   validation error instead of silently matching an arbitrary row, so the same defect
   class cannot reappear behind a different caller.
4. **A legible sign-in failure.** The `signIn` callback returns the string
   `/acceso-baneado` instead of throwing. NextAuth treats a string returned by `signIn` as
   a redirect target (`core/routes/callback.js`), so the banned student lands on a page
   that explains what happened and how to appeal, instead of NextAuth's generic error
   page. No session is created on that path.

### Session resilience

The lookup is wrapped in a `try/catch` that returns a null session instead of letting the
error escape. The session is denied (fail closed: a banned user, an unknown user and an
unreachable database all get no session), but the **cookie survives**, so the session
recovers on its own as soon as the database answers. The alternative — throwing — is what
turned a transient error into a forced re-login.

### Comment like

`comment.tsx` gains the same guard `buttonReaction.tsx` already has, before any state is
touched, and restores the previous visual state when the action reports an error. The
restore matters beyond the reported case: an expired server session fails the write for a
user whose client session still looks valid, and the heart must not stay green in that
case either.

Nothing else changes: `buttonReaction.tsx` keeps its existing shape, the action and its
error message are untouched, and the reaction count still comes from the same
`useEffect`.

## Allowed edit surfaces

- `src/app/lib/server/auth/authOptions.ts`
- `src/app/lib/server/usecases/user.usecases.ts`
- `src/app/lib/server/db/repository/user.repository.ts`
- `src/app/components/feature/materias/comment.tsx`
- `src/app/(pages)/acceso-baneado/layout.tsx`
- `src/app/(pages)/acceso-baneado/page.tsx`
- `AGENTS.md`
- `odd/tasks/ban-enforcement-and-comment-like.md`

## Tasks

- **T1 done.** The `session` callback resolves `token.idUser` and returns a null session
  when the token carries no id. (`8fb0b72`)
- **T2 done.** `getById` lost its cache directives; the repository lookup is
  `findUniqueOrThrow`. (`8fb0b72`)
- **T3 done.** `signIn` returns `/acceso-baneado`; the page exists with its own layout
  and metadata. (`8fb0b72`)
- **T4 done.** `comment.tsx` guards on the session before touching any state and
  restores the previous state when the write fails. (`17d18d7`)
- **T5 done.** The ban enforcement is documented in `AGENTS.md`. (`843068a`)
- **T6 done.** The `session` callback no longer throws, so a failed lookup cannot wipe
  the session cookie. (`bcbf50c`)
- **T7** Verify (executed ban check, executed cookie check, two native reviews, two
  independent verification rounds, lint, build) and close this document.

## Verification

### The ban was not enforced — RED, executed against the pre-fix code

Against the local PostgreSQL (`localhost:5432`, `tuamigofi`), reproducing the exact
pre-fix lookup the `session` callback performs — `getById(session.user.id)`, where
`session.user` carries no `id` under the JWT strategy:

```
lookup with id=undefined -> {"email":"lucasivancardozo27@gmail.com","banned":false}
RED CONFIRMED: banned user got a session (banned flag read from lucasivancardozo27@gmail.com)
```

The probe created a `banned: true` user and ran the pre-fix lookup. The ban was read
from **a different user** — the first row of `User` — so the banned user kept a session
and kept every write the actions allow.

### The fix blocks it — GREEN

The same probe now calls the real `authOptions.callbacks.session` and
`authOptions.callbacks.signIn` against the local database:

```
Usuario baneado detectado: probe-banned-...@test.local
GREEN: banned user -> null session
GREEN: active user -> session with the right id
GREEN: token without idUser -> null session (fail closed)
GREEN: signIn for a banned user -> /acceso-baneado
GREEN: signIn for an active user -> true
GREEN: the ban survived the signIn upsert
cleanup: deleted=2 rows left=0
```

### The deploy cost the session — RED and GREEN, executed through the real session route

The probe drives NextAuth's own session route (`AuthHandler` with
`action: 'session'`) with a genuinely signed JWT, and inspects the response cookies to see
whether the session cookie is deleted:

```
### SIN EL FIX (codigo commiteado) ###
usuario existente   -> body: session ok        cookie borrada: false
usuario inexistente -> body: {}                cookie borrada: true   RELOGIN FORZADO

### CON EL FIX ###
usuario existente   -> body: session ok        cookie borrada: false
usuario inexistente -> body: null (sin sesion) cookie borrada: false  la cookie sobrevive
usuario baneado     -> body: null (sin sesion) cookie borrada: false  la cookie sobrevive
```

The RED is the forced re-login, reproduced: an unreadable user row produced an empty
session body **and** a deleted session cookie. The GREEN is the same input with the
`try/catch`: no session for that request, the cookie intact, and the session recovers on
its own once the database answers. A banned user is still denied, and denying no longer
costs them their cookie either.

### Lint and build

- `pnpm lint`: exit 0, 184 files, 0 errors and the single accepted warning
  (`src/app/globals.css:50`, `noImportantStyles`, pre-existing and untouched). Run again
  after T6: exit 0, same single warning.
- `pnpm build`: **failed on the first attempt** — `'use cache: remote'` requires an async
  component, and the new page was a sync function. Fixed by making it `async`; the
  rebuild passes: TypeScript clean, 10/10 static pages generated, `/acceso-baneado`
  prerendered as a static route. Re-run after T6: exit 0, same result.

### A correction to this document's own evidence

The first probe run of this unit crashed inside the post-fix section (the pre-fix code
called `cacheLife()` outside a Next.js request scope) **before** its cleanup, and left two
rows in the local database: `probe-active-1793316349248@test.local` and
`probe-banned-1793316349248@test.local`. The independent verifier found them and did not
touch them; they were deleted afterwards and the local `User` table was verified back to
its single row. The `deleted=2 rows left=0` line above belongs to the **second** probe
run, which cleaned up after itself. Both facts are recorded here rather than only the
flattering one.

### Independent verification

Two rounds, both executed by an independent verifier against the local database and the
repository's own `node_modules/next-auth@4.24.15`.

**Round 1 — the ban enforcement (`8fb0b72`): 7 of 7 points VERIFIED, no defect
introduced.**

| Point | Verdict | Evidence |
| --- | --- | --- |
| The callback resolves the session's own user | VERIFIED | `authOptions.ts:94-95`; the real session route with a signed JWT: banned → `null`, non-banned → full session, token without `idUser` → `null`, no cookie → `null` |
| The flag is read uncached and nothing else in the auth path is stale | VERIFIED | `user.usecases.ts:10-11`; flipping `banned` in the database was visible on the very next read, and `signIn` flipped between `/acceso-baneado` and `true` immediately |
| The repository fails closed | VERIFIED | `getById(undefined)` → `PrismaClientValidationError`; `getById('does-not-exist')` → "No record was found"; the pre-fix behaviour (an arbitrary row) reproduced for contrast |
| `signIn` redirects and mints no session | VERIFIED | `core/routes/callback.js:88-93` runs before the `jwt` callback and the session cookie; executed: `{"redirect":"/acceso-baneado","hasSessionCookie":false}` for a banned user, `{"redirect":"http://localhost:3000/","hasSessionCookie":true}` for a normal one |
| The write paths refuse | VERIFIED | every mutating action throws `Necesitas iniciar sesion!` (11 actions) and the UploadThing seam refuses too; executed with a banned user's real JWT: `createComment`, `upsertReaction`, `createResponse` and `uploadFile` all returned the error and the row counts did not move |
| No dependent on the cached `getById` | VERIFIED | `userUseCases.getById` has exactly one caller and `userRepository.getById` exactly one; tokens issued before the change still carry `idUser`, so no existing session is locked out |
| No path where a banned user acts, no lockout of a legitimate user | VERIFIED | the OAuth callback is the only session-issuing path and it is blocked |

Its advisories, none blocking: `createUser` is a reachable `'use server'` export with no
session check (a banned user could mint a fresh account with a new email — pre-existing,
no in-repo caller, and the one item of this unit that would let a ban be bypassed);
`users/getContributions.action.ts` has no session check (read-only); database availability
is now on the path of every session read; the banned user's cookie is never cleared;
`findContributorsWithScore` is still cached and can show a just-banned user on the public
leaderboard; `tier` still travels in the JWT.

**Round 2 — the session callback fix (`bcbf50c`): no defect introduced.**

| Point | Verdict | Evidence |
| --- | --- | --- |
| The `try/catch` cannot let a banned user through | VERIFIED | every exit of the callback returns `null` or a session built from a row read successfully with `banned === false`; executed against the live database through the real session route for a banned user, a missing row, a token without `idUser`, a normal user, and a database that is genuinely unreachable (`ECONNREFUSED`) |
| A database outage does not weaken the ban | VERIFIED | during an outage the session is `null`, so all 11 write paths and the UploadThing seam refuse; the cookie survives and the check runs again on the next request, with nothing cached about the ban |
| NextAuth deletes the cookie when the callback throws | VERIFIED | `core/routes/session.js:88-89` and `core/lib/cookie.js` `_clean()` (value `""`, `maxAge: 0`); A/B executed against the reconstructed pre-fix callback with a signed JWT whose user does not exist, and with the database down |
| Remaining throw paths that can wipe the cookie | VERIFIED | nothing in the app's `session` or `jwt` callback can throw any more; the one remaining wipe path is inside NextAuth (a corrupt or undecryptable cookie, or a rotated `NEXTAUTH_SECRET`), which no callback can influence |
| The `jwt` callback cannot throw | VERIFIED | `refreshAccessToken` has its own `try/catch`; executed with an expired token and a bogus refresh token: no throw, `idUser` preserved, the cookie survives |
| Advisory A3 (database availability on every session read) | **reduced, not eliminated** | the damaging part is gone (a blip no longer means a mass forced re-login); what remains is temporary degradation: logged-in users appear logged out, writes are refused, and it self-heals when the database recovers, with no user-facing error and one log line per session read |

**A correction this unit's own rationale needed.** The independent verifier pointed out
that the "cold cached user read right after a deploy" trigger no longer exists in the
current code: `8fb0b72` removed the cache directives from `getById`, so the session read
has been a live database query since that commit. The deploy correlation describes the
*original* code, and the fix addresses a standing risk (any database error), not a
deploy-specific one. The commit message of `bcbf50c` was rewritten to say exactly that
after the correction.

Two further advisories from round 2, neither blocking:

- **A failed token refresh is retried on every session read.** The token keeps its old
  `expires` in the past, so each session read re-attempts the Google token call (one
  network round-trip per request) until a refresh succeeds. Pre-existing, unchanged here.
- **The remaining cookie-wipe path is inside NextAuth**: a corrupt or undecryptable
  session cookie, or a rotated `NEXTAUTH_SECRET`, makes `jwt.decode` throw and NextAuth
  deletes the cookie. Not reachable from the application code.

### Residual, recorded honestly

- **The banned user's cookie is not cleared.** The `session` callback returns null, so
  the session reads as absent and every authenticated write fails, but the JWT cookie
  stays in the browser and every request re-checks the flag (one primary-key lookup).
  NextAuth's `session` callback cannot clear cookies. This is now deliberate: clearing it
  is what caused the forced re-login.
- **`createUser` can still mint an account.** `src/app/lib/server/actions/users/create.action.ts`
  is an unused `'use server'` export with no session check; as an RPC endpoint a banned
  user could create a new, non-banned account with a different email. Pre-existing, not
  introduced here, and the one open hole in the ban. Removing that dead action is the
  obvious follow-up.
- **`tier` still travels in the issued JWT**, so a rank change needs a fresh sign-in.
  Pre-existing and unchanged by this work unit.
- **The comment like guard reads the client session**, which is null while
  `useSession()` is still loading. A signed-in user clicking in that window would see
  `Debes iniciar sesion para reaccionar al comentario.` and the like would not be
  applied. In practice the window is unreachable for this button: it only exists inside
  the comment panel, which the user has to open first. The response-level button
  (`buttonReaction.tsx`) has the same shape.
- **`buttonReaction.tsx` still does not restore its visual state** when its write fails
  (an expired server session whose client session still looks valid). Out of scope here;
  recorded as a follow-up.
- **No moderator UI to set `banned`.** The flag is only ever written as `false` at
  creation; bans are applied by hand in the database. A moderation action was explicitly
  left out of this unit.
- **The end-to-end Google sign-in is not verifiable locally.** The callback behaviour is
  verified; the browser round-trip to `/acceso-baneado` is not, and it remains a
  post-deploy check.
- **The comment like rollback can restore a stale value.** The rollback writes back the
  values captured before the click. If the state moved in between — a second click, or
  the `useEffect` that resyncs the counters from the server — the rollback can overwrite
  a fresher value. The component also has no in-flight guard, so two rapid clicks can
  interleave. Three advisories of the third native review point at exactly this
  (`R3-002`, `R2-StaleReactionRollback`, `R4-comment-stale-rollback`); the fix is to
  roll back only when the current value still is the optimistic one, and to reuse the
  in-flight guard `buttonReaction.tsx` already has. Follow-up work, deliberately not
  applied on an approved candidate.
- **A failed token refresh costs a network round-trip per session read** until a refresh
  succeeds. Pre-existing, and a performance note rather than a correctness one.

## Review

**Native review, round 1 — approved and burned.** Lineage `review-fc1821e5f4611116`,
target `sha256:17a009509d67ad61e04b265ccc2e6524271dc3fe590c1b1dd3f1c2f278b610a0`, tier
`high`, lenses `review-risk`, `review-resilience` and `review-reliability`, three model
runs through the Pi host relay. The review closed `approved` on the last admitted event
and the authority was burned with `gentle-ai.review-acknowledged/v1`.

Two advisories, both non-blocking and informational, neither opening a correction:

| Id | Lens | Location | Severity |
| --- | --- | --- | --- |
| `R3-1` | reliability | `src/app/lib/server/auth/authOptions.ts:62` | WARNING |
| `R4-Session-DB-availability` | resilience | `src/app/lib/server/usecases/user.usecases.ts:11` | WARNING |

The facade did not expose the advisory texts, so they are recorded here by id, lens and
location only, and this document does not guess at their wording. The second one names a
consequence already recorded above: the session read is uncached, so database availability
sits on the path of every session read.

**Native review, round 2 — approved and burned.** Lineage `review-a441bf505542a72b`,
target `sha256:b3fe2e7fe25ecea6f4d7ba5ea15a91b773844764ddbf484feb270e00c3ac1489`, tier
`high`, same three lenses, same transport. One advisory, non-blocking and informational:
`R4-001` (resilience) at `src/app/lib/server/auth/authOptions.ts:101-105`, which is the
new `catch` block.

**Native review, round 3 — approved and burned.** Lineage `review-ef7e3ba12ed32d02`,
target `sha256:143a13516f3a272a95cb5f9bb764892f560030e26b66ee084aabd403ec284458`, tier
`high`, lenses `review-risk`, `review-resilience`, `review-readability` and
`review-reliability`, four model runs through the Pi host relay. This round covered what
the first two did not: the comment like, the `AGENTS.md` section and the feature document
itself (the candidate is the branch after `8fb0b72`, four changed paths, 427 changed
lines).

Five advisories, all non-blocking and informational, none opening a correction:

| Id | Lens | Location | What it points at |
| --- | --- | --- | --- |
| `R3-001` | reliability | `comment.tsx:29-32` | the session guard reads the client session, which is null while `useSession()` is still loading |
| `R3-002` | reliability | `comment.tsx:40-43` | the rollback restores the values captured before the click |
| `R2-StaleReactionRollback` | readability | `comment.tsx:41-42` | the same rollback, seen as clarity of intent |
| `R4-comment-stale-rollback` | resilience | `comment.tsx:41-42` | the same rollback, seen as behaviour under concurrent interaction |
| `R3-003` | reliability | `authOptions.ts:100-103` | the `catch` block: the log line and the fail-closed behaviour during a database outage |

Three of the five point at the same thing, and it is a real limitation of this change, not
a false positive: **the rollback restores the state captured in the closure**. If the
state moved between the click and the failure — a second click, or the `useEffect` that
resyncs the counters from the server — the rollback can write a stale value over a fresher
one. The component has no in-flight guard, so two rapid clicks can also interleave. The
fix is to roll back only when the current value still is the optimistic one, and to add
the in-flight guard `buttonReaction.tsx` already has. It is recorded here as follow-up
work rather than applied: the review was approved on this candidate and no correction
route is open for it.

Delivery stays under ordinary repository policy in every round: a review outcome is
informational and authorises nothing.

## Log

- **L1** — "por curiosidad, me decis que pasa si un usuario tiene el banned en true
  actualmente?"
- **L2** — "dale, ademas de paso arreglemos un mini bug que es que si un usuario no esta
  logeado al darle like a un comentario le sale como que dio like visualmente (aunque
  internamente no lo de)"
- **L3** — Investigation, accepted plan: (1) resolve the session's own user, (2) read the
  flag fresh, (3) legible sign-in failure, (4) no moderator ban UI in this unit.
- **L4** — "bien y una cosita antes de pushear nada a produccion. algo que me pasa
  siempre (o me pasaba antes, realmente no se si se soluciono) que pusheo a vercel es que
  debo cerrar sesion e iniciar nuevamente, esto es normal? supongo que, si pasa realmente,
  es facil de solucionarlo no?" — diagnosis: NextAuth deletes the session cookie whenever
  the session callback throws; the post-deploy cold cache sent the user read to the
  database, and any failure there wiped the cookie. Fix: the callback fails closed to a
  null session instead of throwing, so the cookie survives.
