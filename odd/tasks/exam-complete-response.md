# Respuesta completa de un examen (una sola archivo para todos los puntos)

Branch: `feat/exam-complete-response`
Status: in progress
Base: `main` at `451a056`

Subir **un solo archivo** (un PDF con todas las respuestas adentro, o una foto) como
respuesta que cubre **todos** los puntos de un examen, en lugar de subir una respuesta por
punto.

## Specs

### S1

> Quisiera agregar una feature a lo que serian los examenes (no tps) de las materias solo a la
> aprte de respuestas: - quiero que haya una opcion en el modal de suba de respuestas que sea
> para responder todos los puntos de una, es decir, actualmente se responde un problema por
> problema a la vez, quiero que haya una opcion para subir todas las respuestas de una.
> (porque generalmente los examenes se le saca foto a todas las hojas y lo suben asi, no se
> sube respuesta por respuesta).

El alcance es **sólo exámenes (parciales)** y **sólo la parte de respuestas**: los TPs
siguen contestándose de a una.

### S2

> Espera, creo que no entendiste a que me refiero, yo me refiero a que haya un check por
> ejemplo que diga "Todas las respuestas" o algo asi, y por ende se quite el input para
> colocar el numero de respuesta a subir. Pero luego que sea todo lo mismo, solo que la
> respuesta que suba entienda que va a responder a todas las respuestas del tp. Esto sin poner
> numero ni nada. Por ejemplo pueed subir un pdf que tenga dentro laas respuestas a todos los
> problemas, entendes? (y todo esos bugs o cosas faltantes que encontraste si hay que
> resolverlas claramente)

No es "subir N archivos": es **un check** en el modal de subir respuesta. Con el check
activo se **quita el input "Número"** y el archivo que se sube se entiende como respuesta
de **todos** los puntos. Todo lo demás del modal queda igual (tipo, texto, archivo).

El bug que faltaba (las respuestas de un examen no se guardaban) se resuelve en el mismo
trabajo, y en un commit aparte.

### S3

> quiero que utilice literal la misma logica de las respuestas individuales y que se trate
> como una mas de ellas, que aparezca primero pero en vez de decir Ejercicio x que diga
> todas las respeustas y listo, si literal es lo unico que cambia no te parece? decime que
> pensas

La respuesta completa se renderiza con **el mismo componente** (`ModuleResponse`) que las
respuestas individuales: misma navegación entre usuarios, mismos likes, mismos comentarios,
mismo visor de PDF. Lo único que cambia es el **título**: en vez de `Ejercicio N` dice
`Todas las respuestas`. Aparece **primero**, antes de la lista de problemas.

## Design

### El modelo

`Response` es "la respuesta de un usuario a un módulo". El único campo que ata la respuesta
a un punto es `number`. Una respuesta que cubre todos los puntos no pertenece a ningún
punto, así que el modelo gana un flag:

```prisma
model Response {
  ...
  number      Int
  allProblems Boolean @default(false) @map("all_problems")
}
```

Migración aditiva, con el mismo patrón que la de las columnas de UploadThing:

```sql
-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "all_problems" BOOLEAN NOT NULL DEFAULT false;
```

Cero datos tocados y reversible (borrar la columna). La fila de una respuesta completa
guarda `number = 0`: `0` no es un punto válido (el input va de 1 a 100 y la action valida
`min(1)`), así que un error de filtrado se vería como "Ejercicio 0" en vez de pisar un
punto real.

Se descartó la alternativa de hacer `number` nullable: `Response.number` es `number` en
`makeModules`, en `moduleResponse` y en el modal de borrado, y volverlo opcional ensucia
el tipado de todos esos consumidores para ganar una columna menos.

### El flag no es un número: es un modo

La regla de duplicados actual es *una respuesta por (módulo, usuario, punto)*. La respuesta
completa tiene su propia regla: *una respuesta completa por (módulo, usuario)*. Son
distintos usuarios los que pueden subir su propia respuesta completa del mismo examen.

