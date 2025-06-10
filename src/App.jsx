import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom"; // Import Navigate for protected routes

import RegisterPage from "./components/ranking/RegisterPage.jsx";
import ResultsPage from "./components/ranking/ResultsPage.jsx";
import LoginPage from "./components/auth/LoginPage.jsx"; // Import LoginPage
import RegisterUserPage from "./components/auth/RegisterUserPage.jsx"; // Import RegisterUserPage

const App = () => {
  const [seasons, setSeasons] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

  // Function to handle successful login
  const handleLogin = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token); // Store token in local storage
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken"); // Remove token from local storage
  };

  // Check authentication status on component mount
  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // In a real application, you'd want to validate this token with your backend
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="container">
      <nav>
        {isAuthenticated ? (
          <>
            <Link to="/register" style={{ marginRight: "15px" }}>
              Registrar Participante
            </Link>
            <Link to="/resultados" style={{ marginRight: "15px" }}>
              Resultados
            </Link>
            <button onClick={handleLogout} style={{ marginLeft: "auto", padding: "8px 12px", borderRadius: "4px", border: "none", backgroundColor: "#d32f2f", color: "white", cursor: "pointer" }}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "15px" }}>
              Login
            </Link>
            <Link to="/register-user">
              Cadastrar Usuário
            </Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register-user" element={<RegisterUserPage />} />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <RegisterPage setSeasons={setSeasons} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/resultados" element={<ResultsPage seasons={seasons} />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/register" : "/login"} replace />} />
      </Routes>
    </div>
  );
};

export default App;