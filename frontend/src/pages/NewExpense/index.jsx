import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newexpense.css";

const categories = [
  { id: "casa",        label: "Casa" },
  { id: "compras",     label: "Compras" },
  { id: "alimentacao", label: "Alimentação" },
  { id: "outros",      label: "Outros" },
];

const NewExpense = () => {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [price, setPrice]       = useState("");
  const [category, setCategory] = useState(null);
  const [notes, setNotes]       = useState("");

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = (parseInt(raw || "0", 10) / 100).toFixed(2);
    setPrice(raw === "" ? "" : num);
  };

  const displayPrice = price === ""
    ? ""
    : parseFloat(price).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  const canSave = name.trim() !== "" && price !== "" && category !== null;

  const handleSave = () => {
    if (!canSave) return;
    navigate("/dashboard");
  };

  return (
    <div className="ne-root">
      <div className="ne-glow ne-glow--top" />

      <header className="ne-header">
        <button className="ne-back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="ne-title">Nova Despesa</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="ne-body">
        <div className="ne-field">
          <label className="ne-label">Nome da Despesa</label>
          <input
            className="ne-input"
            type="text"
            placeholder="Ex: Conta de Luz"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="ne-field">
          <label className="ne-label">Preço</label>
          <input
            className="ne-input"
            type="text"
            inputMode="numeric"
            placeholder="0,00"
            value={displayPrice}
            onChange={handlePriceChange}
          />
        </div>

        <div className="ne-field">
          <label className="ne-label">Categoria</label>
          <div className="ne-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`ne-cat-btn${category === cat.id ? " ne-cat-btn--active" : ""}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ne-field">
          <label className="ne-label">Notas</label>
          <textarea
            className="ne-textarea"
            placeholder="Observações sobre o item..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>
      </div>

      <div className="ne-footer">
        <button
          className={`ne-save-btn${!canSave ? " ne-save-btn--disabled" : ""}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Salvar Despesa
        </button>
      </div>
    </div>
  );
};

export default NewExpense;