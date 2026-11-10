# tuAmigoFI — Design System (captured from the project)

This document is a **capture of the tokens that the project actually uses today**, not a proposed
starter system. Every entry below was read from a source file in this repository; the source path
is named in each row. Values that are not present in the sources are not recorded here.

Companion artboard: `design/system.html` (renders the same tokens and components, 1440 px wide).

## Sources read

| Source | What was taken from it |
| --- | --- |
| `src/app/globals.css` | `:root` custom properties, `@theme` block, `body` rule, `input, select, textarea` rule, commented-out `prefers-color-scheme: dark` block |
| `tailwind.config.ts` | `theme.extend` block (animation, spacing, transitionProperty, height only) |
| `src/app/components/UI/Modal.tsx` | Modal shell: overlay, `<dialog>` panel, close button, portal |
| `src/app/components/layout/modals/ModalAddTpContent.tsx` | Live modal body: title, sections, fields, helper block, primary button |
| `src/app/components/layout/modals/ModalAddMidtermContent.tsx` | Select + checkbox + date field usage in a modal |
| `src/app/components/layout/modals/ModalAddResponseContent.tsx` | Response modal body, `ResponseForm` usage |
| `src/app/components/layout/modals/ModalDeleteTpContent.tsx` | Confirmation modal: checkbox confirmation and delete button |
| `src/app/components/layout/form/InputForm.tsx` | `inputClass` string, label rule, error-message rule |
| `src/app/components/layout/form/SelectForm.tsx` | Select classes (no `w-full`) |
| `src/app/components/layout/form/CheckboxForm.tsx` | Checkbox + inline label rule |
| `src/app/components/layout/form/FileForm.tsx` | File input classes (`text-white`, no border) |
| `src/app/components/layout/form/ResponseForm.tsx` | Response type select, textarea (`cols={50}`), file field, error rules |
| `src/app/components/layout/form/SectionForm.tsx` | Section heading rule |
| `src/app/components/layout/form/form.tsx` | `Form` wrapper classes |
| `src/app/hooks/useDialogA11y.ts` | Focus trap and Escape behaviour |
| `src/app/contexts/ModalContext.tsx` | How the modal is mounted (no `title` prop) |
| `src/app/components/feature/materias/moduleContainer.tsx` | Hardcoded accent hexes, module card surfaces |
| `src/app/components/feature/materias/asideModules.tsx` | Hardcoded accent hexes, aside surface and selected-item color |
| `src/app/components/feature/materias/moduleResponse.tsx` | Response chip hexes, custom shadow |
| `src/app/components/feature/materias/course.tsx` | `--dark-cyan` chip |
| `src/app/components/feature/materias/buttonUrl.tsx` | `--midnight-green` button |
| `src/app/components/feature/materias/asideMainButton.tsx` | `--black-olive` mobile toggle |
| `src/app/components/questions.tsx` | `--midnight-green` action buttons |
| `src/app/components/layout/nav.tsx` | Active-nav hex |
| `src/app/components/layout/IconBackground.tsx` | Decorative background hex |
| `src/app/components/pdfView.tsx`, `src/app/components/pdf-viewer-impl.tsx` | PDF placeholder hex |
| `src/app/components/calendar.tsx` | Categorical event colors (not UI accents) |
| `src/app/components/feature/materias/comment.tsx` | `shadow-sm` usage |
| `src/app/page.tsx`, `src/app/(pages)/materias/page.tsx`, `src/app/(pages)/contactame/page.tsx`, `src/app/(pages)/acceso-baneado/page.tsx` | Page-heading chip hex and public heading sizes |
| `node_modules/tailwindcss/theme.css` (tailwindcss 4.3.3) | Default `--font-sans` stack (lines 1-3), `--color-white: #fff` / `--color-black: #000` (lines 322-323), default text sizes (lines 347-362), `--spacing` base (line 325), default radii (lines 397-402), default shadows (lines 406-412) |

