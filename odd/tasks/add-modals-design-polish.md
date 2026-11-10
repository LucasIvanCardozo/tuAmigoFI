# Pulido de diseño de los modales de alta (TP, parcial, respuesta)

Estado: en curso — fase de diseño (gentle-design) iniciada, implementación pendiente de que
el usuario elija una dirección en el canvas.

Este trabajo rediseña los tres modales de alta de tuAmigoFI y cierra ocho defectos reales
detectados en el camino. El diseño se hace con `gentle-design`; el código de producto lo
implementan writers acotados.

## Specs

### S1

> Hola! hoy quiero que nos enfoquemos en pulir el diseño de los modales en donde se agregan
> parciales, tps, y respuestas. Ya que realmente hay cosas que no quedan claras o no estan
> bien explicadas. Realiza un analisis y dame tu recomendacion. claramente el diseño lo
> haremos copn gentle-design.

### S2

Decisión del usuario sobre la radicalidad del rediseño (opción elegida de la pregunta
abierta):

> Evolutivo con jerarquía real

> Mantiene el formulario de una columna, pero agrega cabecera con contexto, secciones
> separadas, bloque de ayuda subordinado y pie con [Cancelar] [Agregar TP]. Es lo que
> recomiendo: baja riesgo y ataca exactamente lo que no se entiende.

### S3

Decisión del usuario sobre el alcance:

> Los 3 de alta + arreglar los 8 bugs

### S4

Modelo estructural aprobado (el brief que se lleva a los artboards):

1. **Cabecera**: título + una línea de contexto ("Subís un TP a *Análisis Matemática I*").
2. **Cuerpo**: "Datos del TP" / "El archivo" — dos secciones con jerarquía real.
3. **Ayuda**: bloque visualmente separado y subordinado (links, aviso de duplicados,
   contacto), no al pie mezclado con los campos.
4. **Pie**: `[Cancelar] [Agregar TP]` — el primario nombra la acción real.

### S5

Reglas de copy aprobadas:

- Cada campo con **una** línea de ayuda que diga el formato, el rango o el contexto
  ("TP N° (1 a 30)", "Número del problema (1 a 100)", "Sólo PDF, hasta 5 MB").
- Formatos y límites **junto al campo**, nunca en el pie.
- El select de parcial nunca dice "El título es obligatorio" → "Elegí el tipo de parcial".
- El check de parcial se formula como confirmación: "Confirmo que este PDF es sólo el
  parcial y no tiene las respuestas". (Corrección en L8: la primera versión decía "sólo el
  examen, sin respuestas", que contradecía la regla de vocabulario de esta misma spec.)
- "Todas las respuestas" → "Subir un archivo con todas las respuestas" + una línea debajo.
- Vocabulario único: **parcial**, **Agregar**, **TP N°**, **Número de problema**.
- "Aceptar" → el verbo real: "Agregar TP" / "Agregar parcial" / "Enviar respuesta".

### S6 — El input de archivo queda blanco sobre blanco

`src/app/globals.css` aplica a todo `input` → `background: var(--white); color: var(--black)`,
y `src/app/components/layout/form/FileForm.tsx:53` y
`src/app/components/layout/form/ResponseForm.tsx:79` pisan el color con `text-white`.
El control nativo de archivo es además el único del form sin el estilo de los demás
(`text-black px-2 py-1 rounded border border-slate-700`).

### S7 — El `<dialog>` no tiene nombre accesible

`src/app/components/UI/Modal.tsx:39` hace `aria-label={title}`, pero
`src/app/contexts/ModalContext.tsx:43` renderiza `<Modal>{content}</Modal>` sin `title`.

### S8 — El foco abre en el botón de cerrar

`src/app/hooks/useDialogA11y.ts:25` enfoca el primer focusable *dentro* del diálogo, y ese
es el `<button>` de cerrar (`src/app/components/UI/Modal.tsx:42`), que va antes que los
campos.

### S9 — Errores del servidor en inglés

Las tres Server Actions validan con zod sin mensajes propios
(`src/app/lib/server/actions/tps/create.action.ts:14-26`,
`src/app/lib/server/actions/midterms/create.action.ts:14-27`,
`src/app/lib/server/actions/responses/create.action.ts:20-68`). Si falla la validación del
servidor, el toast muestra el texto por defecto de Zod en inglés.

### S10 — El servidor acepta más que el cliente

Cliente de TP: `src/app/lib/shared/schemas/tp.schema.ts:13` → "Solo se admite formato PDF".
Servidor de TP: → "Solo PDF, JPEG o PNG". Mismo desfasaje en parciales. Hoy la UI bloquea
lo que el servidor dejaría pasar: un JPEG puede entrar como TP por llamada directa y
romper el visor, que sólo renderiza PDF.

### S11 — Typo en un error visible

`src/app/lib/server/actions/responses/create.action.ts:106` →
"No puedes tener mas de una respueste a un problema!"

### S12 — Textarea con ancho fijo

`src/app/components/layout/form/ResponseForm.tsx:150` usa `cols={50}` (caracteres, no %).

### S13 — Selects más angostos que los inputs

`src/app/components/layout/form/InputForm.tsx:44` usa `w-full`;
`src/app/components/layout/form/SelectForm.tsx:52` y
`src/app/components/layout/form/ResponseForm.tsx:127` no.

