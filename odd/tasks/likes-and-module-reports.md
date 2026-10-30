# Likes recibidas con puntos y likes/reportes en TPs y exámenes

Branch: `feat/likes-and-module-reports`
Status: in progress
Base: `main` at `834d678`

Tres cambios pedidos en una sola tanda: menos texto en los modales de carga, puntos por
likes recibidas, y likes + reporte con confirmación en las cards de TP y examen.

## Specs

### S1

> en los modales que aparecen al querer agregar un examen o agregar un parcial quiero quitar
> el texto " y solo con los problemas (sin las respuestas)" ya que realmente no importa si lo
> sube con respuestas o no y puede causar confuision.

El texto a quitar es el de la línea "Recuerda!" de los modales de agregar TP y agregar
examen: `Solo se admite formato PDF y solo con los problemas (sin las respuestas).` Queda
`Solo se admite formato PDF.`

### S2

> quiero que si un usuario recibe likes ya sea a alguna respuesta que subio el, o algun
> comentario que recibio el tambien le de puntos (3 puntos), ademas esto debe verse reflejado
> en la lista de pntos del usuario al darle click en el home y tambien en el modal de como
> obtener puntos

Un like recibido vale 3 puntos para el autor del contenido. Tiene que verse en dos
lugares: el desglose que abre el modal de aportes (el nombre del colaborador en el home) y
el modal "¿Cómo obtener puntos?".

### S3

> Quiero que a los tps como a examenes tambien se le puedan dar like ademas de reportar, y si
> un usuario quiere reportarlo le sale un modal preguntandole si esta seguro que quiere
> reportar el tp o examen. La cantidad de likes y reportes deben ser visibles . Podes
> reutilizar el componente que se usa para reaccionar a las respuestas o basarte en el ya que
> sabemos que funciona quiero que el icono de like y reporte aparezcan en donde ahora aparece
> el nombre del usuario que subio el pdf, yu el nombre pase a aparecer abajo a la izquierda
> del pdf.

En la card de un TP o un examen: botón de like y botón de reporte, con el contador de likes
y de reportes visible. El reporte pasa a pedir confirmación en un modal. Los dos iconos
ocupan el lugar donde hoy está el nombre del uploader sobre el PDF, y el nombre se mueve
abajo a la izquierda del PDF.

### S4

Decisión tomada en la sesión: los 3 puntos del like recibido alcanzan **también** a los TPs
y los exámenes, no sólo a respuestas y comentarios. Una sola regla: cada like que recibís
suma 3 puntos.

### S5

Decisión tomada en la sesión: el contador de reportes se muestra **para todos**, no sólo
para `tier: 2`. El auto-ocultamiento a los 3 reportes no cambia.

## Design

### Puntos por likes recibidas

El puntaje vive en un solo módulo, `src/app/lib/shared/score.ts`, compartido por el ranking
del home (`findContributorsWithScore`) y por el desglose del modal de aportes
(`findContributions`). Un concepto nuevo lo hace crecer de 6 filas a 7:

| Concepto | Origen del número | Puntos |
| --- | --- | --- |
| `tps` | `user._count.tps` | 6 |
| `midterms` | `user._count.midterms` | 5 |
| `responses` | `user._count.responses` | 3 |
| `comments` | `user._count.comments` | 1 |
| `links` | `user._count.links` | 1 |
| `reactions` | `user._count.reactions` (reacciones **emitidas**) | 1 |
| `likes` | likes **recibidos** sobre sus respuestas, comentarios, TPs y exámenes | 3 |

Los likes recibidos no salen de un `_count` del usuario: `Reaction` apunta a `idTarget`
por id plano, sin relación con `Response`, `Comment`, `Tp` o `Midterm`. El recuento es
entonces un cruce explícito en `user.repository.ts`:

1. Se leen las reacciones con `reaction: true` y `typeTarget` en los cuatro tipos.
2. Se agrupan los `idTarget` por tipo.
3. Cuatro consultas con `id: { in: [...] }` traen el `idUser` autor de cada destino.
4. Se cuenta por autor. La clave del mapa es `` `${typeTarget}:${idTarget}` `` y no el id
   pelado: los cuids son únicos en la práctica, pero el tipo evita cualquier cruce
   accidental entre tablas.

No hay migración: se reusa la tabla `Reaction`, que ya admite `typeTarget: 'TP' |
'MIDTERM'` y `reaction: true`.

