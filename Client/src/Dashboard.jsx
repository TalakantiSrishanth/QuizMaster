import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { RingLoader } from "react-spinners";
import Appbar from "./Appbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/Dashboard.css";
function Dashboard() {
  const { user } = useUser();
  const [user_data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const pData = user_data ? user_data.scores.map((item) => item.score) : [];
  const xLabels = user_data
    ? user_data.scores.map((item) =>
        new Date(item.date).toLocaleDateString()
      )
    : [];

  useEffect(() => {
    async function fetchData() {
      try {
        let res = await fetch(`https://quizmaster-c3yr.onrender.com/api/user/${user.id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        let d = await res.json();
        setData(d);

        res = await fetch(`https://quizmaster-c3yr.onrender.com/api/leaderboard`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        d = await res.json();
        
        const sortedUsers = d.users.sort((a, b) => b.totalScore - a.totalScore);
        setLeaderboard(sortedUsers);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }
    if (user?.id) fetchData();
  }, [user?.id]);
  if (!user_data || !leaderboard) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <RingLoader color="#df151cff" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Appbar value={true} />
      <div className="container my-4">
        <div className="card shadow-sm rounded-3 mb-4 welcome-card">
          <div className="card-body text-center">
            <h3 className="fw-bold">Welcome, {user?.username}</h3>
            <p className="text-muted">
              Contests Attended: {user_data?.scores?.length || 0}
            </p>
          </div>
        </div>

        <div className="row g-3 px-3">
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100 text-center border-success">
              <div className="card-body text-success">
                <h3 className="card-title">Correct</h3>
                <h5 className="card-text">{user_data?.total_correct}</h5>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100 text-center border-danger">
              <div className="card-body text-danger">
                <h3 className="card-title">Incorrect</h3>
                <h5 className="card-text">{user_data?.total_incorrect}</h5>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100 text-center border-warning">
              <div className="card-body text-warning">
                <h3 className="card-title">Unattempted</h3>
                <h5 className="card-text">{user_data?.total_unattempted}</h5>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100 text-center border-info">
              <div className="card-body text-info">
                <h3 className="card-title">Total Score</h3>
                <h5 className="card-text">
                  {user_data?.scores?.reduce((acc, item) => acc + item.score, 0) ||
                    0}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div className="col-md-6 d-flex justify-content-center">
            {user_data?.scores?.length ? (
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: user_data?.total_correct,
                        label: "Correct",
                        color: "#28a745",
                      },
                      {
                        id: 1,
                        value: user_data?.total_incorrect,
                        label: "Incorrect",
                        color: "#dc3545",
                      },
                      {
                        id: 2,
                        value: user_data?.total_unattempted,
                        label: "Unattempted",
                        color: "#ffc107",
                      },
                    ],
                  },
                ]}
                width={250}
                height={250}
              />
            ) : (
              <p className="text-muted text-center">No data to display</p>
            )}
          </div>

          <div className="col-md-6">
            {pData.length ? (
              <LineChart
                height={300}
                series={[{ data: pData, curve: "natural", color: "#007bff" }]}
                xAxis={[{ scaleType: "point", data: xLabels }]}
                yAxis={[{ width: 50 }]}
                margin={{ right: 24 }}
              />
            ) : (
              <p className="text-muted text-center">No scores to chart</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-center my-3 text-dark">🏆 Leaderboard</h3>
          {leaderboard.length ? (
            <div className="container">
              <ol className="list-group">
                {leaderboard.map((u, idx) => {
                  if (!u.name) return null;
                  return (
                    <li
                      key={idx}
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        u.clerkId === user_data?.clerkId ? "fw-bold current-user" : ""
                      }`}
                    >
                      <span>{u.name}</span>
                      <span className="badge bg-primary rounded-pill">
                        {u.totalScore}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : (
            <p className="text-center text-muted">No leaderboard data</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
