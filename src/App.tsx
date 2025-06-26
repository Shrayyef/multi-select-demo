import "./App.scss";
import { useState } from "react";
import { MultiSelect } from "./components/MultiSelect";
import type { MultiSelectOption } from "./components/MultiSelect";

const options: MultiSelectOption[] = [
  { label: "Education 🎓", value: "education" },
  { label: "Yeeeah, science! 🧪", value: "science" },
  { label: "Art 🖼️", value: "art" },
  { label: "Sport ⚽", value: "sport" },
  { label: "Games 🎮", value: "games" },
  { label: "Health 🧰", value: "health" },
];

function App() {
  const [selected, setSelected] = useState<MultiSelectOption[]>([]);

  return (
    <div className="app">
      <div
        style={{
          width: 500,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(60, 80, 180, 0.08)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>
          Please select your interests
        </h1>
        <MultiSelect
          options={options}
          value={selected}
          onChange={setSelected}
          placeholder="Science"
        />
      </div>
    </div>
  );
}

export default App;