### S14 — El texto de error no pasa WCAG AA

`red-600` (`rgb(220,38,38)`) sobre el panel `slate-800` (`rgb(30,41,59)`) da **3.07:1**,
por debajo del 4.5:1 que WCAG AA exige para texto normal. El texto de error es
precisamente el que más necesita leerse, y vive en los tres modales
(`InputForm.tsx`, `SelectForm.tsx`, `CheckboxForm.tsx`, `FileForm.tsx`,
`ResponseForm.tsx` → `text-red-600 text-sm`).

Hallazgo del design system sync (2026-11-06). El texto del cuerpo de la app
(`--white` sobre `--platinum`) queda en ≈1.33:1 en la regla `body` de `globals.css`,
pero las páginas públicas sobrescriben con `text-(--black)` (`src/app/page.tsx:23`,
`src/app/(pages)/materias/page.tsx`): es una regla latente, no un bug activo, y queda
**fuera de alcance**.

### S15 — Código muerto en la zona

`src/app/components/layout/modals/Modal.tsx` (react-modal) y su `Modal.module.css` no los
importa nadie. `src/app/components/layout/modals/ModalAddResponseOpener.tsx` tampoco: el
botón vivo está inline en `src/app/components/feature/materias/moduleContainer.tsx:144`.

## Tasks

| ID | Specs | Route | Work unit | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1 | worker | Design system sync: `design/system.md` + `design/system.html` | (docs, decide at commit time) |
| T2 | S1, S2, S4, S5 | worker | 3 artboards + `design.json` en `design/add-modals/` | `docs(design): ...` (rama `feat/add-modals-design-polish`) |
| T3 | S1 | parent | Abrir el canvas y que el usuario elija una dirección | — |
| T4 | S2, S4, S6, S7, S8, S12, S13, S14 | worker | Shell (`UI/Modal.tsx`) + primitives de formulario | `feat(modals): ...` (rama `feat/add-modals-ui`) |
| T5 | S2, S4, S5, S15 | worker | Los tres modales de alta + los openers | `feat(modals): ...` (rama `feat/add-modals-ui`) |
| T6 | S9, S10, S11, S5 | worker | Server Actions + schemas compartidos | `fix(upload): ...` (rama `feat/add-modals-validacion`) |
| T7 | S1 | parent | Verificación (lint, tsc, build) y cierre | — |

T5 depende de T4 (los primitives son su insumo). T6 es independiente de T4 y T5: se puede
lanzar en paralelo con T4.

## Log

### L1

> Hola! hoy quiero que nos enfoquemos en pulir el diseño de los modales en donde se agregan
> parciales, tps, y respuestas. Ya que realmente hay cosas que no quedan claras o no estan
> bien explicadas. Realiza un analisis y dame tu recomendacion. claramente el diseño lo
> haremos copn gentle-design.

### L2 — Auditoría (read-only, 2026-11-06)

Hallazgos con evidencia, agrupados en cuatro capas:

- **Bugs**: S6 a S13.
- **Copy que no explica**: "Solo se admite formato PDF" y el límite de 5 MB viven en el
  bloque "¡Recuerda!" del pie en vez de junto al campo de archivo; "Número" no dice de qué
  (TP 1–30 vs problema 1–100); "Tipo de respuesta" no explica Texto/Código/Imagen/PDF ni
  que las imágenes se comprimen solas; "Todas las respuestas" no explica qué significa; el
  check de parcial dice "Mi parcial no tiene las respuestas" (afirmación) mientras el
  schema dice "Tenés que confirmar que el parcial no tiene las respuestas"
  (`src/app/lib/shared/schemas/midterm.schema.ts:4`), y su explicación viene después, en un
  párrafo con un `*` que no apunta a nada.
- **Jerarquía**: los tres modales tienen idéntica estructura (`<h2>` → campos → links
  sueltos → "¡Recuerda!" → botón "Aceptar"). Los dos links externos están marcados como
  `<h3 class="text-sm">` → se leen como subtítulos. El modal de TP/parcial nunca muestra
  `course.name` (lo recibe en `ModalAddTpContent.tsx:13` y lo descarta). No hay botón
  "Cancelar". El botón primario (`border-slate-700 border-2` sobre `bg-slate-800`) casi no
  se ve.
- **Inconsistencias**: "Agregar" vs "Añadir"; "Examen" vs "parcial" (la app y las URLs usan
  "parciales"); "Datos del TP" / "Datos del examen" / "Datos de la respuesta"; el link
  "eliminar páginas" está siempre en TP y parcial, pero sólo con "Todas las respuestas" en
  respuestas; el botón de apertura de respuestas dice "Respuesta"
  (`moduleContainer.tsx:148`), un sustantivo para una acción.

El error del select de parcial viene del campo equivocado:
`src/app/lib/shared/schemas/midterm.schema.ts:11` → "El título es obligatorio" para un campo
que se llama "Tipo de parcial".

### L3 — Decisiones del usuario

- Radicalidad: "Evolutivo con jerarquía real" (S2).
- Alcance: "Los 3 de alta + arreglar los 8 bugs" (S3).

### L4 — Estado del design system

`design/` no existe. No hay `design/system.md` ni `design/system.html`, así que el gate de
`gentle-design` obliga al design system sync antes de diseñar.

