import React, { useState } from "react";
import axios from "axios";
import "../../styles/RegisterPage.css";



const RegisterPage = ({ setSeasons }) => {
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participant, setParticipant] = useState({
    name: "",
    fase: 0,
    r1: 0,
    r2: 0,
    r3: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const addParticipant = () => {
    if (!participant.name.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    setCurrentParticipants([
      ...currentParticipants,
      {
        ...participant,
        fase: Number(participant.fase),
        r1: Number(participant.r1),
        r2: Number(participant.r2),
        r3: Number(participant.r3),
        total:
          Number(participant.r1) +
          Number(participant.r2) +
          Number(participant.r3),
      },
    ]);

    resetForm();
  };

  const editParticipant = (index) => {
    setParticipant(currentParticipants[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const saveEdit = () => {
    if (!participant.name.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    const updated = [...currentParticipants];
    updated[editIndex] = {
      ...participant,
      fase: Number(participant.fase),
      r1: Number(participant.r1),
      r2: Number(participant.r2),
      r3: Number(participant.r3),
      total:
        Number(participant.r1) +
        Number(participant.r2) +
        Number(participant.r3),
    };

    setCurrentParticipants(updated);
    resetForm();
  };

  const resetForm = () => {
    setParticipant({ name: "", fase: 0, r1: 0, r2: 0, r3: 0 });
    setIsEditing(false);
    setEditIndex(null);
  };

  const finalizeSeason = async () => {
    if (currentParticipants.length === 0) {
      alert("Não há participantes para finalizar a temporada.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Por favor, informe a data de início e fim da temporada.");
      return;
    }
    if (startDate > endDate) {
      alert("A data de início não pode ser maior que a data de fim.");
      return;
    }

    if (!window.confirm("Confirma finalizar a temporada?")) return ;

    try {
      const response = await axios.post("http://localhost:5000/seasons", {
        startDate,
        endDate,
        participants: currentParticipants,
      });

      alert(response.data.message);
      setSeasons((prev) => [
        ...prev,
        { startDate, endDate, participants: currentParticipants },
      ]);

      setCurrentParticipants([]);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar temporada.");
    }
  };

  const deleteParticipant = (index) => {
  if (window.confirm("Deseja realmente excluir este participante?")) {
    const updated = [...currentParticipants];
    updated.splice(index, 1);
    setCurrentParticipants(updated);
  }
};

  const containerStyle = {
    maxWidth: 700,
    margin: "20px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const formRow = {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  };

  const inputStyle = {
    flex: 1,
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    fontSize: 14,
    color: "#333",
  };

  const buttonStyle = {
    padding: "10px 16px",
    backgroundColor: "#1976d2",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: "#999",
    cursor: "not-allowed",
  };

  const editBtnStyle = {
    marginLeft: 10,
    padding: "4px 10px",
    fontSize: 14,
    backgroundColor: "#ffa000",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  };

  const deleteBtnStyle = {
  marginLeft: 10,
  padding: "4px 10px",
  fontSize: 14,
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Registrar Membro
      </h1>

      <div style={formRow}>
        <input
          type="text"
          placeholder="Nome"
          style={inputStyle}
          value={participant.name}
          onChange={(e) =>
            setParticipant({ ...participant, name: e.target.value })
          }
        />
        
        <input
          type="number"
          min="0"
          placeholder="Fase de Acesso"
          style={inputStyle}
          value={participant.fase}
          onChange={(e) =>
            setParticipant({ ...participant, fase: e.target.value })
          }
        />
      </div>

      <div style={formRow}>
        <input
          type="number"
          min="0"
          placeholder="1ª Rodada"
          style={inputStyle}
          value={participant.r1}
          onChange={(e) =>
            setParticipant({ ...participant, r1: e.target.value })
          }
        />
        <input
          type="number"
          min="0"
          placeholder="2ª Rodada"
          style={inputStyle}
          value={participant.r2}
          onChange={(e) =>
            setParticipant({ ...participant, r2: e.target.value })
          }
        />
        <input
          type="number"
          min="0"
          placeholder="3ª Rodada"
          style={inputStyle}
          value={participant.r3}
          onChange={(e) =>
            setParticipant({ ...participant, r3: e.target.value })
          }
        />
      </div>

      {isEditing ? (
        <button style={buttonStyle} onClick={saveEdit}>
          Salvar Edição
        </button>
      ) : (
        <button style={buttonStyle} onClick={addParticipant}>
          Adicionar Participante
        </button>
      )}

      <h2 style={{ marginTop: 32 }}>Participantes Atuais</h2>
{currentParticipants.length === 0 && <p>Nenhum participante adicionado.</p>}
<ul style={{ paddingLeft: 0, listStyle: "none" }}>
  {[...currentParticipants]
    .sort((a, b) => b.fase - a.fase)
    .map((p, i) => (
      <li
        key={i}
        style={{
          marginBottom: 8,
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: 6,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginRight: 10,
            width: 24,
            textAlign: "right",
          }}
        >
          {i + 1}.
        </span>
        <span style={{ flex: 1 }}>
          <strong>{p.name}</strong>: <br /> 
          Fase de Acesso:  {p.fase} <br /> <hr />
          1° Rodada:  {p.r1} <br />
          2° Rodada:  {p.r2} <br />
          3° Rodada:  {p.r3} <br />
          <b>Total:  {p.total}</b>
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
  <button style={editBtnStyle} onClick={() => editParticipant(i)}>
    Editar
  </button>
  <button style={deleteBtnStyle} onClick={() => deleteParticipant(i)}>
    Excluir
  </button>
</div>
      </li>
    ))}
</ul>


      <h2 style={{ marginTop: 32 }}>Datas da Temporada</h2>
      <div style={formRow}>
        <label style={labelStyle}>
          Data Início:
          <input
            type="date"
            style={inputStyle}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={labelStyle}>
          Data Fim:
          <input
            type="date"
            style={inputStyle}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <button
        style={
          currentParticipants.length === 0 || !startDate || !endDate
            ? buttonDisabledStyle
            : buttonStyle
        }
        onClick={finalizeSeason}
        disabled={currentParticipants.length === 0 || !startDate || !endDate}
            // {isLoading ?
              
            // }
      >
        Finalizar Temporada
      </button>
    </div>
  );
};

export default RegisterPage;
