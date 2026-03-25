from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    email: EmailStr | None = None


class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class ProjectCreate(ProjectBase):
    content: dict | None = None


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    content: dict | None = None


class ProjectOut(ProjectBase):
    id: int
    user_id: int
    content: dict

    model_config = {"from_attributes": True}


class AIGenerateRequest(BaseModel):
    prompt: str = Field(default="", max_length=2000)


class AIGenerateResponse(BaseModel):
    text: str