Fuentes reales (leídas): `src/app/globals.css` (`:root` con `--black-olive: rgb(38, 44, 30)`,
`--dark-cyan: rgb(39, 120, 124)`, `--silver: rgb(169, 172, 169)`,
`--platinum: rgb(212, 215, 222)`, `--midnight-green: rgb(28, 50, 53)`,
`--white: rgb(246, 247, 248)`, `--black: rgb(19, 21, 24)`; `body` usa `--white` sobre
`--platinum`; `input, select, textarea` usan `background: var(--white)` y
`color: var(--black)`; el bloque `prefers-color-scheme: dark` está comentado y no aplica) y
`tailwind.config.ts` (sin colores, radios ni fuentes; sólo spacing `18`/`19`, `height.250`,
`animate.spin-slow`, `transitionProperty.height`).

Los modales usan el palette stock de Tailwind (`slate-800`/`slate-700`), que no viene del
sistema del proyecto. En features hay tres hex sueltos que son el mismo color escrito de
tres formas: `#92C1C9` y `#96cad3` (`src/app/components/feature/materias/moduleContainer.tsx:146`
y `:162`) y `#3D4731` (`src/app/components/feature/materias/asideModules.tsx:70`).
El sync debe documentarlos como candidatos a un token único.

### L6 — Design system sync (T1, 2026-11-06)

Capturado por el writer en `design/system.md` (25.237 bytes) y `design/system.html`
(53.748 bytes). Verificado por el padre: 0 referencias externas en el HTML, sólo
`design/` y este documento sin trackear, 113 citas `path:line` verificadas una por una.

**Corrección a L4**: el documento decía que `#92C1C9`, `#96cad3` y `#3D4731` eran "el
mismo color escrito de tres formas". Es **parcialmente falso**:
- La familia cian son **cuatro** escrituras del mismo hue (≈188.6°–188.9°): `#92C1C9`,
  `#96cad3`, `#9fc8cf` y `#C8E0E4`. La quinta, `#31969B` (hue 182.8°), coincide con
  `--dark-cyan`.
- `#3D4731` (hue 87.3°) **no** es cian: es un oliva de la misma familia que
  `--black-olive` (85.7°), usado como estado "seleccionado" del aside.

**Decisiones del padre sobre las preguntas abiertas del writer**:
1. La familia cian **no** se colapsa en el código: es un refactor app-wide, fuera del
   alcance aprobado (3 modales + 8 bugs). Queda documentada en `system.md`. En los
   artboards se usa `#92C1C9` como acento único.
2. El contraste del texto de error **entra al alcance** (S14), porque vive dentro de
   los tres modales. El contraste del cuerpo de la app se reporta aparte.

### L12 — Dirección elegida: 02 · Ayuda contextual (2026-11-06)

El usuario eligió la dirección **02 — Contextual help** (`design/add-modals/02-ayuda-contextual.html`)
sobre las tres del canvas. Handoff registrado en el canvas: `status: in_progress`, target
`add-modals/02-ayuda-contextual.html`.

**T4 y T5 se reabren** y se implementan contra este artboard, no contra los otros dos.

Lo que el artboard define y hay que llevar al stack real:

| Parte del artboard | A dónde va en el código |
| --- | --- |
| `.modal-head` (h2 + `.context-line`) | Cabecera del panel del modal, en `UI/Modal.tsx` |
| `.notice` (icono + texto, bajo el header) | Aviso "No dupliques el archivo" / "Revisá antes de subir" |
| `.section` + `.section-title` con `.sec-num` | `SectionForm` con número de sección |
| `.field` (label + input + `.helper`) | `InputForm` / `SelectForm` con una línea de ayuda |
| `.check-row` + `.helper` | `CheckboxForm` con línea de ayuda |
| `.file-row` (input oculto + `.file-btn` + `.file-state`) | `FileForm` y el campo de archivo de `ResponseForm` |
| `.tool-row` (Eliminar páginas / Convertir a PDF) | Acciones chicas junto al campo de archivo |
| `.actions` (`.btn-secondary` + `.btn-primary`) | Pie con Cancelar y el verbo real |
| `.error` (icono + texto, `red-400`) | Mensajes de error de los primitives |

Los tokens salen de `design/system.md`: `--midnight-green` para la superficie del aviso,
`--white`/`--black` para los campos, `slate-800`/`slate-700`/`slate-300` para el panel, los
bordes y el botón secundario, `#92C1C9` como acento, y **`red-400` (`#f87171`) para el texto
de error** porque `red-600` da 3.03:1 y falla AA (S14).

### L13 — Hallazgo del verificador independiente y su fix (2026-11-06)

`gentle-ai-verify` sobre `3354258..8c822c1` dio **PASS con 1 MAJOR + 1 MINOR**. El MAJOR es
preexistente pero cae dentro de la regla de S10:

> El schema de la action de respuestas **no tiene** la regla "IMAGE/PDF exige archivo" que sí
> tiene el cliente. Una llamada directa con `type:'IMAGE', file:null` creaba una fila con
> `fileUrl=null`, y `moduleResponse.tsx:96` renderiza `<img src="">`: una card rota para todos
> los que abrieran la materia.

