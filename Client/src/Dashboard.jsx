import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

export default function Dashboard() {
  const { userid } = useParams();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch(`/api/user/${userid}`);
        const data = await res.json();
        setScores(data.scores || []);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    }
    if (userid) fetchScores();
  }, [userid]);

  if (!scores.length) return <p>No scores yet.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>

      {/* Bar Chart */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Scores by Topic</h3>
        <BarChart width={600} height={300} data={scores}>
          <XAxis dataKey="topic" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Pie Chart */}
      <div>
        <h3>Score Distribution</h3>
        <PieChart width={600} height={400}>
          <Pie
            data={scores}
            dataKey="score"
            nameKey="topic"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {scores.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
