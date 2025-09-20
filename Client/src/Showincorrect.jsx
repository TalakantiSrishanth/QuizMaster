import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
function Showincorrect({incorrectQuestions, handleIncorrect,data}){
    let [curr,setCurr]=useState(0);
   function handleNext(){
        setCurr(prev=>prev+1);
    }
    function handlePrev(){
        setCurr(prev=>prev-1);
    }
    if(incorrectQuestions.length==0)
        return(
    <h2>No Incorrect or Unattempted Questions</h2>
    );
    if(curr+1>incorrectQuestions.length){
      return(
    <div className="card">
      <div className="card-body">
        <h2 className="card-text text-center text-primary mb-4">You reached the end</h2>
        <button onClick={()=> handleIncorrect()} className="btn btn-success">Back</button>
      </div>
      </div>
    );}
    return(
        <>
        <div className="container bg-dark text-light p-4 rounded">
          <div>
            <button onClick={()=> handleIncorrect()} className="btn btn-success">Back</button>
          </div>
      <div className="d-flex justify-content-center mb-3">
        <CircularProgressWithLabel
          value={(curr / incorrectQuestions.length) * 100}
        />
      </div>
      <p className="text-center">Question {curr + 1} of {incorrectQuestions.length}</p>
      <h3 className="mb-3">{data[incorrectQuestions[curr].queindex].question}</h3>

      <div className="list-group">
        {data[incorrectQuestions[curr].queindex].options.map((opt, i) => {
          return (
            <strong>{opt}</strong>
          );
        
        })}
      </div>

      <div className="mt-3 d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
        {curr > 0 && (
          <button className="btn btn-secondary" onClick={handlePrev}>
            Prev
          </button>
        )}
      </div>
      </div>
        </>
    );

}
export default Showincorrect;