Tailwind version in use: `tailwindcss@4.3.3` (see `package.json`). The project is on Tailwind v4
(`@import "tailwindcss"` in `src/app/globals.css`), so `tailwind.config.ts` is not the source of the
utility values; the v4 defaults in `node_modules/tailwindcss/theme.css` are.

---

## Colors

### 1. Project tokens — `:root` custom properties (7)

Source for all seven: `src/app/globals.css` (`:root` block). They are consumed in JSX as Tailwind
arbitrary values, e.g. `bg-(--platinum)`, `text-(--silver)`.

| Token | Value | Observed usage | Source |
| --- | --- | --- | --- |
| `--black-olive` | `rgb(38, 44, 30)` | Dark olive surface of the module aside panel and of the mobile aside toggle; also the text color of the aside's "Agregar TP" button (which sits on `bg-(--white)`) | `src/app/globals.css` (`--black-olive`); `src/app/components/feature/materias/asideModules.tsx:61,135`; `src/app/components/feature/materias/asideMainButton.tsx:16` |
| `--dark-cyan` | `rgb(39, 120, 124)` | Course chip in the page header (`bg-(--dark-cyan)` with `text-(--white)`); tinted icon tile `bg-(--dark-cyan)/10` on the home page | `src/app/globals.css` (`--dark-cyan`); `src/app/components/feature/materias/course.tsx:31`; `src/app/page.tsx:86` |
| `--silver` | `rgb(169, 172, 169)` | Secondary metadata line inside the aside list ("Del año 2024", "Del 3/2024") | `src/app/globals.css` (`--silver`); `src/app/components/feature/materias/asideModules.tsx:86,119,121` |
| `--platinum` | `rgb(212, 215, 222)` | Page background (`body { background: var(--platinum) }`); sticky header band of the module card (`bg-(--platinum)`); skeleton surfaces | `src/app/globals.css` (`--platinum`, `body` rule); `src/app/components/feature/materias/moduleContainer.tsx:91`; `src/app/components/skeletons/*.tsx` |
| `--midnight-green` | `rgb(28, 50, 53)` | "Compartir link" button surface; question action buttons; hover surface of the active nav item | `src/app/globals.css` (`--midnight-green`); `src/app/components/feature/materias/buttonUrl.tsx:15`; `src/app/components/questions.tsx:53,66`; `src/app/components/layout/nav.tsx:109` |
| `--white` | `rgb(246, 247, 248)` | Body text color on the page (`body { color: var(--white) }`); background of every `input`/`select`/`textarea`; surface of the module card (`bg-(--white)`) and of the reaction chips | `src/app/globals.css` (`--white`, `body` rule, `input, select, textarea` rule); `src/app/components/feature/materias/moduleContainer.tsx:159,161,171` |
| `--black` | `rgb(19, 21, 24)` | Text color of every `input`/`select`/`textarea` (`color: var(--black)`) | `src/app/globals.css` (`--black`, `input, select, textarea` rule) |

The `prefers-color-scheme: dark` block in `src/app/globals.css` is fully commented out, so the dark
palette above the comment is **not** in effect. Only the seven values above apply.

### 2. Hardcoded hex accents (13 distinct values)

These are literal hex values written in JSX. They are **not** tokens today.

#### Cyan accent family — same hue, four spellings (hue ≈ 188.6°–188.9°)

| Hex | RGB | HSL | Where | Source |
| --- | --- | --- | --- | --- |
| `#92C1C9` | `rgb(146, 193, 201)` | `188.7° / 33.7% / 68.0%` | Hover background and hover border of the "Respuesta" button | `src/app/components/feature/materias/moduleContainer.tsx:147`; `src/app/components/layout/modals/ModalAddResponseOpener.tsx:40-41` |
| `#96cad3` | `rgb(150, 202, 211)` | `188.9° / 40.9% / 70.8%` | Background of the PDF area inside the module card | `src/app/components/feature/materias/moduleContainer.tsx:160` |
| `#9fc8cf` | `rgb(159, 200, 207)` | `188.8° / 33.3% / 71.8%` | Chip behind the response title ("Ejercicio 3:") | `src/app/components/feature/materias/moduleResponse.tsx:50` |
| `#C8E0E4` | `rgb(200, 224, 228)` | `188.6° / 34.1% / 83.9%` | Placeholder background of the PDF viewer and of the response PDF area | `src/app/components/pdfView.tsx:9,18`; `src/app/components/feature/materias/moduleResponse.tsx:104,130`; `src/app/components/pdf-viewer-impl.tsx:38` |

