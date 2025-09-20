import "bootstrap/dist/css/bootstrap.min.css";

function Options({ change, changeTopic, changeType }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const topic = e.target.topic.value;
    const type = e.target.type.value;
    change();
    changeTopic(topic);
    changeType(type);
  };

  return (
    <form onSubmit={handleSubmit} className="p-1" style={{ maxWidth: "700px", margin: "auto", marginTop: "2rem" }}>
      <div className="mb-3">
        <label htmlFor="topic" className="form-label fw-bold text-light">
          Choose a topic:
        </label>
        <select className="form-select" name="topic" id="topic">
          <option value="DSA">DSA</option>
          <option value="DBMS">DBMS</option>
          <option value="OOPS">OOPS</option>
          <option value="OS">OS</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="type" className="form-label fw-bold text-light">
          Choose type:
        </label>
        <select className="form-select" name="type" id="type">
          <option value="Test">Test</option>
          <option value="Practice">Practice</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Submit
      </button>
    </form>
  );
}

export default Options;
