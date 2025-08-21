const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/QuizAI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});
const userSchema=new mongoose.Schema({
 username: String,
  password: String,
  scores: [
    {
      topic: String,
      score: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});
const User=mongoose.model('User',userSchema);

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyAksY2CQC5A91zSmHIXg5__5mL3_J4HMnY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.post("/login",async (req,res)=>{
  const {username,password}=req.body;
  const existingUser=await User.findOne({username});
  try{if(existingUser){
    if(existingUser.password==password)
      res.status(200).json({userid:existingUser._id});
    else
      res.status(401).json({message:"Wrong Password"});
  }
  else res.status(404).json({message:"Enter Valid Username"});
}
catch(err){
  res.status(500).json({error:"Something went wrong"});
}
});








app.post("/api/mcqs", async (req, res) => {
  const { topic } = req.body;
  try {
    const prompt = `
      Give me 10 multiple-choice questions about ${topic} in JSON array format (important interview questions).
      Each item should have "question", "options" (array), and "answerIndex" (index of correct option).
      Return ONLY valid JSON, no backticks, no code block, no extra text. Do NOT include explanations, text, or extra commentary.Follow Exactly.
    `;

    const result = await model.generateContent(prompt);
    const mcqs = JSON.parse(result.response.text());

    res.json(mcqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/review", async (req, res) => {
  const { question, selectedAnswer } = req.body;
  try {
    const prompt = `
      Explain the answer of ${question} in detail.
      Also, I chose ${selectedAnswer} — explain why it's wrong.
      Respond only in JSON with {"explanation": "...", "whyWrong": "..."}
      Return ONLY valid JSON, no backticks, no code block, no extra text.
    `;

    const result = await model.generateContent(prompt);
    const review = JSON.parse(result.response.text());

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/finish", async (req, res) => {
  const { score, topic } = req.body;
  try {
    const percentage = (score / 10) * 100;
    await User.findByIdAndUpdate(userid, {
      $push: {
        scores: { topic, score }
      }
    });
    let chance;
    if (percentage >= 90) chance = "Very High (90–100%)";
    else if (percentage >= 70) chance = "High (70–89%)";
    else if (percentage >= 50) chance = "Moderate (50–69%)";
    else chance = "Low (<50%)";
    const prompt = `
      I scored ${score}/10 (${percentage}%) in ${topic}.
      Suggest how I can improve further, focusing on DSA and interview prep.
      Suggest some topics to improve on.
      Respond only in JSON: {"suggestions": "..."}
      Return ONLY valid JSON, no backticks, no code block, no extra text.

    `;

    const result = await model.generateContent(prompt);
    const aiResp = JSON.parse(result.response.text());

    res.json({ chance, suggestions: aiResp.suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