**Candidate to become one token.** `#92C1C9` and `#96cad3` are the same hue written two ways
(188.7° vs 188.9°), differing only in lightness/saturation; `#9fc8cf` and `#C8E0E4` are two more
spellings of that same hue. None of the four is registered in `:root`. They are recorded here
under their current names on purpose — do **not** silently rename them here; consolidating them is a
separate decision.

#### Olive accent — same hue family as `--black-olive`, not the cyan above

| Hex | RGB | HSL | Where | Source |
| --- | --- | --- | --- | --- |
| `#3D4731` | `rgb(61, 71, 49)` | `87.3° / 18.3% / 23.5%` | Background of the selected entry in the aside list ("Mostrar todos" and the active TP) | `src/app/components/feature/materias/asideModules.tsx:73,93` |

**Candidate to become one token**, but of the *olive* family, not of the cyan family: its hue
(87.3°) matches `--black-olive` (`rgb(38, 44, 30)`, 85.7°), not the cyan accents. It is a lighter
variant of the same olive hue, used as the "selected" state over the `bg-(--black-olive)` aside.

#### Cyan-teal that matches `--dark-cyan`

| Hex | RGB | HSL | Where | Source |
| --- | --- | --- | --- | --- |
| `#31969B` | `rgb(49, 150, 155)` | `182.8° / 52.0% / 40.0%` | Active marker of the nav rail (`border-t-2 border-[#31969B]`) | `src/app/components/layout/nav.tsx:109` |

Hue is identical to `--dark-cyan` (`rgb(39, 120, 124)`, 182.8°); it is a lighter, more saturated
variant. **Candidate to become one token** derived from `--dark-cyan`.

#### Neutrals and page furniture

| Hex | RGB | Where | Source |
| --- | --- | --- | --- |
| `#BABDBA` | `rgb(186, 189, 186)` | Decorative oversized background typography behind the page | `src/app/components/layout/IconBackground.tsx:14` |
| `#F3F4F6` | `rgb(243, 244, 246)` | Background chip behind the page `<h1>` on the public pages | `src/app/page.tsx:33`; `src/app/(pages)/materias/page.tsx:37`; `src/app/(pages)/contactame/page.tsx:18`; `src/app/(pages)/acceso-baneado/page.tsx:7` |

#### Categorical event colors (calendar only — not UI accents)

`#FFD700` (Hoy), `#4682B4` (Receso), `#663399` (Totalizadores), `#DC143C` (Feriado) and
`#228B22` (Inicio/Fin de cuatrimestre) are used to distinguish calendar day categories in
`src/app/components/calendar.tsx:194-263`, with the legend rendered at
`src/app/components/calendar.tsx:245-267`. They are a categorical data palette, not part of the
interface color system.

### 3. Stock Tailwind palette used inside the product UI

These come from `tailwindcss@4.3.3` defaults (`node_modules/tailwindcss/theme.css`), **not** from
this project's tokens. They are the palette the modals and form primitives are built with.

