import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function StartInterview() {
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const startInterview = async () => {
    try {
      const response = await api.post("/api/interview/start", {
        candidate_name: candidateName,
        role: role,
      });

      console.log(response.data);

      navigate("/interview", {
        state: response.data,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to start interview.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6">
          AI Interview Agent
        </h1>

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button
          onClick={startInterview}
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

export default StartInterview;