**Caché**: `findContributorsWithScore` y `findContributions` ya declaran
`cacheTag('reactions')`, y `upsertReaction` llama `updateTag('reactions')`, así que un like
invalida el ranking y el desglose. El conteo depende además de los autores
(`'responses'`, `'comments'`, `'tps'`, `'midterms'`, `'users'`), todos declarados.

### Like y reporte en la card del módulo

El botón de like de las respuestas (`buttonReaction.tsx`) está atado a un índice de
respuestas y maneja dos valores (like y dislike), así que no se reutiliza tal cual: se
replica su patrón — guarda `inFlight` con `useRef`, botón deshabilitado mientras corre la
acción, estado optimista y `useEffect` que resincroniza con las props — en un componente
nuevo para módulos.

`upsertReaction` tiene la semántica de toggle por valor: si la reacción existente tiene
el mismo valor, la borra. Por eso el like de módulo manda **siempre `true`**:_like_ para
darlo y para sacarlo, igual que el like de comentarios (`comment.tsx`).

El botón de reporte (`buttonReport.tsx`) se cambia para que:

- abra un modal de confirmación antes de reportar (patrón `confirmationSchema` +
  `CheckboxForm`, como `ModalReportLinkContent` y `ModalDeleteTpContent`);
- muestre el contador de reportes para todos;
- si el usuario ya reportó, el click **deshace** el reporte sin modal (deshacer no necesita
  confirmación).

El botón de reporte sale de la cabecera de la card (hoy está junto al botón de eliminar) y
ambos iconos, con sus contadores, pasan al badge sobre el PDF, en el lugar exacto donde
estaba el nombre. El nombre se mueve al borde inferior izquierdo del PDF.

### Archivos

| Pieza | Archivo |
| --- | --- |
| Texto de los modales de carga | `src/app/components/layout/modals/ModalAddTpContent.tsx`, `ModalAddMidtermContent.tsx` |
| Concepto de puntaje | `src/app/lib/shared/score.ts` |
| Conteo de likes recibidas | `src/app/lib/server/db/repository/user.repository.ts` |
| Score del ranking y del desglose | `src/app/lib/server/usecases/user.usecases.ts` |
| Reglas del modal de puntos | `src/app/components/buttonInfoScore.tsx` |
| Like del módulo | `src/app/components/feature/materias/buttonLike.tsx` (nuevo) |
| Reporte del módulo con confirmación | `src/app/components/feature/materias/buttonReport.tsx` |
| Modal de confirmación del reporte | `src/app/components/layout/modals/ModalReportModuleContent.tsx` (nuevo) |
| Layout de la card | `src/app/components/feature/materias/moduleContainer.tsx` |
| Reglas documentadas | `AGENTS.md` |

### Decisiones

- **Un solo módulo de cálculo.** El ranking y el desglose comparten `score.ts` y ahora
  también el conteo de likes recibidas: no pueden divergir.
- **El contador de reportes visible para todos** (S5) es una decisión explícita del
  usuario, y va en contra de la regla anterior de `AGENTS.md` (contador sólo para
  `tier: 2`). Se actualiza la documentación.
- **El modal de confirmación lo pide el usuario**, pero el patrón es el de la casa:
  `confirmationSchema` con un checkbox, no un `window.confirm`.
- **Like y reporte comparten la fila `Reaction`** de un módulo: un usuario que reportó y
  después da like termina con la fila en `true` (el reporte se cae). Es el mismo
  comportamiento que ya tenían las reacciones de respuestas.

## Verification

Sin framework de tests en el repo (`AGENTS.md` lo prohíbe), la verificación es ejecutada
contra la base local, no leída del diff.

### 13 checks contra la base local

Un arnés con filas reales (`tsx`, `next/cache` y `next-auth` stubbeados en un loader de
Node) creó dos usuarios, un curso, un TP, un parcial, una respuesta, un comentario y un
link, con likes y reportes reales, y después borró todo. Resultado: **13/13 checks
pasaron**.

