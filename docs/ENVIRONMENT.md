# Переменные окружения

## Backend — файл `backend/.env`

Скопируйте из `backend/.env.example` и заполните.

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL: `postgresql+psycopg://user:pass@host:5432/dbname`. Локально можно SQLite: `sqlite:///./local.db` |
| `JWT_SECRET` | Секрет подписи JWT (в продакшене — длинная случайная строка) |
| `CORS_ORIGINS` | Разрешённые origin фронта. Несколько значений через **запятую** или **точку с запятой** (`;` удобнее в Windows-скриптах) |

На Amvera строка подключения к БД обычно приходит в `DATABASE_URL`.

### Локальная разработка без отдельного PostgreSQL

Пример `backend/.env`:

```env
DATABASE_URL=sqlite:///./local.db
JWT_SECRET=dev-only-replace-in-production-min-32-chars-long-xx
CORS_ORIGINS=http://localhost:5173;http://127.0.0.1:5173
```

Для e2e корневой `npm run dev:e2e` подставляет свои значения (SQLite `e2e.sqlite`, флаг `AUTO_CREATE_TABLES`).

## Frontend — опционально `frontend/.env`

| Переменная | Описание |
|------------|----------|
| `VITE_API_URL` | Полный URL API (на Vercel укажите URL бэкенда на Amvera). В локальном `npm run dev` можно не задавать: запросы идут на `/api` через прокси Vite |

## Продакшен (памятка)

- **Vercel**: root directory = `frontend`, задать `VITE_API_URL`.
- **Amvera**: сборка из `backend/` (Dockerfile), в окружении — `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (домен фронта на Vercel).
