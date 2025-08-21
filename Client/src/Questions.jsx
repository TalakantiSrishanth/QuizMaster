import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { PieChart } from '@mui/x-charts/PieChart';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const color = "#36d7b7";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
function CircularProgressWithLabel({ value }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" value={value} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="rgba(248, 246, 246, 0.8)">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
function Questions({ change, topic, type,userid }) {
  let [data, setData] = useState([]);
  let [queindex, setIndex] = useState(0);
  let [choices, setChoices] = useState([]);
  let [review, setReview] = useState(null);
  let [suggestions, setSuggestions] = useState(null);
  let [score, setScore] = useState(null);
  let [finish, setFinish] = useState(false);
  let [pieData, setPieData] = useState([]);
  let [correct, setCorrect] = useState(0);
let [incorrect, setIncorrect] = useState(0);
let [unattempted, setUnattempted] = useState(0);

  useEffect(() => {
    if (queindex >= data.length) {
      calcTotal();
    }
  }, [queindex]);

  useEffect(() => {
    async function getdata() {
      const res = await fetch("http://localhost:5000/api/mcqs", {
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
  function handleFinal() {
    setFinish(true);
  }
  async function handleReview() {

    let response = await fetch("http://localhost:5000/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: data[queindex].question,
        selectedAnswer: data[queindex].options[choices[queindex]],
      }),
    });

    let result = await response.json();
    setReview(result);
  }
 
 function calcTotal() {
  let correctCount = 0;
  let attempted = 0;

  data.forEach((q, idx) => {
    const choice = choices[idx];
    if (choice !== null) {
      attempted++;
      if (choice === q.answerIndex) correctCount++;
    }
  });

  const unattemptedCount = data.length - attempted;
  const incorrectCount = attempted - correctCount;

  setScore(correctCount);
  setCorrect(correctCount);
  setIncorrect(incorrectCount);
  setUnattempted(unattemptedCount);

  setPieData([
    { label: "Correct", value: correctCount, color: '#4CAF50' },
    { label: "Incorrect", value: incorrectCount, color: '#E3242B' },
    { label: "Unattempted", value: unattemptedCount, color: 'rgba(213, 238, 25, 1)' },
  ]);
}

  async function handleFinish() {

    let response = await fetch("http://localhost:5000/api/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      userid,         
      score,
      topic,
      correct,
      incorrect,
      unattempted,
    }),
    });
    let result = await response.json();
    setSuggestions(result);
  }

  if (data.length === 0) return  ( <div><PacmanLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      /><div> <p> Generating Questions...</p> </div></div>);

  if (queindex >= data.length) {
    return (
      finish ? <div>
        <h2>Your Final score is {score}</h2>
         <PieChart series={[{ data: pieData }]} width={300} height={300} />
        {!suggestions && <button onClick={handleFinish}>Final Review</button>}
        {suggestions && (
          <div>
            <h2>Your chance is {suggestions.chance}</h2>
            <h2>{suggestions.suggestions}</h2>
          </div>
        )}
        <button onClick={change}> New Test</button>
      </div> : <> <div> <button onClick={handleFinal}>Submit</button></div>  <div> <button onClick={handlePrev}>Back</button> </div> </>
    );
  }

  return (
    <div>
      <CircularProgressWithLabel 
  value={((queindex) / data.length) * 100} 
/>

      <p>Question {queindex + 1} of {data.length}</p>
      <h3>{data[queindex].question}</h3>
      <ul>
        {data[queindex].options.map((opt, i) => {
          let style = {};
          if (review) {
            if (i === data[queindex].answerIndex) {
              style = { backgroundColor: "lightgreen" };
            } else if (i === choices[queindex]) {
              style = { backgroundColor: "salmon" };
            }
          }
         return( <li key={i}>
            <button
              onClick={() => handleChoice(i)} style={style}
            >
              {opt}
            </button>
          </li> );
        })}
      </ul>

      <div>
        <button onClick={handleNext}>
          Next
        </button>
        {queindex > 0 && <button onClick={handlePrev}>Prev</button>}
      </div>

      {type == "Practice" && <> <button onClick={handleReview}>Review</button>
      {review && review.explanation && <p>{review.explanation}</p>} </>}
    </div>
  );
}

export default Questions;
