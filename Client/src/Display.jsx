import { useState } from "react";
import Questions from "./Questions.jsx";
import Options from "./Options.jsx";

function Display() {
  let [selected, setSelected] = useState(false);
  let [topic, setTopic] = useState("");
  let [type,setType]=useState("");

  function handleChange() {
    setSelected(prev => !prev);
  }

  function changeTopic(text) {
    setTopic(text);
  }
  function changeType(text){
    setType(text);
  }

  return (
    <>
      {selected
        ? <Questions change={handleChange} topic={topic} type={type} />
        : <Options change={handleChange} changeTopic={changeTopic} changeType={changeType} />}
    </>
  );
}

export default Display;