Una respuesta puntual del punto 1 y una respuesta completa **conviven**: son archivos
distintos y la UI las muestra en bloques distintos.

### El modal

`ModalAddResponseContent` gana un `CheckboxForm` (el que ya existe, reusado) que sólo se
muestra en exámenes (`!isTp`, que es como `ModalAddResponseContent` ya distingue TP de
parcial). Con el check activo, el `InputForm` de "Número" no se renderiza: se usa
`useWatch` sobre el valor del check, el mismo patrón que ya usa `ResponseForm` para el
tipo.

El tipo de respuesta (PDF, imagen, texto, código) **no cambia**: la respuesta completa
puede ser un PDF con todas las respuestas adentro, que es el caso de uso pedido.

### El servidor

`createResponse` (la action que ya existe) acepta `allProblems`. El flujo de upload no se
toca: `courseSlug`, `withUploadRollback`, `updateTag('responses')` y el borrado de archivos
siguen siendo los mismos. Sólo cambia:

- el `number` que se guarda (`0` para una respuesta completa, el que venga del cliente para
  una puntual — el cliente no puede inyectar un número de punto en una respuesta completa);
- el chequeo de duplicados (por flag en vez de por número);
- el mensaje de error del duplicado.

No hay action nueva, no hay endpoint nuevo, no cambia ningún repositorio de archivos.

### La lectura

`makeModules` separa las respuestas completas **antes** de agrupar por `number`, así que no
genera un grupo "Ejercicio 0" ni problemas fantasma. `DataModule` gana `fullResponses`.

`moduleContainer` las renderiza **primero** dentro del mismo `<ul>` (para que el `<li>` de
`ModuleResponse` siga siendo válido) y les pasa `label="Todas las respuestas"`.

`ModuleResponse` gana un prop `label` opcional: si no viene, el título sigue siendo
`Ejercicio ${problem.number}`. Es la **única** diferencia con una respuesta individual.

El modal de borrado deja de mostrar "Número del problema: 0" para una respuesta completa.

### Archivos

| Pieza | Archivo |
| --- | --- |
| Flag del modelo + migración | `src/app/lib/server/db/prisma/schema.prisma`, `src/app/lib/server/db/prisma/migrations/…_add_response_all_problems/migration.sql` |
| Schema compartido | `src/app/lib/shared/schemas/response.schema.ts` |
| Escritura | `src/app/lib/server/actions/responses/create.action.ts` |
| Check del modal | `src/app/components/layout/modals/ModalAddResponseContent.tsx` |
| Lectura | `src/app/utils/makeModules.ts`, `src/app/types/modules.ts` |
| Render | `src/app/components/feature/materias/moduleContainer.tsx`, `moduleResponse.tsx` |
| Borrado | `src/app/components/layout/modals/ModalDeleteResponseContent.tsx` |
| Reglas documentadas | `AGENTS.md` |

### Decisiones

- **El bug de `idMidterm` va en su propio commit.** Es un fix de una línea (dos) que
  arregla un behavior roto desde la era de Cloudinary, y que se puede leer y probar
  separado de la feature.
- **La respuesta completa cuenta 3 puntos en el score**, no 3 por punto: `SCORE_CONCEPTS`
  cuenta respuestas subidas y no se toca.
- **No se toca `makeModules` en su agrupación**: sólo se le sacan las respuestas completas
  antes de agrupar. Los problemas de un parcial siguen siendo los que existen por respuestas
  puntuales.

## Review disposition

`gentle-ai review mode status` dice **RDD on** (global). El `assess` del candidato
(`baseRef: origin/main`, `committedOnly: true`) devolvió `risk: medium`, `reviewDue: false`
(`reviewDueReason: under_budget`) y un plan de `writerSelfVerification` sin verificador
independiente.

### La revisión nativa no pudo arrancar: el candidato no entra en el presupuesto

El primer START, con el rango completo de la rama (16 paths, 674 líneas), murió en el
preflight nativo:

```
code: lens_context_budget_exceeded
"The candidate's complete reviewer evidence exceeds the native context budget, so no review
authority was created; review this change as smaller candidates that each fit under it."
```

