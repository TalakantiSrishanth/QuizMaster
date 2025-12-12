const express = require("express");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username:{ type:String},
  scores: [
    {
      topic: String,
      score: Number,
      correct: Number,
      incorrect: Number,
      unattempted: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.get("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ clerkId: id });
    if (!user) return res.json(null);
    let total_correct=user.scores.reduce((acc,item)=> acc+item.correct,0);
    let total_incorrect=user.scores.reduce((acc,item)=> acc+item.incorrect,0);
    let total_unattempted=user.scores.reduce((acc,item)=> acc+item.unattempted,0);

    res.json({
  ...user.toObject(),         
  total_correct,
  total_incorrect,
  total_unattempted
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find({});
    const leaderboard = users.map(u => ({
      clerkId: u.clerkId,
      name: u.username, 
      totalScore: u.scores.length > 0 
  ? (u.scores.reduce((sum, s) => sum + s.score, 0) / u.scores.length).toFixed(2)
  : 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
    res.json({ users: leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
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
      Return ONLY valid JSON, no backticks, no code block, no extra text.Do NOT include explanations, text, or extra commentary.Follow Exactly.
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
  const { userid,username, score, topic, correct, incorrect, unattempted } = req.body;
 
  try {
    const percentage = (score / 10) * 100;

    await User.findOneAndUpdate(
      { clerkId: userid },
      {
         $set: { username:username },
        $push: {
          scores: { topic, score, correct, incorrect, unattempted },
        },
      },
      { new: true, upsert: true }
    );

    let chance;
    if (percentage >= 90) chance = "Very High (90–100%)";
    else if (percentage >= 70) chance = "High (70–89%)";
    else if (percentage >= 50) chance = "Moderate (50–69%)";
    else chance = "Low (<50%)";

    const prompt = `
      I scored ${score}/10 (${percentage}%) in ${topic}.
      Correct: ${correct}, Incorrect: ${incorrect}, Unattempted: ${unattempted}.
      Suggest how I can improve further, focusing on DSA and interview prep.
      Respond only in JSON: {"suggestions": "..."}
      Return ONLY valid JSON, no backticks, no code block, no extra text.
      Do NOT include explanations, text, or extra commentary.Follow Exactly.
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