```
PASS | likes recibidas del autor: 4 (respuesta, comentario, TP, parcial) | obtenido: 4
PASS | el link no suma likes recibidas | obtenido: 4
PASS | el reporte no cuenta como like recibido | obtenido: 4
PASS | likes recibidas del liker: 1 (el like que recibió en su respuesta) | obtenido: 1
PASS | el desglose expone la fila de likes recibidas con 3 puntos | {"key":"likes","label":"Likes recibidas","quantity":4,"unitPoints":3,"points":12}
PASS | el total del desglose es la suma de sus filas | score: 41, suma: 41
PASS | el ranking del home usa el mismo score que el desglose | ranking: 41, desglose: 41
PASS | la card del módulo recibe sus propias reacciones | reacciones del módulo: 1
PASS | el contador de reportes del módulo ve el reporte | reportes: 1
PASS | el like del módulo crea la reacción | error: null, filas: 1
PASS | el segundo like borra la reacción (toggle por valor) | error: null, filas: 0
PASS | el reporte del módulo guarda reaction false | error: null, reacción: false
PASS | no quedan filas de la verificación | usuarios verify: 0
```

Lo que prueba: el cruce de likes recibidos cuenta los cuatro tipos y **excluye** el link y
el reporte; el ranking y el desglose dan el mismo número; el like del módulo alterna
crear/borrar porque `upsertReaction` borra cuando el valor coincide.

### 6 checks en el navegador (servidor real, sesión real)

`next start` en el puerto 3100 contra la base local, con una cookie de sesión firmada con
`next-auth/jwt` y un TP y un parcial de prueba.

- **La card del TP** renderiza `Dar me gusta` (contador `1`) y `Reportar` (contador `0`).
- **La geometría del layout** se midió con `getBoundingClientRect`: el contenedor del PDF
  va de `x=318` a `x=1144`; el botón de like está en `x=1072`, el de reporte en `x=1104`
  (ambos a la derecha, sobre el PDF, que es donde estaba el nombre) y el nombre
  "Por Lucas Iván Cardozo" en `x=326` (abajo a la izquierda). Los tres en la misma línea
  `y=1158`, la del borde inferior del PDF.
- **El modal de reporte** abre con "Reportar TP", el nombre del módulo, el uploader, la
  pregunta "¿Estás seguro que querés reportar este TP?", el checkbox de confirmación y el
  botón "Reportar". Al confirmar, el contador pasó de `0` a `1` y la fila en la base quedó
  con `reaction: false`.
- **El like del módulo** pasó el contador de `1` a `2` y creó la fila `TP / reaction true`.
- **El desglose del home** muestra la fila nueva: "Likes recibidas — 2 × 3 — 6 pts", y el
  total del colaborador coincide con la suma de las filas (18 pts).
- **El modal "¿Cómo obtener puntos?"** muestra la línea nueva: "Cada like que recibas en
  tus respuestas, comentarios, TPs o exámenes suma 3 puntos."

### Build y lint

`pnpm lint` sale con 0 errores (queda el warning preexistente de `globals.css:50`) y
`pnpm build` compila las 10 páginas.

### Hallazgo de la revisión nativa: el like no puede borrar un reporte en silencio

Dar like a un módulo que el usuario ya había reportado **convierte el reporte en like**:
la fila `Reaction` es única por `(idUser, idTarget, typeTarget)`, así que la segunda
escritura actualiza el `reaction: false` a `true` y el reporte desaparece. Es el mismo
comportamiento que ya tenían las reacciones de respuestas, pero ahora es visible porque
el contador de reportes es público. Queda anotado en `AGENTS.md`.

El refuter de la revisión nativa lo marcó como `R4-report-overwrite` (CRITICAL,
`introduced`): el reporte no puede caerse **en silencio**. El usuario revisó el hallazgo y
corrigió el planteo: **el hexágono es un dislike llamado "reporte"**, o sea que reporte y
like son los dos estados de la misma fila y el like **sí** puede reemplazar al reporte.
La corrección acotada (presupuesto de 200 líneas de diff) unifica la lógica de las
reacciones en `useReactions.ts` —la misma máquina de estados que usaba
`buttonReaction.tsx` en las respuestas— y avisa con un toast cuando el like reemplaza al
reporte, para que nunca se caiga en silencio.

### Verificación independiente (subagente `gentle-ai-verify`)

Un verificador independiente (read-only) ejecutó los seis bloques pedidos contra la base
local y un Chromium real: **A–F cumplen, sin bloqueantes**.