El facade pide explícitamente dividir el trabajo. Se revisó entonces **por work unit**,
con el work-unit de la feature como candidato (9 archivos, 320 líneas, base
`facc450`): el START entró bien (`state: reviewing`, tier medio, 3 lentes, presupuesto de
corrección 160) y el STATUS ofrecio el grupo de collect con las tres lentes.

### El collect no se puede emitir desde este host

Los intentos de captura fallaron sin mutar la autoridad, en tres lineages y con cuatro
serializaciones distintas:

| Lineage | Candidato | Intento | Resultado |
| --- | --- | --- | --- |
| `review-903433045706af48` | la feature (9 archivos, 320 líneas) | grupo, bindings como string | `collectBindings must be the complete distinct current reviewer group in exact provider order` |
| `review-903433045706af48` | la feature | un slot, binding como string | `collectBinding is missing or stale for current STATUS` |
| `review-903433045706af48` | la feature | un slot, binding como objeto | `collectBinding is missing or stale for current STATUS` |
| `review-a7340cf2248a151f` | las correcciones (4 archivos, 425 líneas) | grupo, bindings como objeto | `collectBindings must be the complete distinct current reviewer group in exact provider order` |
| `review-a7340cf2248a151f` | las correcciones | un slot, binding como objeto | `collectBinding is missing or stale for current STATUS` |
| `review-a7340cf2248a151f` | las correcciones | un slot, con los **bytes canónicos del provider** (el slot tal cual lo emite el CLI, en snake_case) | `collectBinding is missing or stale for current STATUS` |
| `review-216a37a0514aff9c` | el fix de 2 líneas (`b1ec5dc`) | grupo, bindings como string (formato de la facade) | `collectBindings must be the complete distinct current reviewer group in exact provider order` |
| `review-216a37a0514aff9c` | el fix de 2 líneas | un slot, binding como string | `collectBinding is missing or stale for current STATUS` |

El patrón no depende del tamaño del candidato: **todo lo que necesita selección de lentes
falla en el collect**, y el preflight además rechaza los candidatos grandes por
presupuesto.

**Causa raíz.** No es el re-tipado de argumentos del harness (esa hipótesis queda
descartada: el provider guarda `"order": "0"` y `"materialize": "true"` como strings, y
mi copia los tenía igual). La diferencia real está en el **shape**: el CLI nativo emite el
slot en snake_case (`capture_operation`, `artifact_subject`, `base_tree`,
`submission.argument_tokens`, `submission.value`) y la facade de Pi lo reescribe en
camelCase (`captureOperation`, `artifactSubject`, `baseTree`,
`submission.argumentTokens`, `submission.values` como array). El facade de Go valida el
binding contra su forma canónica, así que la forma que la facade de Pi pide no puede
coincidir, y tampoco coincide la forma canónica que se le pasa directo. El bloqueo está
en el contrato entre las dos capas, no en el candidato ni en la autoridad.

Es el mismo síntoma que ya se documentó en `odd/tasks/likes-and-module-reports.md` para
la feature anterior, con la misma familia upstream (`earendil-works/pi#9931`).

### Lo que sí cierra: el candidato no ejecutable

Un candidato **no ejecutable** (sólo documentación) se cierra nativo de punta a punta,
sin collect: el provider lo clasifica `low`, no pide lentes y aprueba solo. Se cerraron
**tres** revisiones así, una por work-unit de documentación:

```
START → state: approved, risk_tier: low, selected_lenses: [], action: closed
          risk_reasons: non_executable_only
STATUS → next_transition: execute / review.acknowledge-approved
ACK    → status: closed, authority: burned
          burn_evidence: gentle-ai.review-acknowledged/v1
          delivery: ordinary-repository-policy
```

| Lineage | Candidato | Cierra |
| --- | --- | --- |
| `review-2a535fc1ed3ff807` | `fa2447a` (doc) | ✅ aprobado y quemado |
| `review-5db2b74d3aff4694` | `3b128bf` + `fa2447a` + `db2ecdc` (tramo de docs) | ✅ aprobado y quemado |
| `review-d49a60c12740914f` | `177c4a3` (doc) | ✅ aprobado y quemado |
| `review-194342ea6787c88b` | `73210c2` (doc) | ✅ aprobado y quemado |

