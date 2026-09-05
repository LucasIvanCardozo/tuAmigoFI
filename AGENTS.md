# AGENTS.md - TuAmigoFI Development Guide

## Priority

When instructions conflict, follow this order:

1. **User instructions** override this file.
2. **This file** overrides repo conventions and existing one-off patterns.
3. **Ambiguous** → inspect existing patterns first. Match the dominant style in the surrounding code.
4. Do not invent architecture or abstractions unless the task requires it.
5. **Pattern consistency.** Pick one way to do something and apply it across the app. When introducing a new component or pattern, audit existing usage and align; do not introduce a one-off variant. Same rule in JSX, CSS, commit style, or API design.

## Overview

TuAmigoFI is a Next.js application for students at Facultad de Ingeniería de Mar del Plata.

- **Framework:** Next.js ^16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma 7
- **Auth:** NextAuth.js
- **Validation:** Zod v4 (single source of truth for both client and server)
- **Forms:** react-hook-form + @hookform/resolvers/zod + `useFormSubmit` (hook) + sileo (toasts)
- **File Storage:** Cloudinary
- **Package Manager:** pnpm

## Commands

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Biome check (no fixes)
pnpm lint:fix      # Biome check + format
pnpm seed          # Run Prisma seed using .env
pnpm db:reset      # Drop, migrate, generate and seed local DB
pnpm db:pr:reset   # Drop, migrate and seed production DB
```

> No test framework configured. Do not add tests unless explicitly requested.

## Project Structure

```
src/app/
├── (pages)/                # Page routes with route groups
├── api/                    # API routes
├── assets/                 # Static assets
├── components/             # React components
│   ├── form/               # rhf wrappers (Form, InputForm, SelectForm, etc.)
│   ├── layout/             # Layout, modals, providers
│   ├── UI/                 # Reusable UI primitives
│   ├── feature/            # Feature-specific components
│   └── skeletons/          # Loading skeletons
├── contexts/               # React Context providers (ModalContext, ModuleSelectionContext, mainContext)
├── hooks/                  # Custom React hooks (useReload, useFormSubmit, useDialogA11y)
├── lib/
│   ├── server/
│   │   ├── actions/        # Server Actions (zod-validated)
│   │   ├── auth/           # NextAuth config
│   │   ├── db/prisma/      # Prisma client & models
│   │   ├── db/repository/  # Data repositories
│   │   └── usecases/       # Business logic
│   └── shared/
│       └── schemas/        # Zod schemas shared by client forms and server actions
├── types/                  # TypeScript types
└── utils/                  # Utility functions
```

## Architecture

- **Server Actions** (`lib/server/actions/`) are the entry point for mutations. Each action:
  - Defines its own `z.object` schema.
  - Wraps the handler with `createAction(schema, fn)` which returns `ActionResult<T> = { success, data, error }`.
- **Use cases** (`lib/server/usecases/`) hold business logic; actions call them, not the DB directly.
- **Repositories** (`lib/server/db/repository/`) wrap Prisma; use cases never touch `db` directly.
- **Shared schemas** (`lib/shared/schemas/`) are the single source of truth for form validation on the client side. They mirror the structure of server-side schemas without server-only fields (e.g., `session.user.id`, `idCourse`).
- **Cache invalidation:** Server Actions that mutate data MUST use `updateTag(tag)` from `next/cache` for immediate invalidation (read-your-own-writes). Never use `revalidateTag(tag, 'max')` from a Server Action — that triggers background revalidation and `router.refresh()` will still serve stale data. The `cacheTag(...)` calls in the read-side use cases must use the same tag name as the `updateTag(...)` call in the corresponding write-side action. Route Handlers and webhooks are the only place `revalidateTag(tag, 'max')` belongs.

## Form Handling

Forms use **react-hook-form + zodResolver + the `useFormSubmit` hook** exclusively. Never introduce a second form pattern.

The split of responsibilities mirrors carta-qr:

- **`Form`** is a thin wrapper around `<form>`. It owns no logic — no `useForm`, no `useTransition`, no toasts.
- **Each consumer** sets up `useForm` + `zodResolver` locally and wires the submit through `useFormSubmit`, which owns `useTransition` and `sileo` feedback.
- **`useFormSubmit`** runs the `action`, then fires `onSuccess` (e.g. `startReload()` + `closeModal()`), then shows a success toast. On throw, it shows an error toast.

This split is deliberate: it lets the modal decide **when** to refresh and close, keeps `Form` styling-only, and ensures a validation failure never shows a misleading success toast.

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  InputForm,
  SectionForm,
  FileForm,
} from "@/app/components/layout/form";
import { useFormSubmit } from "@/app/hooks/useFormSubmit";
import { useReload } from "@/app/hooks/useReload";
import { useModal } from "@/app/contexts/ModalContext";
import { addTpSchema, type AddTpInput } from "@/app/lib/shared/schemas";

export const MyModal = ({ course }: { course: Course }) => {
  const { control, handleSubmit } = useForm<AddTpInput>({
    resolver: zodResolver(addTpSchema),
    defaultValues: { name: "", number: 1, year: new Date().getFullYear() },
  });

  const action: SubmitHandler<AddTpInput> = async (data) => {
    const { error } = await createTp({ ...data, idCourse: course.id });
    if (error) throw new Error(error);
  };

  const { closeModal } = useModal();
  const { startReload } = useReload();
  const { submit, isLoading } = useFormSubmit({
    action,
    successMessage: "Muchas gracias por tu aporte! ❤️",
    onSuccess: async () => {
      startReload();
      closeModal();
    },
  });

  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <SectionForm title="Datos del TP">
        <InputForm<AddTpInput>
          name="name"
          control={control}
          label="Título"
          required
        />
        <InputForm<AddTpInput>
          name="number"
          type="number"
          control={control}
          label="Número"
          required
        />
        <InputForm<AddTpInput>
          name="year"
          type="number"
          control={control}
          label="Año"
          required
        />
      </SectionForm>
      <FileForm<AddTpInput>
        name="file"
        control={control}
        accept="application/pdf"
        required
      />
      <div className="flex gap-4 justify-center mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Aceptar
        </button>
      </div>
    </Form>
  );
};
```

