import time

from google import genai

from app.core.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


def _generate_with_retry(prompt: str):
    """
    Calls Gemini with retry logic.
    Raises the original exception if all retries fail.
    """

    last_error = None

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            return response

        except Exception as e:
            last_error = e
            print(f"[Attempt {attempt + 1}] Gemini Error: {e}")

            if attempt < 2:
                time.sleep(2)

    raise last_error


def generate_questions(role: str):
    prompt = f"""
You are an expert technical interviewer.

Generate exactly 5 interview questions for the role:

{role}

Return only the questions.
One question per line.
No numbering.
"""

    response = _generate_with_retry(prompt)

    questions = [
        question.strip()
        for question in response.text.split("\n")
        if question.strip()
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

    response = _generate_with_retry(prompt)

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

    response = _generate_with_retry(prompt)

    return response.text