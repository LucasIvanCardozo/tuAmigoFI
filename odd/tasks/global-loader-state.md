# Global loader state

Branch: `fix/global-loader-state`
Status: done
Commit: `a053f35` — `fix(loader): drive global spinner from React state`

## Problem

The global bottom-right spinner (`#loader`) was shown and hidden by mutating DOM
classes from outside React (`src/app/utils/handleLoader.ts` added/removed the
`displayBlock` class on `#loader`).

Both "hide" triggers were mount-only effects:

- `src/app/components/layout/loader.tsx` — `useEffect(() => handleLoader(false), [])`
- `src/app/components/feature/materias/updateLoader.tsx` — `useEffect(() => handleLoader(false), [])`

With `cacheComponents: true`, a search-param navigation only re-renders the
dynamic hole (`CoursesTable`) inside its `Suspense` boundary. React preserves the
`UpdateLoader` instance (same type, same position), so the mount-only effect never
re-runs and the spinner stays visible after the courses render. The same defect
made the spinner stick after any navigation, because `Loader` lives in the root
layout and never remounts (`/contactame` has no other hide trigger at all).

Reproduced in the running app (port 3001):

| Action | URL | List | `#loader` |
| --- | --- | --- | --- |
| initial | `/materias` | 5 courses | `display: none` |
| type "fisica" | `?search=fisica&page=1` | Física A/B-I/B-II… | `display: block` (stuck) |
| click "Contáctame" | `/contactame` | — | `display: block` (stuck) |

## Decision

Replace the imperative DOM toggle with React state owned by a single provider.

- One global spinner instance stays mounted in the root layout, driven by context
  (`contexts/` is the existing pattern in this repo).
- Link navigations report their pending state with `useLinkStatus()` (Next 16,
  available in 16.3.4) through a null-rendering reporter rendered inside the
  `Link`, so prefetch-aware pending semantics come from the framework.
- The materias search reports its `useTransition` pending state, which is exactly
  the window in which the streamed `CoursesTable` hole is unresolved.

The reporter renders `null`, so the spinner cannot be captured by a transformed
ancestor (`nav.tsx` `<ul>`, `course.tsx` `<li>` both set `transform-gpu`), which a
`position: fixed` child would otherwise be positioned against.

## Files

Created:

- `src/app/contexts/LoaderContext.tsx` — `LoaderProvider` (keyed pending set) and
  `useLoaderPending`
- `src/app/components/layout/linkLoader.tsx` — `LinkLoader`, the `useLinkStatus`
  reporter, renders `null`

Edited:

- `src/app/components/layout/loader.tsx` — pure overlay, no hooks, no `#loader` id
- `src/app/components/layout/providers.tsx` — wraps the tree in `LoaderProvider`
- `src/app/components/layout/nav.tsx` — `<LinkLoader />` inside the logo link and
  the mapped nav items; `handleLoader` calls removed
- `src/app/components/feature/materias/buttonUrl.tsx` — `<LinkLoader />`
- `src/app/components/feature/materias/searchCourses.tsx` — `useTransition`
- `src/app/components/feature/materias/coursesTable.tsx` — `<UpdateLoader />` removed
- `src/app/layout.tsx` — global `<Suspense><Loader /></Suspense>` removed
- `src/app/globals.css` — `.displayBlock` removed

Deleted:

- `src/app/components/feature/materias/updateLoader.tsx`
- `src/app/utils/handleLoader.ts`

Contexts are imported by direct path (`@/app/contexts/LoaderContext`), matching
`ModalContext`; `src/app/contexts/index.ts` was deliberately not touched.

## Tasks

- [x] T1 Add `LoaderContext` with `LoaderProvider` and `useLoaderPending`.
- [x] T2 Turn `Loader` into a pure fixed-position overlay rendered by
  `LoaderProvider`; wrap `Providers` children; drop the global `<Loader />` from
  the root layout.
- [x] T3 Add `LinkLoader` and render it inside every navigating `Link` in `nav.tsx`
  and `buttonUrl.tsx`; remove the `handleLoader(true)` toggles.
- [x] T4 Drive the materias search spinner from `useTransition` in `SearchCourses`
  and remove its `handleLoader(true)` call.
- [x] T5 Delete `updateLoader.tsx`, its use in `coursesTable.tsx`,
  `utils/handleLoader.ts`, and the dead `.displayBlock` class in `globals.css`.
