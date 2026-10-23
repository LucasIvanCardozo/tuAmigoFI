# Report flag for TPs and midterms

Branch: `feat/report-flag-tp`
Status: in progress
Base: `main` at `d60c710`

## Specs

### S1

> el tema de los dislike a los tps puede ser que eso hayamos charlado una vez para volverlo a poner? que vos te confundiste diciendo que no habia nada para eso pero en realidad si habia? dislike o reportes no me acuerdo

The user remembered a reporting capability and was right: the original report flow was
added in `3f1495b` ("se añaden reportes a tps y midterms", 2024-11-26) and deleted as
collateral of the `91f9bb8` restructure (2025-02-04). The live "Reportar" button on
responses (`buttonReaction.tsx:84-86`) is a dislike wired only to `typeTarget: 'RESPONSE'`.

### S2

> lo que quiero agregar, siendo fiel a como estaba, es el boton que visualmente no es de dislike, es el que tenia icono de alerta,reporte o algo asi y sin mostrar contador (si mostrar si el usuario lo reporto o no como el de los likes). esto me serbiria a mi para ver si hay tps que fueron reportados. la idea no es de dislike sino de ojo que esto esta mal subido o algo asi simplemente eso pero reutilizando la logica de los dislike

A report button on the TP and midterm cards: the alert hexagon, **no** a dislike, **no**
a counter for regular users, and the active state shows whether the current user already
reported it, exactly like the like button. It reuses the reaction logic.

### S3

> la opcion 1 y tambien algo que estaba antes era que si el tp tiene 3 o mas reportes directamente no mostrarlo es decir que se filtre de la peticion

Scope is option 1 (TP + midterm, reusing the `Reaction` table), plus the auto-hide rule
that was in the original code: a module with 3 or more reports is not shown at all, and the
filter happens server-side so it never reaches the client.

### S4

Historical fact, recorded because the user's recollection and the code differ: the original
threshold was **5**, not 3 — `filteredTps = tps.filter((tp) => tp._count?.tps_reports < 5)`
and the same for midterms (`src/app/lib/data.ts` at `3f1495b`), and `link._count.links_reports < 5`
for links. The user explicitly chose 3, which is stricter, so 3 is what ships.

## Design

Reuse the `Reaction` table: `reaction: false` with `typeTarget: 'TP' | 'MIDTERM'` means
"reported as wrongly uploaded". No migration, no new table, no new action, no new cache tag.

| Piece | File |
| --- | --- |
| Report button (hexagon, no counter, active state) | `src/app/components/feature/materias/buttonReport.tsx` (new) |
| Mount it on the module card | `src/app/components/feature/materias/moduleContainer.tsx` |
| Per-module reactions (today every card gets the global array) | `src/app/utils/makeModules.ts` |
| Auto-hide rule (threshold + tier exception) | `src/app/utils/reportedModules.ts` (new) |
| Apply the filter per request, outside the shared cache | `src/app/(pages)/materias/practica/[id]/page.tsx`, `src/app/(pages)/materias/parciales/[id]/page.tsx` |
| Upsert must match on `typeTarget` | `src/app/lib/server/actions/reactions/upsert.action.ts` |
| Flags must invalidate the module list | `src/app/lib/server/usecases/{tp,midterm}.usecases.ts` |

### Decisions

- **The filter lives outside the cached usecase.** `findByCourseIdWithAllData` is
  `'use cache: remote'` and shared by every visitor, so a tier-dependent decision inside it
  would leak one user's view to everyone. The pages filter per request instead.
- **Moderators keep seeing reported modules.** `tier === 2` bypasses the auto-hide and sees
  the report count, which is the whole point of the feature for the user. Everyone else
  sees the module disappear at 3 reports.
- **The module list must be tagged `reactions`.** It embeds the reaction arrays but only
  declared `cacheTag('tps', 'responses', 'comments', 'users')`, so `updateTag('reactions')`
  never invalidated it and the counts were stale for `cacheLife('days')`. Adding the tag
  also fixes the pre-existing staleness of like and dislike counts.