Fix: extraer la regla a un helper compartido (patrón `getResponseFileTypeError` /
`getResponseNumberError` del propio repo) y usarlo en los dos schemas, para que no puedan
divergir. De paso cierra el MINOR (`text:''`).

**No se commitearon tests**: el verificador propuso un script de probes en `scripts/` y se
rechazó, porque `AGENTS.md` dice *"No tests. No test framework configured"* salvo pedido
explícito del usuario. La verificación sigue con harnesses descartables fuera del repo.

Observación: hay **dos `MAX_UPLOAD_SIZE`** con valores distintos (`5_000_000` en
`schemas/upload.schema.ts` y `5*1024*1024` en `shared/constants/upload.ts`). Hoy no colisionan
—ningún módulo importa ambos— pero el mismo nombre significa dos cosas. Anotado, sin tocar.

### L11 — La revisión nativa: se completa, con un orden estricto (2026-11-06)

**Corrección**: la primera versión de esta entrada decía que la revisión nativa "no es
completable en este host". **Era falso**, y también lo era la memoria que lo afirmaba
(observación 1200, corregida a revisión 7). La causa real no era un defecto del host: era
**el orden de las llamadas**.

**Receta que funciona** (verificada de punta a punta el 2026-11-10):

1. `inspect` — con `untrackedScope: "exclude"` si hay archivos sin trackear.
2. `start` con `baseRef` = **sha de commit** (el `inspect` imprime el *árbol* que va a
   diferenciar, y hay que pasarle el commit cuyo árbol es ese) y `committedOnly: true`.
   **Sin `lenses` ni `lensesReason`**: este host rechaza la selección de lentes del agente en
   cualquier tier; el native elige la suya.
3. `status` → `action: "collect"`.
4. `capture` **sin** `reviewerRunAcknowledged` → devuelve el forecast.
5. **`status` de nuevo** → reofrece el slot.
6. `capture` **con** `reviewerRunAcknowledged: true` → corre el reviewer.
7. `acknowledge-approved` → `authority: burned`.

**Evidencia**: lineage `review-cbf7f16f0669f86b`, 8 archivos / 387 líneas de autor,
`state: approved` y después `outcome: native-approved-acknowledgement-completed`,
`authority: burned`, `burn_evidence: gentle-ai.review-acknowledged/v1`,
`delivery: ordinary-repository-policy`. Reviewer `minimax/MiniMax-M3.1-Flash`, 22,7 s,
13.663 tokens, USD 0,0037.

**Dos misleading diagnostics que en realidad son otra cosa**:
- `lenses-invalid` en START: no es un rechazo de la lente, es que este host no acepta
  selección de lentes del agente.
- `collectBinding is missing or stale for current STATUS`: el binding es válido (el mismo
  payload pasó el forecast); lo que falla es reusarlo sin un STATUS fresco en medio.

**El presupuesto de contexto sí es real**: el candidato de la feature entera (5.244 líneas,
~3.000 de HTML de artboards) no entra y el preflight lo corta con
`lens_context_budget_exceeded`, que es terminal. La solución es reducir el alcance: un
worktree con una rama que contiene **sólo el código** (los artefactos de diseño fuera) da un
candidato de ~390 líneas que pasa el preflight.

**Lo que la revisión nativa NO detectó**: el MAJOR que encontró el verificador independiente
(el schema de la action de respuestas sin la regla "IMAGE/PDF exige archivo"). El native
aprobó el candidato. Las dos vistas se complementan.

### L18 — Cierre de la feature (2026-11-10)

**Rama**: `feat/add-modals-ui`, 16 commits sobre `main`. El diseño va en `feat/add-modals-design-polish`, que se mergeó con `--no-ff` dentro de la cadena.

**Lo que quedó implementado**: la dirección **02 · Ayuda contextual** de
`design/add-modals/02-ayuda-contextual.html`, en el stack real. Los tres modales de alta
(Agregar TP, Agregar parcial, Añadir respuesta) tienen cabecera con título y línea de
contexto, aviso, dos secciones numeradas, una línea de ayuda por campo, las dos herramientas
externas junto al archivo, la línea de WhatsApp y un pie con Cancelar y el verbo real. El
shell del modal pinta la cabecera y el `<dialog>` tiene nombre accesible. Los primitives
tienen helper, nombre accesible único, error que pasa AA y ids que nunca cuelgan.

**Verificación**:
- harness de render de los tres modales: 112 aserciones, 0 fallos.
- verificador independiente sobre el shell y los primitives (Chromium real + control del
  commit base): PASS sin bloqueantes; encontró 1 MAJOR latente (el `<h2>` duplicado, ya
  resuelto por T5) y 6 menores, todos corregidos en `4fd83d6` y `9ce4068` y re-verificados.
- `pnpm exec tsc --noEmit`, `pnpm lint` (0 errores, 14 warnings: 13 de `design/` y uno
  preexistente en `globals.css`) y `pnpm build` (rutas prerenderizadas) en verde.
- la extracción de las tres piezas compartidas se probó con cinco escenarios de render
  antes y después: **HTML byte-idéntico**, SHA-256 incluido.