- [x] T6 Verify with `pnpm lint`, `pnpm exec tsc --noEmit` and browser checks.
- [x] T7 Commit the work unit (`a053f35`).

## Evidence

Baseline `pnpm lint`: 0 errors, 1 pre-existing warning (`globals.css:50`).

| Check | Result |
| --- | --- |
| Static correctness of every claim | PASS |
| Hook-safety reasoning | PASS, one accepted sharp edge (below) |
| `pnpm lint` | PASS — exit 0, 0 errors, 1 pre-existing warning |
| `pnpm exec tsc --noEmit` | PASS — exit 0, empty output |
| Runtime search spinner | PASS — 5 open/close cycles across 2 terms, a nonsense term and a clear |
| Runtime navigation spinner | PASS — Contáctame / Inicio / Materias, plus an unmount-while-pending stress |
| Console and dev-server log | PASS — 0 errors, 0 React warnings, every request 200 |
| Mobile 390x844 through the `transform-gpu` drawer | PASS |

Search spinner: overlay observed present in 4 independent windows (157 ms, 386 ms,
433 ms, 437 ms), absent and staying absent after the searched list rendered
(8x300 ms plus 20x150 ms tail samples), `#loader` absent in every one of thousands
of poll samples. `MutationObserver` on `attributeFilter: ['class','style']` for the
overlay recorded zero attribute mutations, proving the class toggle is gone.

Mobile: while the overlay was mounted its DOM parent was `body#root` (no
`transform-gpu` ancestor) and its rect sat at the viewport's bottom-right margin
(`390-24-16=350`, `844-29-16=799`), directly confirming the containing-block
design claim.

Unmount-while-pending: search pending, then navigate away; the unmounted reporter's
cleanup removed its key (`OPEN 27857 → CLOSE 28066`) with no leaked pending entry.

Cost observation (accepted, not a defect): the spinner now follows
`useLinkStatus().pending` instead of the click, so on warm or prefetched routes it
can be a ~130 ms flicker where the old click-driven version showed it until the
hide trigger fired.

### Accepted sharp edge

`useLoaderPending` (`LoaderContext.tsx:41-49`) runs `useContext` → `if (!context) throw`
→ `useId` → `useEffect`, so a null context would commit one hook instead of three.
This is unreachable: a single `LoaderProvider` sits above every reporter at the root,
and the branch throws before any render commits. Biome's
`correctness/useHookAtTopLevel` does not implement eslint's full early-exit analysis,
so passing lint is not evidence for hook order. If the hook ever becomes reachable
outside a provider, move the `throw` inside the `useEffect` body to keep hook order
unconditional.

## Out of scope follow-ups

None of these is a regression — each was already silent before this change, because
at `HEAD` only `nav.tsx` (logo plus mapped items), `buttonUrl.tsx` and
`searchCourses.tsx` ever called `handleLoader(true)`:

- `src/app/components/feature/materias/correlativeList.tsx:8` navigates to
  `/materias?search=<name>`, the same search-param transition as the reported bug,
  and shows no spinner. It needs the same `useTransition` + `useLoaderPending`
  treatment as `SearchCourses`.
- `src/app/components/feature/materias/indexList.tsx:35` (pagination) calls
  `replace()` with neither `startTransition` nor a spinner.
- `src/app/components/layout/footer.tsx:17` (`/politica-de-privacidad`) has no reporter.
- `src/app/components/feature/materias/indexList.tsx:40-41` has an unreachable
  branch: `total === 0 ? <p>Cargando</p> : total === 0 ? <p>No se encuentran
  datos</p> : ...`. A search with zero results therefore shows "Cargando" forever
  instead of "No se encuentran datos".
- `loader.tsx:5` sets `fixed bottom-0 right-0 m-4` with no `z-index`, so the overlay
  can paint under positioned siblings (`nav.tsx:51` uses `z-30`). The removed
  `#loader` had no `z-index` either, so this is unchanged behaviour.

## Not verified

- `pnpm build` and production runtime (no build was run, to preserve the running
  dev server's `.next`).
- Signed-in state and auth-gated paths; the browser session was logged out.
- External navigations from `ButtonUrl`, which point off-site.
- Fault paths: aborted or cancelled transitions, a 5xx during a `Link` navigation,
  and `useLinkStatus` staying pending after a failed navigation.
- History navigation (`popstate`, back/forward).
- Saturation with many reporters pending at once; only one overlap was exercised.
