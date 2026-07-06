import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartInterview from "./pages/StartInterview";
import Interview from "./pages/Interview";
import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartInterview />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result/:sessionId" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;