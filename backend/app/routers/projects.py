from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Project, User
from app.constants import DEFAULT_PROJECT_CONTENT
from app.schemas import ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
def list_projects(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.scalars(
        select(Project).where(Project.user_id == user.id).order_by(Project.id.desc())
    ).all()
    return rows


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = body.content if body.content is not None else DEFAULT_PROJECT_CONTENT
    p = Project(user_id=user.id, name=body.name, content=content)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = db.get(Project, project_id)
    if p is None or p.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    return p


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    body: ProjectUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = db.get(Project, project_id)
    if p is None or p.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    if body.name is not None:
        p.name = body.name
    if body.content is not None:
        p.content = body.content
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = db.get(Project, project_id)
    if p is None or p.user_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p)
    db.commit()
    return None