Con eso, **todos los commits de documentación de la rama están revisados nativamente**.

El código no puede seguir ese camino: el tier siempre es `medium`
(`executable_change`), la selección de lentes es obligatoria y el collect es
imprescindible. Además, el work-unit del schema (`facc450`) ni siquiera arranca: el
preflight lo rechaza por presupuesto de contexto, porque el client de Prisma generado
(`prismaNamespace.ts` y `prismaNamespaceBrowser.ts`) pesa demasiado en la evidencia del
reviewer.

### Cobertura final de la rama

| Work-unit | Revisión nativa | Verificación independiente |
| --- | --- | --- |
| `b1ec5dc` (fix de `idMidterm`) | ❌ collect bloqueado | ✅ |
| `facc450` (schema + migración) | ❌ presupuesto bloqueado | ✅ migración aplicada y verificada |
| `b936883` (la feature) | ❌ collect bloqueado | ✅ (encontró 1 MAJOR) |
| `1b5de51` (reglas en el servidor) | ❌ collect bloqueado | ✅ (encontró 1 MAJOR) |
| `805956c` (regla del número) | ❌ collect bloqueado | ✅ (sin bloqueantes) |
| 4 commits de documentación | ✅ **4 revisados y quemados** | — |

Quedan abiertos los lineages `review-903433045706af48`, `review-a7340cf2248a151f` y
`review-216a37a0514aff9c` (los tres en `reviewing`, con el collect bloqueado), y
`review-7942b2fbcff1dfdc` (el START del schema que murió en el preflight por
presupuesto).

### Verificación independiente en su lugar (`gentle-ai-verify`)

Como la vista externa nativa quedóUnavailable, se corrió un verificador read-only
(`gentle-ai-verify`) sobre el mismo work-unit, con probes propios en una copia aislada.
Encontró dos defectos reales, ambos corregidos en `1b5de51`:

- **MAJOR — la regla "sólo exámenes" no estaba en el servidor.** `createResponse` aceptaba
  `allProblems: true` junto con `idTp`, así que una respuesta completa podía colgar de un
  TP (y `makeModules`/`moduleContainer` la renderizaban igual). La regla vivía sólo en el
  modal, contra la regla del propio repo de validar en la Server Action. **Corregido**:
  `createResponse` rechaza una respuesta completa con `idTp`.
- **MINOR — el input "Número" oculto seguía validándose.** RHF conserva el valor del campo
  desmontado, así que si el usuario lo vaciaba o escribía fuera de rango antes de tildar
  el check, el submit moría con un error invisible y sin toast. **Corregido**: el número
  dejó de exigirse cuando la respuesta es completa, en el schema compartido y en el de la
  action; las puntuales siguen limitadas a 1..100.

Los dos fixes tienen checks propios en el arnés (los dos últimos de los 15) y en el probe
del schema compartido.

### Segunda verificación independiente: el primer fix abrió un agujero

Sobre el commit de las correcciones (`1b5de51`) se corrió una segunda verificación
independiente. Encontró una regresión **introducida por el fix anterior**:

- **MAJOR — el servidor ya no exigía el mínimo del número.** Al sacar `number().min(0)`
  del campo del servidor para que un número obsoleto no bloqueara una respuesta
  completa, quedó sin mínimo: `number: -1` pasaba y se guardaba, y `makeModules`
  armaba un grupo fantasma "Ejercicio -1". Además, los dos schemas quedaban en
  contradicción (el compartido rechazaba el negativo, el de la action lo aceptaba) y el
  mensaje para un número no entero ("El número debe ser mayor o igual a 1" para 1.5) era
  engañoso. **Corregido** en `805956c`: la regla del número vive una sola vez, en
  `getResponseNumberError` (schema compartido), y la usan tanto el form como la action;
  una puntual es de 1 a 100 y una completa acepta cualquier número (que se guarda como
  0).