- **A (semántica del toggle)**: las seis transiciones medidas con volcado de BD en cada
  paso (like sobre like, like nuevo, reporte sobre reporte sin modal, reporte vía modal,
  like sobre reporte con toast, reporte sobre like): el contador optimista y la fila en la
  base coinciden en todas. El hook revierte el estado ante error.
- **B (coherencia con `buttonReaction.tsx`)**: la aritmética es idéntica; la única
  diferencia es que `buttonReaction.tsx` (intocado por la rama) NO revierte el estado
  optimista ante error. Es preexistente y tolerable.
- **C (conteo de puntos)**: links y reportes excluidos; un like propio rinde 4 pts (3 como
  recibido + 1 como reacción emitida), coherente con la regla publicada pero explotable
  (advisory); ranking == desglose (41 == 41 en BD; 38 == 24+5+9 en la UI real); el total
  es la suma de las filas; un like invalida ranking y desglose por caché.
- **D (flujo de reporte)**: el modal es el único escritor de `reaction: false`; el
  auto-ocultamiento a los 3 reportes quedó **intacto y comprobado empíricamente** (el
  módulo con 3 reportes no aparece para tier 0) — lo que la verificación de abajo daba por
  no verificado.
- **E (layout)**: medido en la misma card (PDF `x=372..1196`, like `x=1131`, reporte
  `x=1168`, nombre `x=372`, todos en `y=2534`): iconos arriba a la derecha sobre el PDF y
  el nombre abajo a la izquierda. El visor conserva `min-h-0`.
- **F (regresiones)**: ninguna; los consumidores de `score.ts`, `findContributions`,
  `findContributorsWithScore`, `upsertReaction`, `makeModules` y `reportedModules` no
  cambiaron de firma.

Hallazgos menores (ninguno bloqueante), con su estado:

| # | Hallazgo | Estado |
| --- | --- | --- |
| 1 | `AGENTS.md` afirmaba que `buttonReaction.tsx` usaba `useReactions.ts` (falso) | **corregido** en este commit |
| 2 | Like y reporte son dos instancias independientes del hook: tras "like sobre reporte" los contadores convergen recién cuando llegan las props (~0,5–1 s) | conocido, menor |
| 3 | El aviso de reemplazo depende del estado cacheado del cliente: con la lista de módulos desactualizada el reporte se reemplaza sin aviso (misma clase que R4) | conocido, menor |
| 4 | El modal manda siempre `false`: con estado stale el servidor borra el reporte y el usuario igual ve "Gracias por tu reporte!" (el toggle-por-valor es preexistente) | conocido, menor |
| 5 | El like propio rinde 4 pts (3+1) | advisory, coherente con la regla publicada |

Los hallazgos 3 y 4 nacen del toggle-por-valor del servidor (compartido con las
respuestas): cambiarlos es un cambio de contrato, no un arreglo local, y no se cambió sin
decisión del usuario.

### Segunda revisión nativa (target final): escalada y corregida

La revisión del target final (`sha256:547c6223…`, lineage `review-f0da02e0f0a1af85`, 4
lentes + refuter) cerró con `state: escalated`:

- `R4-report-toggle-false-success` (**corroborado**): reportar con el estado del cliente
  desactualizado **borraba** el reporte existente (el toggle-por-valor del servidor) y el
  usuario igual veía "Gracias por tu reporte!".
- `R2-split-reaction-state` (causalidad desconocida): el like y el reporte son dos
  instancias independientes del hook, así que tras "like sobre reporte" los contadores
  divergen ~0,5–1 s hasta que llegan las props.

Corrección aplicada (commit `fix(reactions): reportar nunca borra un reporte`):

- `upsertReaction` acepta un `intent`: `toggle` (default, la semántica actual),
  `set` (la fila termina con el valor dado, nunca borra) y `unset` (la fila se borra sólo
  si ya tenía ese valor). El default conserva el comportamiento de las respuestas.
- El modal de reporte escribe con `intent: 'set'` → reportar ya no puede borrar un
  reporte; el botón de reporte deshace con `intent: 'unset'` → deshacer sólo quita un
  reporte y nunca convierte un like en reporte.
- La action devuelve el valor previo **real del servidor** (`previous`), así que el aviso
  del like ("tu like reemplazó el reporte") es exacto aunque la lista de módulos del
  cliente esté desactualizada. Eso cierra también el hallazgo 3 de la verificación.

