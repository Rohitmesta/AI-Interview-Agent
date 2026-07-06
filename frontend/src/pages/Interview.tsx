import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          No interview found.
        </h1>
      </div>
    );
  }

  const question = data.questions[currentQuestion];

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/interview/answer", {
        question_id: question.id,
        answer: answer,
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to submit answer.");
    }

    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < data.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setResult(null);
    } else {
      navigate(`/result/${data.session_id}`);
    }
  };

  const progress =
    ((currentQuestion + 1) / data.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          AI Interview
        </h1>

        <p className="text-gray-600 mb-6">
          Session ID: {data.session_id}
        </p>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span>
              Question {currentQuestion + 1} of {data.questions.length}
            </span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-5">
            {question.question}
          </h2>

          <textarea
            rows={8}
            className="border rounded-lg w-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={result !== null}
          />
        </div>

        {/* Submit */}
        {!result ? (
          <button
            onClick={submitAnswer}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        ) : (
          <>
            <div className="mt-6 bg-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Score: {result.score}/10
              </h2>

              <h3 className="font-semibold mb-2">
                Feedback
              </h3>

              <p>{result.feedback}</p>
            </div>

            <div className="mt-6">
              <button
                onClick={nextQuestion}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                {currentQuestion === data.questions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Interview;