Available primitives (all under `@/app/components/layout/form`):

| Component         | Required props                                                                                                                                      | Notes                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Form`            | `children`                                                                                                                                          | Stylistic wrapper around `<form>`.                                              |
| `SectionForm`     | `children`                                                                                                                                          | Groups related fields. Prefer over manual `<section>` + `<h4>` inside forms.    |
| `InputForm<T>`    | `name`, `control`, `label?`, `type?` (`text`/`number`/`email`/`password`/`url`/`date`/`textarea`), `placeholder?`, `min?`, `max?`, `rows?`, `cols?` | Generic on `T extends FieldValues`. Number fields return `number \| undefined`. |
| `SelectForm<T>`   | `name`, `control`, `children` (options)                                                                                                             | Dropdown.                                                                       |
| `CheckboxForm<T>` | `name`, `control`, `label?`                                                                                                                         | Boolean.                                                                        |
| `FileForm<T>`     | `name`, `control`, `accept?`                                                                                                                        | File picker; value is `File \| undefined`.                                      |
| `ResponseForm<T>` | `control`                                                                                                                                           | Compound input for response type (TEXT/CODE/IMAGE/PDF).                         |

`useFormSubmit` (`@/app/hooks/useFormSubmit`):

| Option           | Required | Notes                                                                                               |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `action`         | yes      | `SubmitHandler<TInput>`. Throw `Error` on failure.                                                  |
| `onSuccess`      | no       | Runs **after** `action`, **before** the success toast. Use it for `startReload()` + `closeModal()`. |
| `successMessage` | no       | If set, shown via `sileo.success` after `onSuccess`.                                                |

Returns `{ submit, isLoading }`. Bind `submit` to `handleSubmit` and pass `isLoading` to your submit button's `disabled`.

For confirmation-only modals (deletes), use `confirmationSchema` with a `CheckboxForm name="confirm"`.

**Validation behavior:** when zod validation fails inside `handleSubmit`, the inner `action` is never called, no transition is started, and no toast is shown. Only the per-field errors light up. This is the desired behavior.

## Validation

Zod schemas are the source of truth. Every server action and every client form has a schema.

- Client-side schemas live in `lib/shared/schemas/` and are consumed by `Form<T>` via `zodResolver`.
- Server-side schemas live next to the action and validate again at the action boundary. Never trust the client.
- Field names must match between the client schema and the server schema (when the field is shared).

## Error Handling

Server actions return `ActionResult<T>` via `createAction`:

```typescript
{ success: true, data: T, error: null } | { success: false, data: null, error: string }
```

In `useFormSubmit`, the `action` is expected to throw `Error` on failure (read the result and `throw new Error(result.error)` if `result.error` is set). `useFormSubmit` catches the throw and shows a `sileo.error` toast. Per-field validation errors from zod are surfaced automatically by `react-hook-form` and **do not trigger a toast**.

## Code Style

- **No comments.** Self-explanatory code only. No `// biome-ignore`, no JSDoc, no JSX `{/* */}`.
- **Files:** kebab-case. **Components:** PascalCase. **Functions/variables:** camelCase. **Constants:** camelCase. **Types:** PascalCase.
- **Imports:** `@/` alias for project imports. Order: React/Next.js → External → Project (`@/`) → Relative. Top-level `import type` for types only.
- **Tailwind:** utility classes with responsive prefixes (`sm:`, `md:`, `lg:`).
- **Components:** function components, explicit prop types, destructure props. Client components must have `'use client'` at the top.
- **Biome** (`biome.json`): single quotes, semicolons required, trailing commas, 2-space indent, `lineWidth: 100`. CSS files excluded.
- **Unused bindings** use `_` prefix. Never silence with `// biome-ignore`.

## Security

- Never commit `.env`, secrets, tokens, or credentials.
- Never log secrets. Use server-side `userUseCases.getSession()` to resolve the user; do not trust client-supplied `idUser`.
- Server actions re-validate with zod. Do not rely on client-side validation alone.
- Cloudinary credentials are server-only and must stay in `process.env`.

## Git

Conventional commits:

```
feat(scope): short imperative summary
fix(scope): short imperative summary
chore(scope): ...
refactor(scope): ...
docs(scope): ...
style(scope): ...
```

Common scopes: `forms`, `modals`, `auth`, `tp`, `midterm`, `response`, `link`, `correlative`.

Subject line max 100 chars. Imperative mood. Body in present tense; bullets for multi-area changes.

## Environment Variables

Required (see `.env`): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Cloudinary credentials.

## What NOT To Do

1. **No comments.** Code should be self-explanatory.
2. **No tests.** No test framework configured.
3. **No new config files** unless necessary.
4. **Use pnpm.** Not npm or yarn (check `pnpm-lock.yaml`).
5. **No secrets** committed.
6. **No second form pattern.** Do not introduce `useState` + `FormEvent` + manual validation alongside `react-hook-form` + zod. Migrate existing inline forms to `<Form>` + schemas.
7. **No duplicated validation.** Zod schemas exist to be reused; do not re-validate in components or actions with ad-hoc logic.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