Los dos schemas ahora comparten el helper, así que no pueden volver a divergir, y el
arnés cubre el hueco: los números -1, 0, 1.5 y 101 se rechazan y no queda ninguna fila
con número negativo.

El verificador no encontró nada en: la separación de `makeModules`, el forzado de
`number = 0`, la regla de duplicados, la convivencia puntual + completa, el aislamiento por
usuario, la invalidación de caché, la ruta de upload, el modal de borrado y el score.

### Tercera verificación independiente: la unificación de la regla del número

Sobre `805956c` (la unificación de la regla del número) se corrió una tercera
verificación independiente. **Sin hallazgos bloqueantes**: las seis preguntas verificadas
dieron "cumple". En concreto, los dos schemas coinciden mensaje a mensaje en los siete
casos de número (ausente, -1, 0, 1.5, 1, 100, 101) y en los dos modos (`allProblems`
true y false), los rechazos no escriben fila, y en la base completa hay 0 respuestas con
número negativo.

Quedaron dos **MINOR** y cuatro **advisory**, todos aceptados:

- **MINOR** — la precedencia de errores: una petición **sin sesión** y con número inválido
  devuelve ahora el error de validación en lugar de "Necesitas iniciar sesion!". Es la
  misma clase de masking que ya existía en el baseline para 0, 101 y 1.5 (ahora también
  para -1): no escribe datos ni filtra información, y en las peticiones válidas el mensaje
  de sesión no cambió.
- **MINOR** — `idTp` + `idMidterm` con número inválido devuelve dos líneas de error; la
  primera, la que ve el usuario, no cambió.
- advisory — el mensaje para 1.5 es "Debe ser un número" aunque 1.5 sea un número (no
  entero): redacción heredada del schema del baseline, conservada a propósito para
  mantener la paridad entre los dos schemas.
- advisory — el segundo `getResponseNumberError` dentro del handler es código muerto (el
  schema ya validó): defensa en profundidad inofensiva.
- advisory — `NaN` y `null` los rechaza el tipo base de zod aunque `allProblems` sea
  true; no son alcanzables desde el form (`InputForm` convierte `''` en `undefined`).
- advisory — `Response.number` no tiene CHECK en la base: la regla vive en la capa de
  app, y `create.action.ts` es la única ruta de creación de la tabla.

### Evidencia de campo del bug corregido

La base local tiene **una fila `Response` huérfana** (`id_tp` NULL, `id_midterm` NULL,
`text = "sdfsf"`, creada hoy): la firma exacta del bug de `idMidterm`. No la creó el arnés
ni los probes (textos y claves foráneas distintos), así que viene de una subida manual
desde la app corriendo sobre `main`, que es donde el fix todavía no está. Es la prueba
de que el bug era real y de que la respuesta se perdía en silencio. La fila no se toca:
borrar datos no está autorizado y de paso es la evidencia.

