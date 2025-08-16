import { useState } from "react";

function Options({ change, changeTopic,changeType}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target.topic.value;
    const type=e.target.type.value;
    change();
    changeTopic(topic);
    changeType(type);
  };

  return (
    <form onSubmit={handleSubmit}>
     <div> <label>
        Choose a topic:
        <select name="topic">
          <option value="DSA">DSA</option>
          <option value="DBMS">DBMS</option>
          <option value="OOPS">OOPS</option>
          <option value="OS">OS</option>
        </select>
      </label>
      </div>
      <div>
       <label>
        Choose type:
        <select name="type">
          <option value="Test">Test</option>
          <option value="Practice">Practice</option>
        </select>
      </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Options;
