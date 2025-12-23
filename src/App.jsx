// Updated: src/App.jsx (Simplified: Single protected route rendering the container)
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedApp from "./components/ProtectedApp";  // New: Renders all sections

function App() {
  const user = localStorage.getItem("user");

  return (
    <Routes>
      {/* FIRST PAGE */}
      <Route path="/" element={<Signup />} />

      {/* AUTH */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* PROTECTED: Single route for all sections */}
      <Route
        path="/dashboard"
        element={user ? <ProtectedApp /> : <Navigate to="/login" />}
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;