from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.interview import InterviewSession
from app.schemas.interview import InterviewCreate, InterviewResponse

router = APIRouter(prefix="/api/interviews", tags=["Interview"])


@router.post("/", response_model=InterviewResponse)
def create_interview(
    interview: InterviewCreate,
    db: Session = Depends(get_db),
):
    new_interview = InterviewSession(
        candidate_name=interview.candidate_name,
        role=interview.role,
    )

    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)

    return new_interview