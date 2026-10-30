# PDF viewer layout cycle

Branch: `fix/pdf-viewer-layout`
Status: implemented and verified against production, pending the user's merge decision
Base: `main` at `9bd2847`

## Problem

A student uploaded a scanned PDF to production and reported that it does not display in
the viewer, although it downloads correctly:

- Failing: `/materias/parciales/cmur6crym000mn128yw4ev9ae` (Álgebra II, "Segundo parcial",
  `delfinaquiroga-algebra2-2P-2024.pdf`, 922,971 bytes, 5 pages, scanned).
- Working, for comparison: `/materias/practica/cmur6cryl0006n12816bi5924` ("Practica 2 -
  Punteros - Prog II.pdf", 57,630 bytes, 1 page, text based).

The report also says the viewer looks empty for the person who uploaded it, and that it
does appear in one browser. The symptom was reproduced with headless Chromium against
production.

## What the file is not

Every layer was checked and ruled out, because the natural assumption is a broken upload:

| Check | Result |
| --- | --- |
| The file on the CDN | HTTP 200, `content-type: application/pdf`, `content-length: 922971`, `accept-ranges: bytes`, `access-control-allow-origin: *` |
| Range requests | `206` with a correct `content-range`, identical to the working file |
| The PDF itself | `%PDF-1.7`, 5 pages, parses with the pinned `pdfjs-dist@3.11.174` (viewport 595.25x842, 11 operator ops per page, 0 text items: a scanned document) |
| The embedded images | 5 baseline JPEGs, 939x1252, DeviceRGB, 8bpc, `DCTDecode`; extracted with `pdfimages` and decoded with PIL (full 0-255 range) |
| The pdf.js version | the worker served by unpkg is byte-for-byte the same build (1,087,212 bytes) as the pinned local one |
| pdf.js itself | the same PDF rendered **100%** (722,865 of 722,865 pixels) in a local harness with the same pdf.js, the same worker and the same Content-Security-Policy |

So the file, the CDN, the range requests, the parser and the CSP are all fine.

## Root cause: a layout feedback loop between the wrapper and the viewer

The canvas **was** painted. Reading its pixels in production:

```
canvas 802x1134  ->  centro = 190,192,189,255   esquina = 255,255,255,255
```

The scanned page is in the canvas. But the canvas was positioned at `y = 16,776,845`
pixels, and the DOM chain explained why:

```
rpv-core__viewer                height: 100%                -> 33,554,424px
└ div.w-full.flex-none          aspect-ratio: 0.706948 / 1   -> 33,554,428px   <-- our wrapper
  └ rpv-core__inner-pages       height: 100%                -> 33,554,424px
    └ rpv-core__inner-page-container                        -> 33,554,400px
      └ canvas                 (painted, but 16.7M px below the viewport)
```

`react-pdf-viewer` 3.12 renders each page container with the height of its own scroll
container when `scrollMode` is `Page` (`buildItemContainerStyles` in
`node_modules/@react-pdf-viewer/core/lib/cjs/core.js:2587`):

```js
height: `${parentRect.height}px`,
```

So the viewer's height comes back from its own content. Our wrapper is a flex item in a
column, where the automatic minimum size (`min-height: auto`) is **content-based**, so
the wrapper's minimum height is the viewer's minimum content height, which is the page
container, which is the viewer's height. The two feed each other.

The cycle **converges for some documents and diverges for others**, which is exactly the
reported asymmetry: the working PDF settles at 1,002px, the failing one explodes to
33,554,428px (a float32-quantised value, 2^25). The user therefore sees the toolbar and
an empty white area where the page should be, while the download works.

## Fix

`min-h-0` on the wrapper, so its height can only come from its `aspect-ratio` (or the
`75vh` fallback) and never from the content that depends on it:

```tsx
<div className="w-full flex-none min-h-0" style={aspectRatio ? { aspectRatio } : { height: '75vh' }}>
```

`AGENTS.md` records the requirement next to the PDF rendering rules, so the class is not
removed by a later cleanup.

## Verification

Executed against **production** with headless Chromium, by changing the live page before
any code was written:

```
ANTES   wrapper height = 33,554,428px   canvas y = 16,776,845   (fuera de pantalla)
CON min-h-0   wrapper height = 1,159px  canvas y = 211           pixel = 198,200,195,255
```

1,159px is exactly `819 / 0.706948`, the width the aspect ratio asks for, and the sampled
pixel is the scanned page's content. The same measurement on the working PDF (1,002px,
`min-height: auto`, aspect `0.772727`) shows the cycle converging there, which is why that
document always displayed.

- `pnpm lint`: exit 0, 0 errors and the single accepted warning.
- `pnpm build`: exit 0, TypeScript clean, 10/10 static pages.

### Not verified locally

- The fix has not been deployed, so the "after" measurement above is the live page with
  the class toggled at runtime, not the shipped build. A post-deploy check on the same
  URL closes it.
- No other PDF in production was audited for the same divergence. The bug is
  document-dependent, so other uploads may be affected without anyone having noticed.

## Residual, recorded honestly

- **The worker still loads from unpkg at runtime.** The pinned version is correct, but a
  third-party script is a runtime dependency of every page that shows a PDF, and the
  Content-Security-Policy has to allow it. Serving `pdf.worker.min.js` from `public/`
  would remove that dependency; it is a separate change.
- **The cycle was viewport-dependent**, so the same document could display on one screen
  and fail on another. That is the likely reason the reporter saw it in one browser and
  not in another.

## Log

- **L1** — "un bug raro que encontro un usuario en produccion es que subio un .pdf
  (https://tuamigofi.com.ar/materias/parciales/cmur6crym000mn128yw4ev9ae) pero a el no le
  carga (si lo descarga si lo descarga bien). Su navegador es opera, y curiosamente yo me
  lo descargue y tampoco me aparecio lo que subio!. en mi navegador Zed si me aparece. Y
  otra cosa curiosa es que el pedf que yo habia subido antes si le aparece y lo puede ver
  (mi pdf que si ve: https://tuamigofi.com.ar/materias/practica/cmur6cryl0006n12816bi5924)."
- **L2** — "mientras podes mandar a un subagente a buscar este error en internet con
  nuestro stack, a lo mejor alguien encontro la solucion o el problema" (the research
  confirmed the mechanism but not the trigger; the trigger was found locally by reading
  the painted canvas and the DOM).