**Revisión nativa**: la unidad de validación (387 líneas) se revisó y se quemó con
`approved` (`review-cbf6a16f0669f86b`). El candidato de código final (1.638 líneas) pasó el
preflight pero su consent fue **declinado por la UI del host**
(`consent-declined-this-candidate`), sin lineage y sin mutación; un decline es por candidato y
no se reintenta. El candidato del worktree completo, que arrastra los ~3.000 de HTML de los
artboards, se cortó con `lens_context_budget_exceeded` — terminal, sin autoridad, y nada que
abandonar. La evidencia de la entrega es, entonces, el verificador independiente.

**Pendientes anotados** (fuera del alcance aprobado, que eran los tres modales de alta):

1. Los modales que no son de alta (link, borrar, reportar) siguen con el nombre accesible
   genérico "Modal" y con su propio `<h2>`. Con un título propio cada uno, el shell les
   daría nombre y habría que borrar su `<h2>`.
2. El vocabulario "Examen" en los modales de borrado y de reporte, y en el botón "Eliminar
   Examen" de la card.
3. El nombre de la materia en la línea de contexto del modal de respuesta: `DataModule` no
   lleva la relación con la materia, así que hay que pasarlo por `problemsTable.tsx` y
   `mainModule.tsx`.
4. El input de archivo sigue con dos `<label for>` en el DOM; sólo uno contribute al nombre
   accesible, que es el criterio de WCAG.

### L17 — Verificación independiente de T4 y los fixes que salieron (2026-11-10)

`gentle-ai-verify` sobre `005b96a..83780e6`: **PASS, sin bloqueantes**. Probó con Chromium
real (Playwright) contra un `next dev`, contra un control del commit base. Lo verificado:

| | antes | después |
| --- | --- | --- |
| Foco inicial del diálogo | botón **Cerrar** | primer campo real |
| Jerarquía de encabezados | `H2 → H4` (salto) | `H2 → H3` |
| Contraste del texto de error | 2,97:1 (falla AA) | 5,09:1 |
| Nombre accesible del `<dialog>` | `""` (vacío) | el que se le pase |

También verificó que todo `aria-describedby` resuelve, el focus trap, el Escape, que el botón
"Elegir archivo" **abre el file chooser de verdad**, y que `ResponseForm` sigue tirando el
archivo al cambiar de tipo (IMAGE→TEXT lo borra). El build le falló por `DATABASE_URL` ausente
en el scratch copiado, **igual que en el control del commit base**: es ambiental, no del cambio.

**El MAJOR que encontró** (latente en ese commit): el `<h2>` del shell duplicaba el `<h2>` que
los propios modales pintaban. No era alcanzable —nadie pasaba título todavía— y **quedó
resuelto por T5**, que borró los `<h2>` de los tres modales.

**Los seis defectos menores que sí quedaron**, y su fix en `4fd83d6`:

1. El input de archivo tenía **dos labels**, así que su nombre accesible salía "Archivo del TP
   (obligatorio) Elegir archivo". Ahora el input lleva `aria-labelledby` apuntando al label
   del propósito: el algoritmo de accname resuelve `aria-labelledby` antes que cualquier
   label del lenguaje natural, así que el nombre es uno solo, mientras el `<label htmlFor>`
   nativo que abre el picker sigue intacto y el anillo de foco sigue cayendo en él.
2. El id de error se derivaba del objeto de error y no del mensaje: con un error sin mensaje,
   el `aria-describedby` apuntaba a un id inexistente. Ahora el id sale del mensaje.
3. El helper se renderizaba dentro de un `<p>` y acepta un `ReactNode`: un helper de bloque
   producía el warning de React. Ahora va en un `<div>`.
4. Las partes de la línea de contexto se keyeaban por su texto: dos partes con el mismo texto
   colisionaban. Ahora se keyean por posición.
5. `formatFileSize` redondeaba mal: 1048575 bytes salía "1024,0 KB", y 4,99 MB salía idéntico
   al límite de 5 MB — justo el límite que impone el schema. Ahora promociona la unidad antes
   de que el redondeo la pase, y clava un tamaño negativo en cero.
6. El módulo compartido se renombró a `modal-parts.tsx` (kebab-case, como pide `AGENTS.md`).

Queda un detalle menor en el DOM: siguen existiendo dos `<label for>` sobre el input de
archivo, pero **sólo uno contribute al nombre accesible**. El criterio de WCAG es el nombre
accesible, que ahora es una sola cadena.

### L16 — T5: los tres modales de alta con la dirección 02 (2026-11-10)

Implementado sobre `design/add-modals/02-ayuda-contextual.html`. Cada modal: la cabecera la
pinta el shell (los tres componentes dejaron de emitir su propio `<h2>`), el aviso
"--midnight-green", dos secciones numeradas, una línea de ayuda bajo cada campo, las dos
herramientas externas como anchors al lado del campo de archivo, la línea de WhatsApp y un pie
con "Cancelar" y el botón primario que nombra la acción real.

**Decisiones de copy que quedan registradas**:

1. **La sección 2 del modal de respuesta cambia de título según el tipo**: "El archivo" para
   IMAGE/PDF (el estado que dibuja el artboard) y "La respuesta" para Texto/Código. Sin ese
   cambio, una sección llamada "El archivo" contenía el área de texto en el estado por defecto
   (`type: 'TEXT'`), que es un rótulo incorrecto.
