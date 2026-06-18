import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import EmailCapture from "./pages/EmailCapture";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/resultats" element={<Results />} />
      <Route path="/email-capture" element={<EmailCapture />} />
    </Routes>
  );
}

export default App;