Verificado con 10 checks contra la base local: reportar sin fila crea el reporte; reportar
de nuevo **no** lo borra; el like sobre un módulo reportado pasa a like con
`previous: false`; deshacer un reporte no toca un like existente; reportar convierte un like
en reporte; deshacer un reporte borra la fila; el toggle clásico (like sobre like) sigue
borrando; `unset` sin fila no crea nada; sin filas residuales.

### Tercera revisión nativa (target final): escalada y corregida

La revisión del target final (`sha256:dd93f3a7…`, lineage `review-fe63d0a811a7fcc0`, 4
lentes + refuter) cerró con `state: correction_required` y un hallazgo corroborado:
`R3-STALE-LIKE` (CRITICAL, `introduced`): con el estado del cliente desactualizado, un like
podía **borrar** el like que ya existía en el servidor, dejando la UI mostrando "like" y el
contador en más.

Corrección aplicada (commit `fix(reactions): a stale like can no longer delete an existing
like`, 18 líneas de diff): el botón de like escribe con `intent: 'set'` (la fila termina
como like, nunca borra uno existente) y el "quitar like" usa `intent: 'unset'` (borra sólo
un like, y un reporte sobrevive). Con esto los dos lados —like y reporte— son a prueba de
estado desactualizado, y la semántica clásica de toggle de las respuestas queda intacta.

Verificado con 11 checks contra la base local: un like sobre un like existente **no** lo
borra; el unlike borra el like; el unlike sobre un reporte no lo toca; el like sobre un
reporte pasa a like con `previous: false` (el aviso sale del estado real del servidor);
reportar sobre un like lo convierte en reporte; reportar sobre un reporte **no** lo borra;
deshacer un reporte borra la fila; el toggle clásico crea y borra como antes; sin filas
residuales.

### Cuarta revisión nativa: el toggle regresionó (corregido)

La ronda 4 (lineage `review-c4c48704db6e7564`) encontró **cuatro** hallazgos CRITICAL
sobre el `toggle` condicional: la rama de borrado se ejecutaba **antes** del `update`, así
que cambiar like↔dislike borraba la fila y el `update` posterior no encontraba nada →
la reacción desaparecía (regresión del comportamiento base de las respuestas). Además,
el conteo de filas afectadas de las escrituras condicionales se ignoraba, así que un
cambio concurrente se reportaba como éxito.

Corrección (commit `fix(reactions): the toggle switches the reaction instead of deleting
it`): el toggle es un `if/else` (mismo valor → borra; valor distinto → cambia) y cada
escritura condicional verifica el conteo de filas afectadas y **falla con error** si no
se aplicó, en vez de reportar un éxito falso. Verificado con 9/9 checks: el toggle
like→dislike y dislike→like **cambian** la fila, like→like y dislike→dislike la borran,
`set` nunca borra, `unset` borra sólo si coincide y no toca una fila cambiada.

### Quinta revisión nativa: la lógica del módulo se unifica con la de las respuestas

La ronda 5 (lineage `review-4025f985c90e0543`, target `sha256:dca71e16…`) cerró con
`correction_required` y dos hallazgos CRITICAL del refuter:

- `R3-STALE-UNSET-NOOP`: el botón de like decidía su intención (`set` vs `unset`) desde el
  estado cacheado del cliente. Con estado viejo la escritura no aplicaba nada pero la UI
  **anunciaba falsamente** "tu like reemplazó el reporte".
- `R4-global-like-scan`: `findLikesReceivedCounts` escaneaba **todos** los likes del mundo y
  armaba cuatro listas `id IN (...)` sin cota, con riesgo de saturar la base.

Correcciones (commits `839009e` y `caec977`):

