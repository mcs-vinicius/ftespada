import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import RegisterPage from "./components/ranking/RegisterPage.jsx";
import ResultsPage from "./components/ranking/ResultsPage.jsx";

const App = () => {
  const [seasons, setSeasons] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState([]);

  const addParticipant = (participant) => {
    setCurrentParticipants((prev) => [...prev, participant]);
  };

  return (
    <div className="container">
      <nav>
        <Link to="/" style={{ marginRight: "15px" }}>
          Registrar Participante
        </Link>
        <Link to="/resultados">Resultados</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <RegisterPage
              currentParticipants={currentParticipants}
              onAdd={addParticipant}
              seasons={seasons}
              setSeasons={setSeasons}
              setCurrentParticipants={setCurrentParticipants}
            />
          }
        />
        <Route path="/resultados" element={<ResultsPage seasons={seasons} />} />
      </Routes>
    </div>
  );
};

export default App;