2. **La línea de contexto de respuesta nombra sólo el módulo**: "Subís una respuesta al
   **Primer parcial**". El nombre de la materia no es alcanzable desde `moduleContainer`
   (`DataModule` no lleva la relación con la materia) y chegarlo exige tocar
   `problemsTable.tsx` y `mainModule.tsx`, fuera de la superficie de la unidad.
3. **El botón "Eliminar Examen" de la card se deja como está**: el vocabulario de S5 pide
   "parcial", pero ese rótulo corresponde a un modal de borrado que dice "Eliminar Examen" y
   "Examen eliminado.". Cambiar sólo el label de la card dejaría una inconsistencia nueva.

**Pendientes anotados para un follow-up** (fuera del alcance aprobado, que era los tres
modales de alta):

- El vocabulary "Examen" en los modales de borrado y de reporte, y en el botón de la card.
- El nombre de la materia en la línea de contexto del modal de respuesta.
- `Notice`, `FileTools` y `ContactLine` quedaron como tres copias byte-idénticas en los tres
  modales, porque extraerlos a un módulo compartido exige un archivo nuevo.

### L15 — Las 12 lineages viejas de la revisión nativa (2026-11-10)

En el store de la revisión nativa quedaban **doce lineages de sesiones anteriores** (del 23/10 al02/11), todas en estado `reviewing`, `correction_required` o `escalated`, ninguna cerrada. Seis de ellas tenían **hallazgos del reviewer nativo admitidos y nunca aplicados**: su `fix_delta_hash` era el hash de la string vacía, o sea que no se había registrado ninguna corrección.

**Registro de los hallazgos (volcado antes de moverlas, para que no se pierda):**

| Lineage | Estado | Líneas | Hallazgos |
| --- | --- | --- | --- |
| `review-4025f985c90e0543` | correction_required | 949 | `R3-STALE-UNSET-NOOP`, `R4-global-like-scan` |
| `review-4c7e9086518d776b` | correction_required | 920 | `R1-SELF-LIKE-SCORE`, `R4-RACING-UNSET` |
| `review-c4c48704db6e7564` | correction_required | 922 | `R1-toggle-deletes-opposite-reaction`, `R3-toggle-opposite-value-deletes`, `R4-set-noop-reported-success`, `R4-toggle-opposite-value-deleted` |
| `review-e89a50893edb2c85` | escalated | 1155 | `R1-STALE-LIKE-DELETION`, `R2-STALE-REPORT-CONFIRMATION`, `R4-stale-report-confirmation` |
| `review-f0da02e0f0a1af85` | escalated | 763 | `R4-report-toggle-false-success` |
| `review-fe63d0a811a7fcc0` | correction_required | 897 | `R3-STALE-LIKE` |
| `review-216a37a0514aff9c` | reviewing | 2 | — |
| `review-34e7238822802bd9` | reviewing | 24 | — |
| `review-6e13c5be4e4d1866` | reviewing | 47 | — |
| `review-903433045706af48` | reviewing | 320 | — |
| `review-92e668fa5afe5584` | reviewing | 69 | — |
| `review-a7340cf2248a151f` | reviewing | 425 | — |

**Spot-check contra el código actual**, antes de decidir: la lógica de reacciones que esos hallazgos
apuntan fue reescrita después. `src/app/lib/server/actions/reactions/upsert.action.ts` borra con
`deleteMany({ where: { id: existing.id, reaction: existing.reaction } })` y actualiza con
`updateMany({ where: { id: existing.id, reaction: existing.reaction } })` — la escritura
condicional por el valor leído, que es exactamente lo que `R1-toggle-deletes-opposite-reaction`,
`R3-toggle-opposite-value-deletes` y `R4-set-noop-reported-success` pedían. El conteo de likes
usa una query agrupada con `reaction.id_user AS reactor`, que es lo que responde a
`R4-global-like-scan` y a `R1-SELF-LIKE-SCORE`. O sea: los hallazgos **parecen** estar ya
resueltos por el código posterior, no abiertos.

**Decisión del usuario**: abandonar las doce como obsoletas. Se hace con
`reason: operator_disposition` y `actor: user`, y el native las mueve a cuarentena — los
`review-state.json` quedan ahí (`residue: ["review-state.json"]`), así que el registro de los
hallazgos **no se destruye**, sólo sale del store activo.

**Resultado**: **diez de las doce** quedaron abandonadas con `reason: operator_disposition` y
`actor: user`, y movidas a cuarentena con su `review-state.json` intacto. Las dos que tienen
hallazgos admitidos registran `findings_present: true` en su registro de reclamo — o sea que
el native **sí las tenía** y el abandono las movió al store de cuarentena en vez de
destruirlas.

**Las dos que no se pudieron abandonar**: `review-e89a50893edb2c85` y `review-f0da02e0f0a1af85`,
ambas en estado `escalated`. El native responde `native-abandon-ineligible` y su ruta es
`recover`, cuyo motivo es `recovery_target_unrepresentable`: su objetivo estaba anclado a un
estado del workspace que ya no existe (el árbol base era el commit anterior a esta feature).
La operación `recover` exige el input como string serializado y la facade de este host no lo
admite, así que quedan **abiertas y sin tocar** — un estado no destructivo. Sus hallazgos
`R1-STALE-LIKE-DELETION`, `R2-STALE-REPORT-CONFIRMATION`, `R4-stale-report-confirmation`,
`R4-report-toggle-false-success`, `R3-REACTION-COMMIT-READ` y `R4-nonretryable-postcommit-read`
quedan en el registro de arriba y en sus `review-state.json`.

