#!/bin/sh
set -e

echo "=== SDE Hub startup ==="
echo "PORT=$PORT"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo YES || echo NO)"
echo "REDIS_URL set:    $([ -n "$REDIS_URL" ] && echo YES || echo NO)"
echo "OPENAI_API_KEY set: $([ -n "$OPENAI_API_KEY" ] && echo YES || echo NO)"

echo ""
echo "--- Step 1: Waiting for database ---"
MAX_RETRIES=30
RETRY=0
until python -c "
import os, sys
try:
    import psycopg2
    url = os.environ.get('DATABASE_URL','')
    if url.startswith('postgres://'):
        url = url.replace('postgres://', 'postgresql://', 1)
    conn = psycopg2.connect(url)
    conn.close()
    print('  DB ping OK', flush=True)
    sys.exit(0)
except Exception as e:
    print(f'  DB not ready: {e}', flush=True)
    sys.exit(1)
"; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: DB never became ready. Aborting."
    exit 1
  fi
  echo "  Attempt $RETRY/$MAX_RETRIES — retrying in 3s..."
  sleep 3
done

echo ""
echo "--- Step 2: Running Alembic migrations ---"
alembic upgrade head
echo "Migrations done."

echo ""
echo "--- Step 3: Verifying app imports ---"
python -c "from app.main import app; print('App import OK')"

echo ""
echo "--- Step 4: Starting uvicorn on port ${PORT:-8000} ---"
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
