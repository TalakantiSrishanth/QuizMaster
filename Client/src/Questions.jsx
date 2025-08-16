import { useState, useEffect } from "react";

function Questions({ change, topic,type}) {
  let [data, setData] = useState([]);
  let [queindex, setIndex] = useState(0);
  let [choices, setChoices] = useState([]);  
  let [review, setReview] = useState(null);
  let [suggestions, setSuggestions] = useState(null);
  let [score, setScore] = useState(null);  
  let [finish,setFinish]=useState(false); 
  useEffect(() => {
  if (queindex >= data.length) {
    calcTotal();
  }
}, [queindex]);

  useEffect(() => {
    async function getdata() {
      const res = await fetch("/api/mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      let d = await res.json();
      setData(d);
      setChoices(Array(d.length).fill(null)); 
    }
    getdata();
  }, [topic]);

  function handleChoice(i) {
    
    setChoices((prev) => {
      const updated = [...prev];
      updated[queindex] = i;
      return updated;
    });
  }

  function handleNext() {
    if (queindex < data.length) {
      setIndex((prev) => prev + 1);
      setReview(null);
    }
  }

  function handlePrev() {
    if (queindex > 0) {
      setIndex((prev) => prev - 1);
      setReview(null);
    }
  }
  function handleFinal(){
    setFinish(true);
  }
  async function handleReview() {
    if (!data[queindex] || choices[queindex] === null) return;

    let response = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: data[queindex].question,
        choice: data[queindex].options[choices[queindex]],
      }),
    });

    let result = await response.json();
    setReview(result);
  }
  function calcTotal(){
     let total = 0;
    data.forEach((q, idx) => {
      if (choices[idx] === q.answerIndex) total++;
    });
    setScore(total);
  }
  async function handleFinish() {

    let response = await fetch("/api/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: score,
        topic: topic,
      }),
    });
    let result = await response.json();
    setSuggestions(result);
  }

  if (data.length === 0) return <p>Loading...</p>;

  if (queindex >= data.length) {
    return ( 
     finish?  <div>
        <h2>Your Final score is {score}</h2>
        {!suggestions && <button onClick={handleFinish}>Final Review</button>}
        {suggestions && (
          <div>
            <h2>Your chance is {suggestions.chance}</h2>
            <h2>{suggestions.suggestions}</h2>
          </div>
        )}
      </div> : <> <div> <button onClick={handleFinal}>Submit</button></div>  <div> <button onClick={handlePrev}>Back</button> </div> </>
    );
  }

  return (
    <div>
      <p>Question {queindex + 1} of {data.length}</p>
      <h3>{data[queindex].question}</h3>
      <ul>
        {data[queindex].options.map((opt, i) => (
          <li key={i}>
            <button
              onClick={() => handleChoice(i)}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={handleNext}>
          Next
        </button>
        {queindex > 0 && <button onClick={handlePrev}>Prev</button>}
      </div>

      {type=="Practice"  && <> <button onClick={handleReview}>Review</button>
      {review && review.explanation && <p>{review.explanation}</p>} </> }
    </div>
  );
}

export default Questions;
