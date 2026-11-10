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
| T4 | S6, S7, S8, S12, S13, S14 | worker | Shell (`UI/Modal.tsx`) + primitives de formulario | `fix(modals): ...` |
| T5 | S2, S4, S5, S15 | worker | Los tres modales de alta + los openers | `feat(modals): ...` |
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

### L11 — La revisión nativa no es completable en este host (2026-11-06)

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