### L14 — Estado de la revisión nativa por unidad (2026-11-10)

| Unidad | Candidato | Lineage | Resultado |
| --- | --- | --- | --- |
| Validación (8 archivos) | 387 líneas | `review-cbf7f16f0669f86b` | **approved**, autoridad quemada |
| T4 shell + primitives (9 archivos) | 598 líneas | `review-b6c6755e39ff7658` | **atascado en el collect** |

El lineage de T4 rechaza el binding con `collectBinding is missing or stale for current
STATUS` en **siete intentos**, con dos herramientas distintas (`capture` y `capture_group`),
con y sin `reviewerRunAcknowledged`, y con un STATUS fresco entre medio. El forecast se
obtuvo (intento 3), así que el binding **es** válido: lo que no cierra es el camino del
acuse en esta lineage. El lineage queda **abierto**; abandonarlo requiere autorización
explícita del usuario.

La evidencia de T4 es, entonces, el verificador independiente
(`gentle-ai-verify` sobre `005b96a..83780e6`), que es el sustituto que ya encontró el
defecto real antes.

### L10 — Correcciones del canvas aplicadas (2026-11-06)

Dos intentos, dos bloqueos distintos, ambos con diagnóstico del provider.

**Intento 1 — candidato de la unidad de validación (2.510 líneas).** Lineage
`review-c8874c3d0e4adb2e`: tier medium, lente `review-reliability` elegida por el native,
presupuesto de corrección 200. El `collect` rechazó el binding dos veces con
`collectBinding is missing or stale for current STATUS`. Los bindings enviados eran
**byte-idénticos** a la autoridad en disco
(`.git/gentle-ai/review-transactions/v2/review-c8874c3d0e4adb2e/review-state.json`): es un
mismatch de forma camelCase/snake_case entre la facade de Pi y la de Go, ya documentado en
este host.

**Intento 2 — candidato de la feature completa (5.208 líneas).** Lineage
`review-0c9dfbf116d02ff5`: el preflight falló con `lens_context_budget_exceeded`, que es
**terminal**. La prescripción del propio native es dividir en candidatos más chicos. La causa
es medible: ~3.000 de esas líneas son el HTML de los tres artboards.

**Intento 2a — selección de lentes.** `native-start-input-invalid` / `lenses-invalid`, y es
reproducible: falla igual con `baseRef` inválido y con `baseRef` válido. Este host rechaza la
selección de lentes del agente y deja que el native elija la suya.

**Conclusión**: la vista externa nativa no se puede completar en este host para candidatos
ejecutables. La evidencia real de esta unidad es el sustituto documentado,
`gentle-ai-verify` sobre el rango `3354258..8c822c1`.

**Consecuencia para la entrega**: el presupuesto de contexto del native obliga a que un
candidato no arrastre los ~3.000 líneas de HTML de los artboards. La forma de entrega que lo
permite es que los artefactos de diseño aterricen en `main` antes que las unidades de
código, o que cada unidad de código se revise con base en el boundary anterior. Ambas son
decisiones de merge del usuario.

**Estado de las lineages**: `review-0c9dfbf116d02ff5` no creó autoridad (nada que abandonar
ni reparar). `review-c8874c3d0e4adb2e` queda **abierta en estado collect**; abandonarla
requiere autorización explícita del usuario.

### L10 — Correcciones del canvas aplicadas (2026-11-06)

Los cinco comentarios del usuario se aplicaron a los **tres** artboards, porque los tres
devices rechazados son idénticos en los tres archivos. Verificado por el padre sobre el
árbol final: `border-left` 0/0/0, `scroll interno` 0/0/0, referencias externas 0/0/0.

Qué cambió:

- **Se fueron los dos `border-left`** (el de acento `var(--accent-92c1c9)` de los títulos de
  sección y el de plata `var(--silver)` del bloque de ayuda/aviso) y también el
  `.section-title::before`. La jerarquía se sostiene ahora con peso 700 en el título, el
  badge de número y 20 px medidos entre secciones (`.section + .section { margin-top: 8px }`
  más el gap de 12 px del modal). El bloque de ayuda y el aviso conservan su superficie
  `--midnight-green` con más padding (14 px / 10 px verticales).
- **Se fue el cue de scroll** ("El modal sigue hacia abajo: scroll interno (max-h-90dvh)") y
  su CSS. En las notas de 02 la referencia técnica se conservó sin la frase, porque ese panel
  es documentación para quien revisa, no copy que ve el alumno.
- **Los botones del móvil quedan en una sola fila.** `.phone-foot` es `display: flex` con
  `flex-direction: row`, y `.phone .btn` lleva `flex: 1 1 auto; padding: 12px 8px;
  white-space: nowrap`. Medido en Firefox headless a 360 px: "Cancelar" y "Enviar respuesta"
  comparten banda vertical, 0 px de overflow, una línea de texto cada uno.
- **"Elegir archivo" no se parte** a 360 px: `.phone .file-btn { flex: 0 0 auto;
  white-space: nowrap }`.

