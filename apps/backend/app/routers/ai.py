from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models import User
from app.schemas import AIGenerateRequest, AIGenerateResponse

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/generate", response_model=AIGenerateResponse)
def generate(
    body: AIGenerateRequest,
    _: User = Depends(get_current_user),
):
    return AIGenerateResponse(
        text="[AI mock] Сгенерированный текст по запросу. "
        f"Длина промпта: {len(body.prompt)} символов."
    )
