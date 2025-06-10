import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ResultsPage.css";

const ResultsPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // será ajustado dinamicamente

  useEffect(() => {
    async function fetchSeasons() {
      try {
        const response = await axios.get("http://localhost:5000/seasons");
        const data = response.data;
        setSeasons(data);

        // Atualiza para exibir a última temporada (a mais recente)
        if (data.length > 0) {
          setCurrentPage(data.length); // último índice baseado em 1
        }
      } catch (error) {
        console.error("Erro ao buscar temporadas:", error);
      }
    }
    fetchSeasons();
  }, []);

  const totalPages = seasons.length;
  const season = seasons[currentPage - 1]; // mantém lógica de paginação

  const formatDateBR = (dateStr) => {
    const [year, month, day] = dateStr.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <h1 className="title">Temporadas Anteriores</h1>

      {season ? (
        <>
          <div className="season-info">
            Temporada {currentPage} - {formatDateBR(season.start_date)} até{" "}
            {formatDateBR(season.end_date)}
          </div>

          <div className="tables-container">
            {/* Rank de Acesso */}
            <div className="table-wrapper">
              <div className="table-title">Rank de Acesso</div>
              <table>
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Nome</th>
                    <th>Fase de Acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {[...season.participants]
                    .sort((a, b) => b.fase - a.fase)
                    .map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}º</td>
                        <td>{p.name}</td>
                        <td>{p.fase}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Expedição Lunar */}
            <div className="table-wrapper">
              <div className="table-title">Expedição Lunar</div>
              <table>
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Nome</th>
                    <th>1ª Rodada</th>
                    <th>2ª Rodada</th>
                    <th>3ª Rodada</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...season.participants]
                    .map((p) => ({
                      ...p,
                      total: p.r1 + p.r2 + p.r3,
                    }))
                    .sort((a, b) => b.total - a.total)
                    .map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}º</td>
                        <td>{p.name}</td>
                        <td>{p.r1}</td>
                        <td>{p.r2}</td>
                        <td>{p.r3}</td>
                        <td>{p.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Anterior
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo &gt;
            </button>
          </div>
        </>
      ) : (
        <p>Nenhuma temporada encontrada.</p>
      )}
    </div>
  );
};

export default ResultsPage;
