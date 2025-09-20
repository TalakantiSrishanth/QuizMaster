import { useState } from "react";
import Questions from "./Questions.jsx";
import Options from "./Options.jsx";
import Appbar from "./Appbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/Display.css";

function Display() {
  const [selected, setSelected] = useState(false);
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");

  function handleChange() {
    setSelected((prev) => !prev);
  }

  return (
    <div className="app-container">
      <Appbar value={false}/>

      <main className="display-wrapper">
        <div className="card shadow-lg p-4 rounded-4">
          {selected ? (
            <Questions change={handleChange} topic={topic} type={type} />
          ) : (
            <Options
              change={handleChange}
              changeTopic={setTopic}
              changeType={setType}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Display;