Quedaron como **advisory** sin corregir, por ser preexistentes o por no cambiar el
contrato: el servidor no acota `number` a 100 (lo acota el cliente), la regla de duplicados
es read-then-write (dos submits simultáneos pueden crear dos completas), el mismo concepto
se llama `allProblems` en la escritura y `fullResponses` en la lectura, y el mensaje de
error de un número inválido cambió de texto (antes "Too small: expected number to be
>=1", ahora "El número debe ser mayor o igual a 1").

## Tasks

| ID | Spec | Work | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S2 | Fix: `createResponse` persiste `idMidterm` | inline | `b1ec5dc` |
| T2 | S1, S2 | Flag `allProblems`: schema, migración, client regenerado | inline | `facc450` |
| T3 | S2 | Schema compartido y action con `allProblems` | inline | `b936883` |
| T4 | S2 | Check "Todas las respuestas" en el modal | inline | `b936883` |
| T5 | S3 | `fullResponses` en `makeModules` + render primero + `label` | delegated (`gentle-ai-worker`) | `b936883` |
| T6 | S2, S3 | Modal de borrado y regla en `AGENTS.md` | delegated (`gentle-ai-worker`) | `b936883` |
| T7 | — | Verificar: migración en la base local, lint, build, checks | inline | — |
| T8 | — | Cerrar el documento y entregar | inline | — |
| T9 | S1, S2 | Correcciones de la verificación independiente: la regla "sólo exámenes" en el servidor y el número condicional | inline | `1b5de51` |
| T10 | S1, S2 | La regla del número unificada en `getResponseNumberError` (cierra el mínimo que el fix anterior había dejado abierto) | inline | `805956c` |

### Corte de slice

La rama quedó en **805 líneas de diff** al cierre de `805956c`, sobre el corte de ~400
líneas por work unit. El trabajo se entregó en commits chicos justamente para que la
revisión sea posible: el fix del bug va separado de la feature, la feature va separada de
sus correcciones, y el doc va aparte. La estrategia de entrega es **un commit por work
unit** (el mismo criterio que usa el skill de chained PRs del repo), así que un PR con
esta rama es revisable por partes: `b1ec5dc` (2 líneas), `facc450` (schema), `b936883`
(la feature), `1b5de51` y `805956c` (las correcciones) y los dos commits de doc.

## Verification

Sin framework de tests en el repo (`AGENTS.md` lo prohíbe explícitamente), la verificación
es ejecutada contra la base local, no leída del diff.

### 20 checks contra la base local

Un arnés con filas reales (`tsx`, `next/cache`, `next-auth` y el cliente de UploadThing
stubbeados en un loader de Node) creó tres usuarios, un curso, un parcial, un TP y sus
respuestas, y después borró todo. Resultado: **20/20 checks pasaron**.

```
PASS | respuesta puntual a un examen se crea
PASS | la respuesta del examen guarda id_midterm (bug corregido)
PASS | dos respuestas del mismo punto del mismo usuario se rechazan | No puedes tener mas de una respueste a un problema!
PASS | la respuesta completa con archivo sube y guarda fileUrl y fileKey
PASS | la respuesta completa se guarda con allProblems y sin número de punto | allProblems=true number=0
PASS | dos respuestas completas del mismo usuario se rechazan | Ya subiste la respuesta completa de este examen!
PASS | otro usuario puede subir su propia respuesta completa del mismo examen
PASS | makeModules separa las respuestas completas | fullResponses=2
PASS | las respuestas puntuales siguen agrupadas por punto | problems=1
PASS | el grupo de un punto no incluye la respuesta completa | responses=1
PASS | ninguna respuesta completa aparece como un problema | problems=1
PASS | la respuesta de un tp sigue guardando id_tp
PASS | una respuesta puntual sin número se rechaza |  🡆 Debe ser un número
PASS | una respuesta completa de un TP se rechaza en el servidor | Las respuestas completas son solo para exámenes
PASS | una respuesta completa con un número obsoleto se acepta y lo ignora | number=0
PASS | una respuesta puntual con número -1 se rechaza |  🡆 El número debe ser mayor o igual a 1
PASS | una respuesta puntual con número 0 se rechaza |  🡆 El número debe ser mayor o igual a 1
PASS | una respuesta puntual con número 1.5 se rechaza |  🡆 Debe ser un número
PASS | una respuesta puntual con número 101 se rechaza |  🡆 Número fuera de rango
PASS | no queda ninguna respuesta con número negativo
```

Lo que prueba: el bug de `idMidterm` está corregido (la respuesta de un examen cuelga del
examen), la respuesta completa se guarda con `allProblems` y `number = 0` **ignorando** el
número que manda el cliente, la regla de duplicados es una por (módulo, usuario) para la
completa y una por (módulo, usuario, punto) para la puntual, otro usuario puede subir su
propia respuesta completa del mismo examen, una respuesta completa de un TP se rechaza en
el servidor, un número obsoleto no bloquea ni invalida una respuesta completa, una puntual
con número fuera de 1..100 (negativo, 0, 1.5, 101) se rechaza, `makeModules` separa las
completas antes de agrupar (y no genera ni un "Ejercicio 0" ni problemas fantasma), y la
respuesta de un TP sigue guardando `id_tp`.

### 11 checks del schema compartido

`addResponseSchema` y el helper `getResponseNumberError` con `safeParse`: **11/11 checks
pasaron**.

```
PASS | el schema compartido rechaza el número -1 | El número debe ser mayor o igual a 1
PASS | el schema compartido rechaza el número 0 | El número debe ser mayor o igual a 1
PASS | el schema compartido rechaza el número 1.5 | Debe ser un número
PASS | el schema compartido rechaza el número 101 | Número fuera de rango
PASS | el schema compartido acepta cualquier número en una completa
PASS | el schema compartido rechaza una puntual sin número | Debe ser un número
PASS | el schema compartido rechaza un número no numérico con el mensaje en español | Debe ser un número
PASS | el helper no exige número para una completa
PASS | el helper rechaza un negativo
PASS | el helper rechaza un no entero
PASS | el helper rechaza un número mayor a 100
```

Los dos schemas (el del form y el de la action) usan **el mismo helper**, así que no
pueden divergir: la regla del número está escrita una sola vez.

### 4 checks de render del modal

El modal real (`ModalAddResponseContent`) renderizado con `renderToString` dentro del
`ModalProvider`: **4/4 checks pasaron**.

```
PASS | en un examen aparece el check "Todas las respuestas"
PASS | en un TP no aparece el check
PASS | el input Número aparece mientras el check está apagado
PASS | el modal de un TP también pide el número
```

### Build y lint

`pnpm lint` sale con 0 errores (queda el warning preexistente de `globals.css:50`),
`pnpm exec tsc --noEmit` sale con 0 errores y `pnpm build` compila las 11 páginas.
`prisma migrate status` dice `Database schema is up to date!`.

### No verificado

- **La interacción del check en el navegador**: no hay `jsdom` ni navegador en este
  entorno, así que el ocultamiento del input "Número" al marcar el check se verificó por
  código (render condicional sobre `useWatch`) y con el render inicial por SSR, no con un
  click real.
- El visor de PDF con un PDF real de varias páginas (los PDFs de prueba del repo no tienen
  `fileUrl`).
- El flujo real con la cámara de un teléfono.
- El upload real a UploadThing: el arnés stubbea el cliente, así que se verificó el
  recorrido del `withUploadRollback` (subida → create → update con `fileUrl`/`fileKey`) y
  no la transferencia de bytes.


## Log

### L1

> Hola! Quisiera agregar una feature a lo que serian los examenes (no tps) de las materias
> solo a la aprte de respuestas: - quiero que haya una opcion en el modal de suba de
> respuestas que sea para responder todos los puntos de una, es decir, actualmente se
> responde un problema por problema a la vez, quiero que haya una opcion para subir todas las
> respuestas de una. (porque generalmente los examenes se le saca foto a todas las hojas y lo
> suben asi, no se sube respuesta por respuesta). analiza todo lo que necesites y que tan
> viable y facil es añadir esta fgeature, siempre pensando en reutilizacion de lo existente
> mientras sea posible. Usa codegraph, te puede ser de utilidad.

### L2

> Espera, creo que no entendiste a que me refiero, yo me refiero a que haya un check por
> ejemplo que diga "Todas las respuestas" o algo asi, y por ende se quite el input para
> colocar el numero de respuesta a subir. Pero luego que sea todo lo mismo, solo que la
> respuesta que suba entienda que va a responder a todas las respuestas del tp. Esto sin poner
> numero ni nada. Por ejemplo pueed subir un pdf que tenga dentro laas respuestas a todos los
> problemas, entendes? (y todo esos bugs o cosas faltantes que encontraste si hay que
> resolverlas claramente)

### L3

> quiero que utilice literal la misma logica de las respuestas individuales y que se trate
> como una mas de ellas, que aparezca primero pero en vez de decir Ejercicio x que diga
> todas las respeustas y listo, si literal es lo unico que cambia no te parece? decime que
> pensas
