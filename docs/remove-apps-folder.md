# Удаление устаревшей папки `apps/`

Рабочие каталоги — **`frontend/`** и **`backend/`** в корне. `package.json` ссылается только на них.

**`apps/`** — дубликат после переезда; её можно удалить.

## Если «файл занят» (SQLite / dev-сервер)

1. Остановите **`npm run dev`** и процессы Uvicorn/Python.
2. При необходимости перезапустите IDE.
3. В PowerShell из корня репозитория:

```powershell
Remove-Item -Recurse -Force .\apps
```

Или сначала базы в `apps`, затем папку:

```powershell
Remove-Item -Force .\apps\backend\*.sqlite, .\apps\backend\local.db -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\apps
```

Актуальные данные приложения — в **`backend/local.db`**, не в `apps/`.