- **R3 → una sola lógica para todas las reacciones.** `useReactions.ts` (el hook) y
  `reactionButtons.tsx` (el markup) los usan **tanto** las respuestas (`buttonReaction.tsx`)
  como los módulos (`moduleContainer.tsx`): lo único que cambia es el ícono y el title del
  estado dislike. La action vuelve al **toggle por valor** original (el mismo operador de
  las respuestas) y saca el parámetro `intent`: el cliente nunca decide la intención,
  manda el valor del botón y el servidor lee la fila, aplica el cambio y **devuelve lo que
  realmente pasó** (`previous` + la fila actual). El aviso de reemplazo se dispara sólo
  cuando el servidor lo confirma (`previous === false` y la fila actual es un like), así
  que ya no puede anunciarse un reemplazo que no ocurrió. El modal de reporte es el dueño
  de los tres mensajes posibles ("Gracias por tu reporte!", "Tu reporte reemplazó el like
  que hiciste de este archivo.", "Tu reporte fue quitado: el archivo ya no tiene ese
  reporte.").
- **R4 → una sola consulta agregada.** `findLikesReceivedCounts` hace un `GROUP BY` con un
  join por tipo de target: mismo resultado, sin escaneo global y sin listas de ids sin cota.

Consecuencia colateral: el botón de like y el de reporte del módulo comparten **una** instancia
del hook (antes eran dos), así que los contadores ya no divergen.

Verificación de esta ronda:

- **9/9 checks contra la base local**: sin reacción + like ⇒ crea; like + like ⇒ borra;
  reporte + like ⇒ cambia a like (`previous=false`, `current=true`); like + reporte ⇒ cambia
  a reporte (`previous=true`, `current=false`); reporte + reporte ⇒ borra; sin reacción +
  reporte ⇒ crea; el self-like no cuenta como like recibido; la query agregada coincide con
  la referencia calculada fila por fila; el like de otro usuario suma 1.
- **6 checks en navegador** (servidor real, sesión real): el like quita y pone el like; el
  hexágono abre el modal; el modal con la casilla marcada registra el reporte; el like
  sobre un módulo reportado **reemplaza el reporte y avisa**; el reporte sobre un módulo
  con like **reemplaza el like y avisa**; el hexágono sobre un módulo ya reportado **deshace
  el reporte sin volver a pedir confirmación**.

### Sexta revisión nativa: escalada (dos correcciones acotadas)

La ronda 6 (lineage `review-e89a50893edb2c85`, target `sha256:477338fb…`) corrió los cuatro
lentes y el refuter, y cerró en estado **escalated**: el refuter corroboró tres hallazgos
severos y dos quedaron con causalidad inconclusa. La acción del maintainer es informativa.

- `R1-STALE-LIKE-DELETION`, `R2-STALE-REPORT-CONFIRMATION` y `R4-stale-report-confirmation`
  (corroborados): describen el comportamiento del toggle por valor cuando el cliente tiene
  estado viejo. Es **la semántica que el usuario eligió explícitamente** (la misma de las
  respuestas), pero el cliente no siempre le decía qué había pasado de verdad.
- `R3-REACTION-COMMIT-READ` y `R4-nonretryable-postcommit-read` (causalidad inconclusa): la
  action releía la fila **después** de escribir para devolver el resultado, así que una
  lectura fallida convertía un cambio ya confirmado en un error.

Correcciones (commit `fix(reactions): the server reports the row it wrote and every
replacement is announced`):

1. La action **no vuelve a leer la fila**: la escritura ya conoce su resultado, así que
   devuelve el valor que quedó (`null` si la fila ya no está) y una lectura fallida ya no
   puede convertir un cambio confirmado en un error.
2. La card **compara el resultado del servidor con lo que el usuario pidió** y avisa cuando
   difieren: un like que quitó un like que ya estaba, un reporte que reemplazó un like y un
   reporte que volvió a registrarse. Nada se reemplaza en silencio.

Verificado con 9/9 checks contra la base (el toggle por valor: mismo valor borra, valor
distinto cambia; el self-like no suma; la query agregada coincide con la referencia fila por
fila) y con los checks de navegador del flujo completo (like, reporte con confirmación,
reemplazo del reporte por un like con aviso, reemplazo del like por un reporte con aviso y
deshacer el reporte sin confirmación).

### No verificado

- El recorrido de Google OAuth real (la sesión se forjó con una cookie firmada).
- El rollback ante error de escritura: verificado por lectura (el hook revierte el estado
  optimista cuando la acción falla) y ahora **aplica igual a las respuestas** (antes sólo a
  los módulos), pero no se ejercitó en navegador porque no hay forma de forzar un fallo de
  la acción sin parchear código.
- El like sobre un módulo en la vista de **parciales**: la card es el mismo componente
  (`moduleContainer.tsx`), pero la prueba de navegador se hizo sobre la vista de TPs.
- El visor con un PDF real: los TP de prueba no tienen `fileUrl`, así que se vio el
  placeholder. El visor no fue modificado en esta rama (conserva `min-h-0`).

## Tasks

| ID | Spec | Work | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1 | Quitar el texto en los dos modales de carga | inline | `43cf1ea` |
| T2 | S2, S4 | Concepto `likes` en `score.ts`, conteo en el repositorio, score del ranking y del desglose, regla en el modal de puntos | inline | `fd9f094` |
| T3 | S3, S5 | `buttonLike.tsx`, `buttonReport.tsx` con confirmación, `ModalReportModuleContent.tsx`, layout de la card | inline | `fe9d2a7` |
| T4 | S3, S4, S5 | Reglas nuevas en `AGENTS.md` | inline | `fd9f094`, `fe9d2a7` |
| T5 | — | Verificar contra la DB local, lint y build | inline | — |
| T6 | — | Cerrar el documento y entregar | inline | — |
| T7 | S3, S5 | Unificar la lógica de reacciones: `useReactions.ts` + `reactionButtons.tsx` para respuestas y módulos, action sin `intent`, avisos según el estado real del servidor | inline | `839009e` |
| T8 | S2, S4 | Conteo de likes recibidos con una query agregada | inline | `caec977` |

## Review disposition

`gentle-ai review mode status` dice **RDD on** (global). El `assess` del candidato
(`baseRef: origin/main`, `committedOnly: true`) devolvió `risk: medium`, `reviewDue: false`
(`reviewDueReason: under_budget`), pero la revisión nativa se abrió igual sobre el
candidato `sha256:530b5c78…` (lineage `review-cbeaca4c6dc70795`, tier medio, 4 lentes).
Los cuatro reviewers se capturaron y el refuter cerró con `state: correction_required` y
un único hallazgo: `R4-report-overwrite` (CRITICAL, `introduced`), corregido como se
describe arriba.

La corrección se comiteó (`6136b3c`, 196 líneas de diff, dentro del presupuesto de 200) y
el plan de corrección fue aceptado (`correction_lines: 196`). El proveedor autorizó una
recuperación a un lineage sucesor (`scope_changed`) y ese sucesor
(`review-c05faba79d646fad`, árbol `dae23127…`, 13 archivos, 685 líneas) quedó creado
revisando el candidato ya corregido, con el pronóstico de su primera lente emitido.

### Lo que quedó pendiente y por qué

Los runs de reviewer restantes (las otras tres lentes y el refuter del lineage sucesor) no
pudieron iniciarse: el binding de captura tiene que coincidir **byte a byte** con el que
emite el proveedor, y el harness re-tipa los valores de string que parecen literales JSON
dentro de un argumento JSON. Con el flag `reviewerRunAcknowledged` presente, el valor
`"order": "0"` (y `"materialize": "true"`) llegan como `0` y `true`, el binding deja de
coincidir y el facade responde `collectBinding is missing or stale for current STATUS`
(sin mutación). Los pronósticos (sin el flag) sí salen, lo que confirma que el problema
está en la serialización del argumento, no en la autoridad.

Se intentó el mismo recorrido sobre el candidato final (con el commit de documentación
incluido), que abrió un tercer lineage (`review-8efe551d3db5f10a`, mismo tree `86ca5f38…`,
mismas 4 lentes): el mismo bloqueo, con las mismas dos formas de Binding re-tipado
comprobadas (objeto y string), y el mismo resultado inocuo. Quedaron abiertos tres
lineages de review: el predecessor en `correction_required`, el sucesor en `reviewing` y
este último en `reviewing`.

El mismo phenomenon bloquea la ruta `recover` del facade: esa operación exige el `input`
como **string** (lo parsea con `JSON.parse`), y el esquema del tool acepta
`anyOf[{type:"string",pattern:"^\s*\{"},{type:"object"}]`, así que Pi lo coerciona a
objeto y el facade responde `Review controller input must be a string`. La recuperación se
evitó por la vía del lineage sucesor ya reservado por el proveedor.

Familia upstream del mismo defecto de coerción: `earendil-works/pi#9931` (argumentos de
tool que llegan como strings JSON y la coerción en `validateToolArguments`). El arreglo
del lado del facade sería no re-tipar los argumentos JSON: aceptar el binding ya
serializado y compararlo como string crudo.

## Estado al compactar (punto de control)

**Hecho y verificado**: los 3 cambios pedidos (S1, S2/S4, S3/S5) + las correcciones de las
rondas 1–5 de la revisión nativa. 18 commits, lint y `tsc` limpios, 13+11+9+9 checks de
base y 12 checks de navegador, `gentle-ai-verify` con A–F conformes sin bloqueantes.

**Ronda 5 (hallazgos del refuter) → CORREGIDA** (ver "Quinta revisión nativa" arriba):
- `R3-STALE-UNSET-NOOP`: el módulo usa **literalmente la misma lógica que las respuestas**
  (mismo hook, mismos botones, misma action con toggle por valor) y los avisos se arman
  con lo que el servidor devuelve.
- `R4-global-like-scan`: el conteo de likes recibidos es **una query agregada** con joins.

**Servidor de demo para pruebas** (base local): `http://localhost:3000` (`pnpm dev`, el
dev server de carta-qr que ocupaba el 3000 fue detenido a pedido del usuario). Datos
sembrados: curso "Demo Tutorías 1793386356778" `cmvvbxl7v00017o28uhbby9fg`, TP
`cmvvbxl8100027o28pz1l2zxp`, examen `cmvvbxl8600037o28qv5oyhaj`, usuario
`demo-lector-1793386356778@test.local`. Rutas: `/materias/practica/cmvvbxl7v00017o28uhbby9fg`
y `/materias/parciales/cmvvbxl7v00017o28uhbby9fg`. PDF de prueba temporal en
`public/__verify.pdf` (untracked → **borrarlo al cerrar**).

**Entrega (decisión del usuario, PENDIENTE)**: la branch `feat/likes-and-module-reports` tiene
18 commits y **NO** está pusheada ni mergeada. Recomendación: **merge `--no-ff` a `main` +
push**, sin PR (el repo no usa PRs: `vercel.json` desactiva los previews salvo `main`).

## Log

### L1

> Buienas! hoy quiero hacer unos pequeños cambios:
>  - en los modales que aparecen al querer agregar un examen o agregar un parcial quiero quitar el texto " y solo con los problemas (sin las respuestas)" ya que realmente no importa si lo sube con respuestas o no y puede causar confuision.
>  - quiero que si un usuario recibe likes ya sea a alguna respuesta que subio el, o algun comentario que recibio el tambien le de puntos (3 puntos), ademas esto debe verse reflejado en la lista de pntos del usuario al darle click en el home y tambien en el modal de como obtener puntos
>  - Quiero que a los tps como a examenes tambien se le puedan dar like ademas de reportar, y si un usuario quiere reportarlo le sale un modal preguntandole si esta seguro que quiere reportar el tp o examen. La cantidad de likes y reportes deben ser visibles . Podes reutilizar el componente que se usa para reaccionar a las respuestas o basarte en el ya que sabemos que funciona quiero que el icono de like y reporte aparezcan en donde ahora aparece el nombre del usuario que subio el pdf, yu el nombre pase a aparecer abajo a la izquierda del pdf.

### L2

> Los 3 puntos por like recibido, ¿aplican sólo a respuestas y comentarios (como lo pediste
> textualmente) o también a los TPs y exámenes que va a poder dar like?

→ **También TPs y exámenes.**

### L3

> Hoy el contador de reportes sólo se muestra a los moderadores (tier 2). Pediste que
> 'likes y reportes sean visibles': ¿para todos o sólo moderadores?

→ **Visible para todos.**

### L4

> el R3 tenes que usar literal la misma logica que usan las reacciones de las respuestas,
> literalmente lo unico que cambia es que el "reporte" que seria el dislike de las respuestas,
> se ve con otro title y con otro icono, no te parece? el R4 creo que es un buen fix no?

→ **Sí a los dos.** El módulo usa la misma lógica que las respuestas (mismo hook, mismos
botones, misma action con toggle por valor): lo único que cambia es el ícono y el title del
estado dislike. El R4 (una query agregada en vez del escaneo global) se aplica como fue
propuesto.

### L5

> guardaste el progreso en engram para cuando termine de compactar te avise y sepas en que
> quedamos?

→ Sí: Engram (observación de proyecto, `odd/likes-and-module-reports/result`) y este
documento.

### L6

> podes iniciar el server nuevamente en el puerto 300 esta vez? y si esta ocupado matalo

→ Servidor de desarrollo en `http://localhost:3000` con la base local (el dev server de
carta-qr fue detenido). Datos de prueba sembrados para que el usuario pueda probar los
likes y los reportes.
