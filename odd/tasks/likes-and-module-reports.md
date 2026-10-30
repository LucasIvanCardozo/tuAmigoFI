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

### Hallazgo de la prueba en el navegador

Dar like a un módulo que el usuario ya había reportado **convierte el reporte en like**:
la fila `Reaction` es única por `(idUser, idTarget, typeTarget)`, así que la segunda
escritura actualiza el `reaction: false` a `true` y el reporte desaparece. Es el mismo
comportamiento que ya tenían las reacciones de respuestas, pero ahora es visible porque
el contador de reportes es público. Queda anotado en `AGENTS.md`.

### No verificado

- El recorrido de Google OAuth real (la sesión se forjó con una cookie firmada).
- El auto-ocultamiento a los 3 reportes con el contador ahora público: la regla no cambió
  (`visibleModules` sigue filtrando por `REPORTS_TO_HIDE`), pero no se ejercitó con 3
  reportes reales en el navegador.
- El like sobre un módulo en la vista de **parciales**: la card es el mismo componente
  (`moduleContainer.tsx`), pero la prueba de navegador se hizo sobre la vista de TPs.

## Tasks

| ID | Spec | Work | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1 | Quitar el texto en los dos modales de carga | inline | `43cf1ea` |
| T2 | S2, S4 | Concepto `likes` en `score.ts`, conteo en el repositorio, score del ranking y del desglose, regla en el modal de puntos | inline | `fd9f094` |
| T3 | S3, S5 | `buttonLike.tsx`, `buttonReport.tsx` con confirmación, `ModalReportModuleContent.tsx`, layout de la card | inline | `fe9d2a7` |
| T4 | S3, S4, S5 | Reglas nuevas en `AGENTS.md` | inline | `fd9f094`, `fe9d2a7` |
| T5 | — | Verificar contra la DB local, lint y build | inline | — |
| T6 | — | Cerrar el documento y entregar | inline | — |

## Review disposition

`gentle-ai review mode status` dice **RDD on** (global), pero el `assess` del candidato
(`baseRef: origin/main`, `committedOnly: true`) devuelve `risk: medium`, `reviewDue: false`
(`reviewDueReason: under_budget`) y un plan de `writerSelfVerification: true`,
`independentVerifier: false`. No se abrió ninguna revisión nativa: el plan deja la
verificación en manos del escritor, que es lo que ejecutó la sección de verificación de
este documento.

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
