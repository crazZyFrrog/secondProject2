import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlalchemy.orm import Session

_tmp = tempfile.mkdtemp()
_db_file = Path(_tmp) / "test.db"
os.environ["JWT_SECRET"] = "test-jwt-secret-key-32chars!!"
os.environ["CORS_ORIGINS"] = "http://localhost:5173"
os.environ["DATABASE_URL"] = f"sqlite:///{_db_file.as_posix()}"

from app.database import Base, engine, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Project, User  # noqa: E402

Base.metadata.create_all(bind=engine)


def _clear_tables() -> None:
    with Session(engine) as s:
        s.execute(delete(Project))
        s.execute(delete(User))
        s.commit()


@pytest.fixture(autouse=True)
def _reset_db():
    _clear_tables()
    yield
    _clear_tables()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
