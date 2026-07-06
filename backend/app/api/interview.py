from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import re

from app.db.session import get_db
from app.models.interview import (
    InterviewAnswer,
    InterviewQuestion,
    InterviewSession,
)
from app.schemas.interview import (
    InterviewCreate,
    AnswerRequest,
)
from app.services.gemini_service import (
    generate_questions,
    evaluate_answer,
    evaluate_interview,
)

router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.post("/start")
def start_interview(
    interview: InterviewCreate,
    db: Session = Depends(get_db),
):
    session = InterviewSession(
        candidate_name=interview.candidate_name,
        role=interview.role,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    questions = generate_questions(interview.role)

    saved_questions = []

    for index, question in enumerate(questions[:5], start=1):
        q = InterviewQuestion(
            session_id=session.id,
            question=question,
            order=index,
        )
        db.add(q)
        db.flush()
        saved_questions.append(q)

    db.commit()

    return {
        "session_id": session.id,
        "candidate_name": session.candidate_name,
        "role": session.role,
        "questions": [
            {
                "id": q.id,
                "order": q.order,
                "question": q.question,
            }
            for q in saved_questions
        ],
    }


@router.post("/answer")
def submit_answer(
    request: AnswerRequest,
    db: Session = Depends(get_db),
):
    question = db.get(InterviewQuestion, request.question_id)

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    result = evaluate_answer(
        question.question,
        request.answer,
    )

    score_match = re.search(r"Score:\s*(\d+)", result)
    feedback_match = re.search(
        r"Feedback:\s*(.*)",
        result,
        re.DOTALL,
    )

    score = int(score_match.group(1)) if score_match else 0
    feedback = (
        feedback_match.group(1).strip()
        if feedback_match
        else result
    )

    interview_answer = InterviewAnswer(
        question_id=question.id,
        answer=request.answer,
        score=score,
        feedback=feedback,
    )

    db.add(interview_answer)
    db.commit()

    return {
        "score": score,
        "feedback": feedback,
    }


@router.get("/result/{session_id}")
def interview_result(
    session_id: int,
    db: Session = Depends(get_db),
):
    session = db.get(InterviewSession, session_id)

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    results = []
    total_score = 0

    for question in session.questions:
        if question.answers:
            answer = question.answers[-1]

            total_score += answer.score

            results.append(
                {
                    "question": question.question,
                    "answer": answer.answer,
                    "score": answer.score,
                    "feedback": answer.feedback,
                }
            )

    average_score = (
        total_score / len(results)
        if results
        else 0
    )

    session.final_score = round(average_score)
    session.status = "completed"
    overall_evaluation = evaluate_interview(results)

    db.commit()

    return {
    "session_id": session.id,
    "candidate_name": session.candidate_name,
    "role": session.role,
    "status": session.status,
    "average_score": round(average_score, 2),
    "questions_answered": len(results),
    "results": results,
    "overall_evaluation": overall_evaluation,
}