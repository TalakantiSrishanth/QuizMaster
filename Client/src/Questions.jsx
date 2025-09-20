import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { PieChart } from '@mui/x-charts/PieChart';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useUser } from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/Questions.css";
import Showincorrect from "./Showincorrect.jsx";
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
        <Typography
          variant="caption"
          component="div"
          color="rgba(248, 246, 246, 0.8)"
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function Questions({ change, topic, type }) {
  let [data, setData] = useState([]);
  let [queindex, setIndex] = useState(0);
  let [choices, setChoices] = useState([]);
  let [review, setReview] = useState(null);
  let [suggestions, setSuggestions] = useState(null);
  let [incorrectReview, setIncorrectReview] = useState(false);
  let [score, setScore] = useState(null);
  let [finish, setFinish] = useState(false);
  let [pieData, setPieData] = useState([]);
  let [correct, setCorrect] = useState(0);
  let [incorrect, setIncorrect] = useState(0);
  let [unattempted, setUnattempted] = useState(0);
  let [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const { user } = useUser();
  const userid = user?.id;
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

  function handleFinal() {
    setFinish(true);
  }

  async function handleReview() {
    let response = await fetch("/api/review", {
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
  function handleIncorrect() {
    setIncorrectReview((prev) => !prev);
  }
 function calcTotal() {
  let correctCount = 0;
  let attempted = 0;
  let incorrectArr = [];

  data.forEach((q, idx) => {
    const choice = choices[idx];

    if (choice !== null) {
      attempted++;
      if (choice === q.answerIndex) {
        correctCount++;
      } else {
        
        incorrectArr.push({
          queindex: idx,
          userAnswer: q.options[choice],
          correctAnswer: q.options[q.answerIndex],
        });
      }
    } else {
      
      incorrectArr.push({
        queindex: idx,
        userAnswer: null,
        correctAnswer: q.options[q.answerIndex],
      });
    }
  });
  setIncorrectQuestions(incorrectArr);

  const unattemptedCount = data.length - attempted;
  const incorrectCount = attempted - correctCount;

  setScore(correctCount - incorrectCount);
  setCorrect(correctCount);
  setIncorrect(incorrectCount);
  setUnattempted(unattemptedCount);

  setPieData([
    { id: 0, value: correctCount, label: "Correct", color: "#4CAF50" },
    { id: 1, value: incorrectCount, label: "Incorrect", color: "#E3242B" },
    { id: 2, value: unattemptedCount, label: "Unattempted", color: "#D5EE19" },
  ]);
}



  async function handleFinish() {

    let response = await fetch("/api/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid,
        username: user.username,
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
  if (incorrectReview)
    return (
      <Showincorrect incorrectQuestions={incorrectQuestions} handleIncorrect={handleIncorrect} data={data}/>
    );
  if (data.length === 0)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-light" style={{ minHeight: "60vh" }}>
        <PacmanLoader
          color="#36d7b7"
          size={40}
          cssOverride={{
            border: "none",
            boxShadow: "none",
          }}
        />
        <p className="mt-4 fs-4 loading-text">Generating Questions</p>
      </div>

    );


  if (queindex >= data.length) {
    return finish ? (
      <div className="container text-center bg-dark text-light p-4 rounded">
        <h2>Your Final score is {score}</h2>
        <PieChart
          width={400}
          height={200}
          series={[
            {
              data: pieData,
            },
          ]}
        />

        {!suggestions && (
          <button className="btn btn-info mt-3" onClick={handleFinish}>
            Final Review
          </button>
        )}
        {suggestions && (
          <div className="mt-3">
            <h2>Your chance is {suggestions.chance}</h2>
            <h3>Suggested topics to improve:</h3>
            <p>{suggestions.suggestions}</p>
          </div>
        )}
        <button className="btn btn-warning mt-3" onClick={handleIncorrect} >Incorrect Questions</button>
        <button className="btn btn-primary mt-3" onClick={change}>
          New Test
        </button>
      </div>
    ) : (
      <div className="container text-center bg-dark text-light p-4 rounded">
        <button className="btn btn-success m-2" onClick={handleFinal}>
          Submit
        </button>
        <button className="btn btn-secondary m-2" onClick={handlePrev}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container bg-dark text-light p-4 rounded" style={{ minHeight: "400px" }}>
      <div className="d-flex justify-content-center mb-3">
        <CircularProgressWithLabel
          value={(queindex / data.length) * 100}
        />
      </div>

      <p className="text-center">Question {queindex + 1} of {data.length}</p>
      <h3 className="mb-3">{data[queindex].question}</h3>

      <div className="list-group">
        {data[queindex].options.map((opt, i) => {
          let btnClass = "btn btn-outline-light mb-2";

          if (review) {
            if (i === data[queindex].answerIndex) {
              btnClass = "btn btn-success mb-2";
            } else if (i === choices[queindex]) {
              btnClass = "btn btn-danger mb-2";
            } else {
              btnClass = "btn btn-outline-secondary mb-2";
            }
          } else if (choices[queindex] === i) {
            btnClass = "btn btn-warning mb-2";
          }

          return (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className={btnClass}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-3 d-flex justify-content-between ">
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
        {queindex > 0 && (
          <button className="btn btn-secondary" onClick={handlePrev}>
            Prev
          </button>
        )}
      </div>

      {type === "Practice" && (
        <div className="mt-3">
          <button className="btn btn-info" onClick={handleReview}>
            Review
          </button>
          {review && review.explanation && (
            <p className="mt-2 alert alert-light">{review.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Questions;
