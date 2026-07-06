import time

from google import genai

from app.core.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


def generate_questions(role: str):
    prompt = f"""
You are an expert technical interviewer.

Generate exactly 5 interview questions for the role:

{role}

Return only the questions.
One question per line.
No numbering.
"""

    for _ in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            break
        except Exception:
            time.sleep(2)
    else:
        raise Exception("Gemini is temporarily unavailable. Please try again.")

    questions = [
        q.strip()
        for q in response.text.split("\n")
        if q.strip()
    ]

    return questions[:5]


def evaluate_answer(question: str, answer: str):
    prompt = f"""
You are an expert technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return ONLY in this format:

Score: <0-10>
Feedback: <short constructive feedback>
"""

    for _ in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            break
        except Exception:
            time.sleep(2)
    else:
        raise Exception("Gemini is temporarily unavailable. Please try again.")

    return response.text


def evaluate_interview(results: list):
    transcript = ""

    for index, item in enumerate(results, start=1):
        transcript += f"""
Question {index}
{item["question"]}

Candidate Answer
{item["answer"]}

Score
{item["score"]}/10

Feedback
{item["feedback"]}

---------------------------------------
"""

    prompt = f"""
You are a senior technical interviewer.

Below is a completed interview.

{transcript}

Based on the complete interview, provide:

Overall Score (0-10)

Strengths (bullet points)

Weaknesses (bullet points)

Hiring Recommendation

Overall Summary

Return ONLY in this format:

Overall Score:
...

Strengths:
- ...

Weaknesses:
- ...

Hiring Recommendation:
...

Overall Summary:
...
"""

    for _ in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            break
        except Exception:
            time.sleep(2)
    else:
        raise Exception("Gemini is temporarily unavailable. Please try again.")

    return response.text