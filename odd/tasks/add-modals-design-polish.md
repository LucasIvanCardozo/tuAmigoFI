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
  examen, sin respuestas".
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
| T2 | S1, S2, S4, S5 | worker | 3 artboards + `design.json` en `design/add-modals/` | (docs, decide at commit time) |
| T3 | S1 | parent | Abrir el canvas y que el usuario elija una dirección | — |
| T4 | S6, S7, S8, S12, S13, S14 | worker | Shell (`UI/Modal.tsx`) + primitives de formulario | `fix(modals): ...` |
| T5 | S2, S4, S5, S15 | worker | Los tres modales de alta + los openers | `feat(modals): ...` |
| T6 | S9, S10, S11 | worker | Server Actions + schemas compartidos | `fix(upload): ...` |
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

### L7 — Decisión de diseño pendiente

Falta que el usuario elija una de las tres direcciones en el canvas (T3). La implementación
(T4-T6) arranca recién después de esa elección.
