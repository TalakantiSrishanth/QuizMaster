import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Questions from "./Questions.jsx";
import Options from "./Options.jsx";
import Appbar from "./Appbar";

function Display() {
  const { userid } = useParams();
  let [selected, setSelected] = useState(false);
  let [topic, setTopic] = useState("");
  let [type, setType] = useState("");

  function handleChange() {
    setSelected((prev) => !prev);
  }

  return (
    <>
      <Appbar id={userid}/>
   
      {selected ? (
        <Questions change={handleChange} topic={topic} type={type} userid={userid}/>
      ) : (
        <Options
          change={handleChange}
          changeTopic={setTopic}
          changeType={setType}
        />
      )}
    </>
  );
}

export default Display;
