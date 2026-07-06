import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

function Result() {
  const { sessionId } = useParams();

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/api/interview/result/${sessionId}`)
      .then((res) => setResult(res.data))
      .catch(console.error);
  }, [sessionId]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-6">
          🎉 Interview Completed
        </h1>

        <div className="space-y-2 mb-8">
          <p>
            <strong>Candidate:</strong> {result.candidate_name}
          </p>

          <p>
            <strong>Role:</strong> {result.role}
          </p>

          <p>
            <strong>Status:</strong> {result.status}
          </p>

          <p>
            <strong>Average Score:</strong> {result.average_score}/10
          </p>

          <p>
            <strong>Questions Answered:</strong>{" "}
            {result.questions_answered}
          </p>
        </div>

        <hr className="mb-8" />
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
  <h2 className="text-2xl font-bold mb-4">
    AI Overall Evaluation
  </h2>

  <pre className="whitespace-pre-wrap text-gray-700">
    {result.overall_evaluation}
  </pre>
</div>

        {result.results.map((item: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-5 mb-6"
          >
            <h2 className="font-bold text-xl mb-3">
              Question {index + 1}
            </h2>

            <p className="mb-4">
              {item.question}
            </p>

            <p>
              <strong>Your Answer:</strong>
            </p>

            <p className="mb-4">
              {item.answer}
            </p>

            <p>
              <strong>Score:</strong> {item.score}/10
            </p>

            <p className="mt-2">
              <strong>Feedback:</strong>
            </p>

            <p>{item.feedback}</p>
          </div>
        ))}

        <Link to="/">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Start New Interview
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Result;