- **`typeTarget` must be part of the upsert lookup.** `findFirst({ idUser, idTarget })`
  ignores it, so a lookup can match a reaction of another type. Harmless while only
  `RESPONSE` was written; a real defect once `TP` and `MIDTERM` are written.

### Accepted trade-off

`reaction: false` means "dislike" on a response and "reported" on a TP. Nothing dislikes a
TP today, so the two never collide, but the data cannot distinguish them. If that changes,
a dedicated `Report` table is the right move.

## Verification

Executed against the local PostgreSQL with the real code path, not read back from the diff.

**11 assertions on the module pipeline** (`makeModules` + `visibleModules`, with rows created
and removed by the harness):

- With no reports the module carries zero reactions of its own, and the clean TP receives
  none of the reported TP's reactions (the per-module filter).
- With 2 reports the module counts 2 and the TP stays visible for the public and for the
  moderator.
- With 3 reports the module counts 3, the TP disappears for the public, the clean TP stays,
  and the moderator still sees it.
- The upsert lookup without `typeTarget` finds nothing for a user that never reacted, and
  with `typeTarget` it finds the right row.

**5 assertions over HTTP**, against `next start` and the real page:

- No reports: the TP is rendered.
- 2 reports: the TP is rendered.
- 3 reports without invalidation: the TP is still rendered, because the module list is
  cached and nothing expired it.
- 3 reports plus the invalidation the Server Action performs: **the TP is gone from the
  page** and the clean TP is still there.

That third case is the one that proves the cache wiring: the module list is a
`'use cache: remote'` entry, so it only reflects a new report once `updateTag('reactions')`
expires it. In Next 16.4 `updateTag` reaches the remote handler through
`revalidateTags` without a profile, which calls `handler.updateTags(tags)` on every handler
with no durations, and the handler treats that as immediate expiration.

**Not verified**: the tier-2 exception was checked on the pure function, not through a
signed-in browser session, because sign-in is Google OAuth and no session can be forged
locally. The hexagon's active state, the moderator counter and the toast were not exercised
in a browser either.

## Tasks

| ID | Spec | Work | Route |
| --- | --- | --- | --- |
| T1 | S2 | `buttonReport.tsx` with the hexagon, no counter, active state | inline |
| T2 | S2 | Mount it in `moduleContainer.tsx` | inline |
| T3 | S3 | Per-module reactions in `makeModules.ts` | inline |
| T4 | S3 | `reportedModules.ts` with the threshold and the tier exception | inline |
| T5 | S3 | Apply the filter in both module pages | inline |
| T6 | S1 | `typeTarget` in the upsert lookup | inline |
| T7 | S3 | Tag `reactions` in both module-list usecases | inline |
| T8 | S2 | Document the rule in `AGENTS.md` | inline |
| T9 | — | Verify and deliver | inline |

## Log

### L1

> pero esas 3 variables las peudo borrar o que?

Not related to this feature; kept here because the branch starts from that session's tip.

### L2

> el tema de los dislike a los tps puede ser que eso hayamos charlado una vez para volverlo a poner? que vos te confundiste diciendo que no habia nada para eso pero en realidad si habia? dislike o reportes no me acuerdo

### L3

> lo que quiero agregar, siendo fiel a como estaba, es el boton que visualmente no es de dislike, es el que tenia icono de alerta,reporte o algo asi y sin mostrar contador (si mostrar si el usuario lo reporto o no como el de los likes). esto me serbiria a mi para ver si hay tps que fueron reportados. la idea no es de dislike sino de ojo que esto esta mal subido o algo asi simplemente eso pero reutilizando la logica de los dislike que te parece? proponeme algo simple pero eficiente

### L4

> la opcion 1 y tambien algo que estaba antes era que si el tp tiene 3 o mas reportes directamente no mostrarlo es decir que se filtre de la peticion

Threshold 3, chosen over the historical 5, and the filter happens at request level.