| Utility | Value | Where | Source |
| --- | --- | --- | --- |
| `slate-800` | `#1e293b` (`rgb(30, 41, 59)`) | Modal panel surface, overlay backdrop `bg-slate-800/50` | `src/app/components/UI/Modal.tsx:26,36` |
| `slate-700` | `#334155` (`rgb(51, 65, 85)`) | Input border, primary-button border, close-button hover | `src/app/components/layout/form/InputForm.tsx:47`; `src/app/components/layout/modals/ModalAddTpContent.tsx:120`; `src/app/components/UI/Modal.tsx:42` |
| `slate-300` | `#cbd5e1` | File name and "Procesando imagen..." helper text | `src/app/components/layout/form/FileForm.tsx:60`; `src/app/components/layout/form/ResponseForm.tsx:93,95` |
| `slate-600` | `#475569` | Placeholder text of the PDF viewer | `src/app/components/pdfView.tsx:9,18` |
| `gray-600` | `#4b5563` | Border of the "Respuesta" button | `src/app/components/feature/materias/moduleContainer.tsx:147` |
| `gray-900` | `#111827` | Code-block background of a response | `src/app/components/feature/materias/moduleResponse.tsx:108` |
| `red-600` | `#dc2626` (`rgb(220, 38, 38)`) | Every validation error message | `src/app/components/layout/form/InputForm.tsx:51`; `src/app/components/layout/form/SelectForm.tsx:56`; `src/app/components/layout/form/CheckboxForm.tsx:49`; `src/app/components/layout/form/FileForm.tsx:62`; `src/app/components/layout/form/ResponseForm.tsx:97,98,137,161` |
| `white` | `#fff` | `text-white` on labels, modal surface text, `bg-white` | `src/app/components/layout/form/InputForm.tsx:61`; `src/app/components/UI/Modal.tsx:36` |
| `black` | `#000` | `text-black` on inputs and textareas | `src/app/components/layout/form/InputForm.tsx:47` |

---

## Typography

### Font stack

No font is declared anywhere in the project: `tailwind.config.ts` has no `fontFamily`, `src/app/globals.css`
declares no `font-family`, and a search for `font-family` / `fontFamily` in `src/app` returns no
declaration. The stack in effect is therefore Tailwind v4's default `--font-sans`
(`node_modules/tailwindcss/theme.css:1-3`):

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial,
sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
```

### Type scale actually used

Sizes are Tailwind v4 defaults (`node_modules/tailwindcss/theme.css:347-362`); the "used in" column
lists the places this project uses them.

| Token | Size / line-height | Used in | Source |
| --- | --- | --- | --- |
| `text-xs` | `0.75rem / 1rem` | Helper text of the modals ("¡Recuerda!" paragraph, the asterisk note under the checkbox, file name) | `src/app/components/layout/modals/ModalAddTpContent.tsx:103`; `src/app/components/layout/modals/ModalAddMidtermContent.tsx:80,106`; `src/app/components/layout/form/FileForm.tsx:60` |
| `text-sm` | `0.875rem / 1.25rem` | Sub-headings inside the modals ("Click aquí para eliminar páginas de tu PDF", "¡Recuerda!") and error messages | `src/app/components/layout/modals/ModalAddTpContent.tsx:88,98,102`; `src/app/components/layout/form/InputForm.tsx:51` |
| `text-base` | `1rem / 1.5rem` | Body copy of the module card and of the aside entries (`text-base leading-4`) | `src/app/components/feature/materias/moduleContainer.tsx:147,159`; `src/app/components/feature/materias/asideModules.tsx:85,117,139` |
| `text-lg` | `1.125rem / 1.75rem` | Modal title (`<h2>`) of all modals | `src/app/components/layout/modals/ModalAddTpContent.tsx:43`; `src/app/components/layout/modals/ModalAddMidtermContent.tsx:43`; `src/app/components/layout/modals/ModalAddResponseContent.tsx:53`; `src/app/components/layout/modals/ModalDeleteTpContent.tsx:47` |
| `text-xl` | `1.25rem / 1.75rem` | Aside panel heading and the module-card heading row | `src/app/components/feature/materias/asideModules.tsx:64`; `src/app/components/feature/materias/moduleContainer.tsx:91` |
| `text-3xl` | `1.875rem / 2.25rem` | Public page headings | `src/app/page.tsx:99` |
| `text-4xl` | `2.25rem / 2.5rem` | Public page heading chip | `src/app/page.tsx:33`; `src/app/(pages)/materias/page.tsx:37` |

Weights in use: `font-medium` on the section heading inside a modal
(`src/app/components/layout/form/SectionForm.tsx:23`), `font-bold` on public page headings and on the
aside entry titles (`src/app/page.tsx:33`; `src/app/components/feature/materias/asideModules.tsx:85,117`).

Colors in type: labels and modal text are `text-white` (`#fff`), section headings are `text-white`
(`src/app/components/layout/form/SectionForm.tsx:23`), secondary metadata is `text-(--silver)`, validation messages are
`text-red-600` (`#dc2626`).

