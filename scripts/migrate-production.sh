#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Neon sirve el endpoint a través de pgbouncer (el host lleva "-pooler"). El migrate de
# Prisma toma un advisory lock de sesión, y pgbouncer no lo libera cuando el cliente se
# desconecta: una migración por la URL pooled puede dejar un lock huérfano que hace que la
# siguiente run se cuelgue hasta que Neon recicla esa conexión. Migrar por la conexión
# directa evita el problema.
direct_url="$(pnpm exec dotenv -e .env.production -- sh -c 'printf %s "$DATABASE_URL"' | sed 's/-pooler\././')"

if [ -z "$direct_url" ]; then
  echo "No se encontró DATABASE_URL en .env.production" >&2
  exit 1
fi

if ! DATABASE_URL="$direct_url" pnpm exec dotenv -e .env.production -- prisma migrate deploy; then
  echo "" >&2
  echo "Falló la migración de producción." >&2
  echo "Si el error es un timeout del advisory lock, hay un lock huérfano (pgbouncer no lo" >&2
  echo "libera al desconectar el cliente): averiguá el pid que lo tiene con" >&2
  echo "  SELECT pid, granted FROM pg_locks WHERE locktype = 'advisory';" >&2
  echo "y terminá ese backend con  SELECT pg_terminate_backend(<pid>);" >&2
  echo "después volvé a correr este comando." >&2
  exit 1
fi