**Defecto encontrado por el writer y no pedido**: el teléfono que el artboard rotula "360 px"
**renderizaba a 420 px** — `flex: 0 0 360px` se ignora en un bloque hijo de una columna flex.
La escena "360 px" no era de 360 px y la medición de "una línea" se hacía al ancho
equivocado. Corregido con `.crop.phone-crop { flex: 0 0 360px }` + `.phone { width: 360px }`,
y re-verificado.

Altos re-medidos y sincronizados con `design.json`: **1713 / 1827 / 1869** (antes
1740 / 1855 / 1861). La métrica es el borde inferior del último elemento del artboard en
Firefox headless, y reproduce los valores previos sobre los archivos sin corregir, así que
los números nuevos son comparables con los viejos.

**Slice boundary**: los artboards van en `feat/add-modals-design-polish` (junto a
`design/system.*`) y esa rama se mergea con `--no-ff` en `feat/add-modals-validacion`, que
mantiene su commit `8c822c1` intacto para que el rango revisado siga resolviendo.

### L9 — Feedback del canvas y decisiones (2026-11-06)

El usuario revisó los tres artboards en el canvas y dejó **cinco comentarios** en lugar de
elegir una dirección:

| id | Artboard | Corrección |
| --- | --- | --- |
| `dlm5mjer` | 01 | La línea vertical de la izquierda en el título de sección es innecesaria |
| `mwp0xpu1` | 01 | El borde izquierdo del bloque de ayuda tampoco |
| `fuxql9aj` | 01 | Quitar la aclaración "El modal sigue hacia abajo: scroll interno" — se debe intuir |
| `og1s3xce` | 02 | La línea izquierda del aviso "No dupliques" |
| `kn6ur621` | 02 | Los botones del móvil siempre en una línea |

**Decisión del padre**: los tres devices (`border-left` de acento, `border-left` de plata y el
scroll-cue) son **idénticos en los tres artboards**, así que las correcciones se aplican a
los tres, no sólo a los comentados. Una corrección a un device es una corrección al device.

**Estrategia de entrega (decidida por el usuario)**: `chain_strategy=feature-branch-chain`.
Los artefactos de diseño quedan en `feat/add-modals-design-polish` y las unidades de código
se encadenan encima, una por commit, para que el diff de código quede revisable y la
superficie de revisión del diseño sea el canvas.

**Copy de S5 resuelto**: "Confirmo que este PDF es sólo el parcial y no tiene las
respuestas". Aplicado en los tres artboards.

**Slice boundary**: este commit es la unidad de validación (T6). 7 archivos de código +
este documento.

### L8 — Artboards (T2, 2026-11-06)

Tres direcciones en `design/add-modals/`, con su `design.json`:

| Archivo | Dirección | Alto medido |
| --- | --- | --- |
| `01-formulario-guiado.html` | Guided form | 1440 × 1740 |
| `02-ayuda-contextual.html` | Contextual help | 1440 × 1855 |
| `03-tarjetas-de-tipo.html` | Type cards | 1440 × 1861 |

Los altos son **medidos** (Firefox headless), no estimados: con los tres modales de
escritorio, la vista de 360 px, el estado de error y la leyenda de tokens, 1200 px obligaba
a recortar los pies de los modales.

Cada artboard lleva: cabecera con la dirección y su tradeoff, franja de leyenda de tokens,
los tres modales en fila, el modal de respuestas a 360 px con pie apilado fijo, un estado de
error del modal de TP y un panel de notas.

**Auditoría de tokens**: hex usados = `#1e293b` (slate-800), `#334155` (slate-700),
`#cbd5e1` (slate-300), `#4b5563` (gray-600), `#fff`, `#92c1c9`, `#f87171`. Todos están
registrados en `design/system.md` salvo `red-400`, que queda etiquetado en la leyenda como
"No registrado en system.md" — mismo criterio que usa `design/system.html` con sus swatches
stock.

**Contraste medido**: blanco/slate-800 14.63:1, silver/slate-800 6.38:1, acento/slate-800
7.45:1, **red-400/slate-800 5.29:1** (cumple S14; `red-600` queda sólo como referencia
etiquetada), black/acento 9.31:1.

**Corrección de S5 (decidida por el padre)**: la spec se contradecía a sí misma en el check
del parcial — la cadena literal decía "examen" y la misma spec prohíbe "examen". Se aplica
la regla de vocabulario, que es lo aprobado: **"Confirmo que este PDF es sólo el parcial y no
tiene las respuestas"**. Queda alineado con el mensaje de error existente
("Tenés que confirmar que el parcial no tiene las respuestas"), así que la etiqueta y el
error dicen lo mismo.

**Slice boundary**: commit `3354258` (`docs(design)`), 2073 líneas de autor en la rama
`feat/add-modals-design-polish`. Casi todas son artefactos de diseño (`design/system.html`
y `design/system.md`), cuya superficie de revisión es el **canvas**, no el diff. La unidad de
código (T6) va en su propio commit aparte. La estrategia de entrega para el Oversized la
decide el usuario.

### L7 — Decisión de diseño pendiente

Falta que el usuario elija una de las tres direcciones en el canvas (T3). La implementación
(T4-T6) arranca recién después de esa elección.