---

## Spacing

Base unit: Tailwind v4 `--spacing: 0.25rem` (`node_modules/tailwindcss/theme.css:325`). The project
adds three values of its own in the `@theme` block of `src/app/globals.css`:

| Token | Value | Equivalent | Source |
| --- | --- | --- | --- |
| `--spacing-18` | `4.5rem` | 72px | `src/app/globals.css` (`@theme`) |
| `--spacing-19` | `4.75rem` | 76px | `src/app/globals.css` (`@theme`) |
| `--spacing-250` | `62.5rem` | 1000px (used as `h-250`) | `src/app/globals.css` (`@theme`) |

The same three values are mirrored in `tailwind.config.ts` (`theme.extend.spacing.18`, `.19`,
`theme.extend.height.250`) for the v3-compatible config path.

Default scale steps in use in the sources: `0.25rem` (`p-1`, `px-1`, `gap-1`, `m-1`), `0.5rem`
(`p-2`, `px-2`, `py-1`, `gap-2`, `m-2`), `0.75rem` (`p-3`), `1rem` (`p-4`, `gap-4`, `mt-4`),
`1.25rem` (`p-5` — the modal body padding), `1.5rem` (`p-6`, `h-6`), `2rem` (`p-8`), `2.5rem`
(`p-10`, `w-10 h-10`), `3rem` (`p-12`). Modal-specific sizes: `max-w-lg` (`32rem`, the dialog width),
`max-h-[90dvh]` (modal scroll area), `w-10 h-10` (close button, `2.5rem`), `h-6` (module-card action
row, `1.5rem`).

---

## Radius

Only two radii are used in the modal and form layer:

| Token | Value | Used in | Source |
| --- | --- | --- | --- |
| `rounded-md` | `0.375rem` (6px) | Input/select/textarea corners (`rounded`), primary button, aside entries, module action button | `src/app/components/layout/form/InputForm.tsx:47`; `src/app/components/layout/modals/ModalAddTpContent.tsx:120`; `src/app/components/feature/materias/asideModules.tsx:74`; `src/app/components/feature/materias/moduleContainer.tsx:147` |
| `rounded-lg` | `0.5rem` (8px) | Modal dialog panel (`rounded-lg`) | `src/app/components/UI/Modal.tsx:36` |

Also present elsewhere in the app: `rounded-sm` (`0.25rem`) on
`src/app/components/feature/materias/buttonUrl.tsx:15` and
`src/app/components/questions.tsx:53`; `rounded-2xl` (`1rem`) on the public page headings
(`src/app/page.tsx:33`); `rounded-tr-lg` on the modal close button (`src/app/components/UI/Modal.tsx:42`);
`rounded-b-lg` on the module PDF area (`src/app/components/feature/materias/moduleContainer.tsx:160`).

---

## Shadows

