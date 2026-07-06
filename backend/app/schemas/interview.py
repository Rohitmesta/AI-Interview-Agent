from pydantic import BaseModel, ConfigDict


class InterviewCreate(BaseModel):
    candidate_name: str
    role: str


class InterviewResponse(BaseModel):
    id: int
    candidate_name: str
    role: str
    status: str
    final_score: int | None = None

    model_config = ConfigDict(from_attributes=True)


class AnswerRequest(BaseModel):
    question_id: int
    answer: str


class AnswerResponse(BaseModel):
    score: int
    feedback: str