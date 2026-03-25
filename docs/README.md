# Документация

## Структура репозитория

| Папка | Назначение |
|--------|------------|
| `docs/` | Документация (этот каталог) |
| `frontend/` | React + Vite + TypeScript (деплой: Vercel, корень проекта — `frontend/`) |
| `backend/` | FastAPI + SQLAlchemy + Alembic (деплой: Amvera, контекст сборки — `backend/`) |
| `tests/e2e/` | Playwright end-to-end тесты |

Папка **`apps/`** не используется — устаревший дубликат. Удалите её вручную, если осталась (если файлы заняты — см. [remove-apps-folder.md](./remove-apps-folder.md)).

## Быстрый старт

1. Зависимости: `npm install` в корне и в `frontend/`; `pip install -r backend/requirements.txt`.
2. Переменные окружения: см. [ENVIRONMENT.md](./ENVIRONMENT.md).
3. Миграции (из каталога `backend/`): `alembic upgrade head`.
4. Запуск: из корня `npm run dev` → фронт http://localhost:5173, API :8000.

Подробности по деплою — в `backend/Dockerfile`, `backend/amvera.yml`, `frontend/vercel.json`.