| Token | Value | Used in | Source |
| --- | --- | --- | --- |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | The modal `<dialog>` panel | `src/app/components/UI/Modal.tsx:36` |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Public page heading chips, home cards | `src/app/page.tsx:33,83` |
| `drop-shadow-md` | same shadow, applied via `filter` | Module card body | `src/app/components/feature/materias/moduleContainer.tsx:159` |
| `shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Comments, skeletons | `src/app/components/feature/materias/comment.tsx:48`; `src/app/components/skeletons/*.tsx` |
| arbitrary `shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)]` | — | Response blocks | `src/app/components/feature/materias/moduleResponse.tsx:48,129` |

---

## Component rules (as implemented today)

### Input / select / textarea

- Global rule in `src/app/globals.css`:

  ```css
  input,
  select,
  textarea {
    background: var(--white);
    color: var(--black);
  }
  ```

- Utility classes applied on top (`src/app/components/layout/form/InputForm.tsx:47`):

  ```
  text-black px-2 py-1 rounded border border-slate-700 w-full
  ```

- The `select` uses the same rule **without** `w-full`
  (`src/app/components/layout/form/SelectForm.tsx:46` and
  `src/app/components/layout/form/ResponseForm.tsx:126`):

  ```
  text-black px-2 py-1 rounded border border-slate-700
  ```

- The `textarea` in `ResponseForm` uses the rule without `w-full` and with a fixed character width
  `cols={50}` (`src/app/components/layout/form/ResponseForm.tsx:154`).

### Label

```
<label className="text-white">{label}{required ? ' *' : ''}</label>
```

Source: `src/app/components/layout/form/InputForm.tsx:61`,
`src/app/components/layout/form/SelectForm.tsx:35`, `src/app/components/layout/form/FileForm.tsx:41`.
The required marker is a literal ` *` appended after the label text.

### Checkbox

The checkbox input and its label sit in a flex row with `gap-2 items-center text-white`; the label
itself carries no color class. Source: `src/app/components/layout/form/CheckboxForm.tsx:30-47`.

### File input

```
<input type="file" accept="application/pdf" className="text-white" />
```

The only file control in the app. It gets **no** border, padding or radius, and the class
`text-white` fights the global `background: var(--white)` on the same element. Source:
`src/app/components/layout/form/FileForm.tsx:58`; same in
`src/app/components/layout/form/ResponseForm.tsx:91`.

### Error message

```
<p className="text-red-600 text-sm mt-1">{message}</p>
```

Source: `src/app/components/layout/form/InputForm.tsx:51`; the same shape in
`src/app/components/layout/form/SelectForm.tsx:56`,
`src/app/components/layout/form/FileForm.tsx:62`,
`src/app/components/layout/form/ResponseForm.tsx:97,98,137,161`.
`src/app/components/layout/form/CheckboxForm.tsx:49` uses the same colors
without the `mt-1`.

### Modal panel

Overlay: `fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-800/50 backdrop-blur-sm`
(`src/app/components/UI/Modal.tsx:26`).

Dialog: `relative w-full max-w-lg m-0 p-0 bg-slate-800 text-white border-0 rounded-lg shadow-xl`
(`src/app/components/UI/Modal.tsx:36`). The body inside the dialog is
`relative flex flex-col gap-4 p-5 max-h-[90dvh] overflow-y-auto`
(`src/app/components/UI/Modal.tsx:39`).

### Close button

```
absolute top-0 right-0 flex items-center justify-center w-10 h-10 p-2 cursor-pointer
hover:bg-slate-700 rounded-tr-lg z-10
```

with `aria-label="Cerrar"` (`src/app/components/UI/Modal.tsx:40-47`). The overlay behind the dialog is
a full-size `<button aria-label="Cerrar modal" tabIndex={-1}>`
(`src/app/components/UI/Modal.tsx:27-32`).

### Primary button

```
px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700 transition-colors
disabled:opacity-50 disabled:cursor-not-allowed
```

Inside `<div className="flex gap-4 justify-center mt-4">`. The label today is `"Aceptar"` for the
three upload modals and `"Eliminar"` for the delete modal. Source:
`src/app/components/layout/modals/ModalAddTpContent.tsx:116-125`;
`src/app/components/layout/modals/ModalAddMidtermContent.tsx:119-126`;
`src/app/components/layout/modals/ModalAddResponseContent.tsx:106-113`;
`src/app/components/layout/modals/ModalDeleteTpContent.tsx:90-97`.

### Section heading inside a modal

`SectionForm` renders `<section className="flex flex-col gap-2">` with
`<header className="flex items-center gap-2"><h4 className="text-white font-medium">{title}</h4></header>`
(`src/app/components/layout/form/SectionForm.tsx:19-29`).

### Modal title

`<h2 className="text-lg">` at the top of the modal body, e.g. "Agregar TP", "Agregar Examen",
"Añadir una respuesta", "Eliminar TP" (`src/app/components/layout/modals/ModalAddTpContent.tsx:43`).

### Form wrapper

`<form className="relative flex flex-col w-full" noValidate>`
(`src/app/components/layout/form/form.tsx:9,12`).

### Modal behaviour

- Focus moves to the first focusable element inside the dialog (which today is the close button),
  `Tab` is trapped, `Escape` closes (`src/app/hooks/useDialogA11y.ts:5-49`, focus at `:18-19`).
- The dialog is rendered through a portal into `#root` (`src/app/components/UI/Modal.tsx:25,52`).

---

## Known inconsistencies (observations, not fixes)

1. **The cyan accent is written four ways.** `#92C1C9`, `#96cad3`, `#9fc8cf` and `#C8E0E4` share the
   hue ≈ 188.7° but are four separate literals. They are candidates to become one token; they are
   not tokens today.
2. **`#3D4731` is not part of that cyan family.** Its hue is 87.3°, the same olive family as
   `--black-olive` (85.7°), and it is used as the *selected* state over the `bg-(--black-olive)`
   aside. The three literals cited in the feature document are therefore **not** one color written
   three ways: two are the cyan accent and one is an olive accent.
3. **The modals use the stock Tailwind palette** (`slate-800`, `slate-700`, `slate-300`, `red-600`)
   instead of the project's own tokens. `slate-800` (`#1e293b`) is not a value that exists in
   `:root`.
4. **`text-white` and `text-black` are not the project tokens.** In Tailwind v4 they are `#fff` and
   `#000`, while `--white` is `rgb(246, 247, 248)` and `--black` is `rgb(19, 21, 24)`. The inputs
   therefore combine a stock `#000` text color with the project `--white` background.
5. **The file input is white on white.** The global rule gives every `input` a `var(--white)`
   background, and `FileForm`/`ResponseForm` add `text-white` on top of it. It is the only form
   control without the `px-2 py-1 rounded border border-slate-700` treatment.
6. **Widths are inconsistent between siblings.** `InputForm` uses `w-full`; `SelectForm` and the
   `ResponseForm` textarea do not.
7. **The textarea has a fixed character width** (`cols={50}`), not a percentage.
8. **Body text on the page background fails contrast.** `body` is `color: var(--white)`
   (`rgb(246, 247, 248)`) on `background: var(--platinum)` (`rgb(212, 215, 222)`), a contrast ratio
   of about **1.34:1** (WCAG AA needs 4.5:1 for normal text).
9. **Error text inside the modal is below AA.** `red-600` (`rgb(220, 38, 38)`) on `slate-800`
   (`rgb(30, 41, 59)`) is about **3.03:1**; on the `--white` input surface it is about **4.50:1**.
10. **The close button is the first focusable element** of the dialog, so opening a modal moves focus
    to "Cerrar" instead of to the first field (`src/app/hooks/useDialogA11y.ts:18-19`).
11. **The dialog has no accessible name** in the live path: `Modal` accepts an optional `title` and
    puts it in `aria-label`, but the context renders `<Modal>{content}</Modal>` without one
    (`src/app/components/UI/Modal.tsx:37`; `src/app/contexts/ModalContext.tsx:40`).
12. **The dark palette is commented out.** `src/app/globals.css` keeps a `prefers-color-scheme: dark`
    block whose values are all inside a comment, so the app has no dark mode.
