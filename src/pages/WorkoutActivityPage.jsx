
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Dumbbell,
  Footprints,
  Bike,
  Timer,
  Flame,
  Trash2,
  ArrowLeft,
  Plus,
  RefreshCw
} from "lucide-react";

const API_URL = "http://localhost:5000";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user?.email || user?.id || "user1";
  } catch {
    return "user1";
  }
};

export default function WorkoutActivityPage() {
  const navigate = useNavigate();
  const userId = getUserId();

  const [activeTab, setActiveTab] = useState("workout");
  const [workouts, setWorkouts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [workoutForm, setWorkoutForm] = useState({
    exerciseName: "Walking",
    duration: "",
    caloriesBurned: ""
  });

  const [activityForm, setActivityForm] = useState({
    steps: "",
    distance: "",
    caloriesBurned: ""
  });

  const loadRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const [workoutResponse, activityResponse] = await Promise.all([
        fetch(
          `${API_URL}/workouts?userId=${encodeURIComponent(userId)}`
        ),
        fetch(
          `${API_URL}/activities?userId=${encodeURIComponent(userId)}`
        )
      ]);

      if (!workoutResponse.ok || !activityResponse.ok) {
        throw new Error(
          "Could not load records. Check that your backend APIs are running."
        );
      }

      const workoutData = await workoutResponse.json();
      const activityData = await activityResponse.json();

      setWorkouts(
        Array.isArray(workoutData)
          ? workoutData
          : workoutData.workouts || []
      );

      setActivities(
        Array.isArray(activityData)
          ? activityData
          : activityData.activities || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the backend. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkoutForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setActivityForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          exerciseName: workoutForm.exerciseName,
          duration: Number(workoutForm.duration),
          caloriesBurned: Number(workoutForm.caloriesBurned)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save workout.");
      }

      setMessage("Workout saved successfully!");
      setWorkoutForm({
        exerciseName: "Walking",
        duration: "",
        caloriesBurned: ""
      });

      await loadRecords();
    } catch (err) {
      setError(err.message || "Unable to save workout.");
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          steps: Number(activityForm.steps || 0),
          distance: Number(activityForm.distance || 0),
          caloriesBurned: Number(activityForm.caloriesBurned || 0)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save activity.");
      }

      setMessage("Activity saved successfully!");
      setActivityForm({
        steps: "",
        distance: "",
        caloriesBurned: ""
      });

      await loadRecords();
    } catch (err) {
      setError(err.message || "Unable to save activity.");
    }
  };

  const deleteRecord = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${type}/${id}`, {
        method: "DELETE"
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete record.");
      }

      setMessage("Record deleted successfully!");
      await loadRecords();
    } catch (err) {
      setError(err.message || "Unable to delete record.");
    }
  };

  const totalSteps = activities.reduce(
    (sum, item) => sum + Number(item.steps || 0),
    0
  );

  const totalDistance = activities.reduce(
    (sum, item) => sum + Number(item.distance || 0),
    0
  );

  const totalCalories =
    workouts.reduce(
      (sum, item) => sum + Number(item.caloriesBurned || 0),
      0
    ) +
    activities.reduce(
      (sum, item) => sum + Number(item.caloriesBurned || 0),
      0
    );

  const totalDuration = workouts.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0
  );

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)"
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    background: "#ffffff",
    color: "#0f172a"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155"
  };

  const primaryButton = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#0f766e",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        color: "#0f172a"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            ...primaryButton,
            background: "#e2e8f0",
            color: "#334155",
            marginBottom: "20px"
          }}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div
          style={{
            background:
              "linear-gradient(120deg, #0f766e, #115e59, #0f172a)",
            borderRadius: "22px",
            padding: "30px",
            color: "white",
            marginBottom: "24px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Activity size={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: "28px" }}>
                Workout & Activity Tracking
              </h1>
              <p style={{ marginBottom: 0, color: "#ccfbf1" }}>
                Track your workouts, daily steps and activity progress.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            role="status"
            style={{
              padding: "13px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#dcfce7",
              color: "#166534"
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              padding: "13px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#fee2e2",
              color: "#991b1b"
            }}
          >
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}
        >
          {[
            {
              label: "Total Workouts",
              value: workouts.length,
              icon: <Dumbbell size={23} />
            },
            {
              label: "Total Duration",
              value: `${totalDuration} min`,
              icon: <Timer size={23} />
            },
            {
              label: "Total Steps",
              value: totalSteps.toLocaleString(),
              icon: <Footprints size={23} />
            },
            {
              label: "Distance",
              value: `${totalDistance.toFixed(2)} km`,
              icon: <Bike size={23} />
            },
            {
              label: "Calories Burned",
              value: totalCalories.toLocaleString(),
              icon: <Flame size={23} />
            }
          ].map((item) => (
            <div key={item.label} style={cardStyle}>
              <div style={{ color: "#0f766e", marginBottom: "12px" }}>
                {item.icon}
              </div>
              <p style={{ color: "#64748b", margin: "0 0 8px", fontSize: 13 }}>
                {item.label}
              </p>
              <h2 style={{ margin: 0, fontSize: 25 }}>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Tab controls */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("workout")}
            style={{
              ...primaryButton,
              background: activeTab === "workout" ? "#0f766e" : "#e2e8f0",
              color: activeTab === "workout" ? "#ffffff" : "#334155"
            }}
          >
            <Dumbbell size={17} />
            Log Workout
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            style={{
              ...primaryButton,
              background: activeTab === "activity" ? "#0f766e" : "#e2e8f0",
              color: activeTab === "activity" ? "#ffffff" : "#334155"
            }}
          >
            <Footprints size={17} />
            Log Activity
          </button>
        </div>

        {/* Workout form */}
        {activeTab === "workout" && (
          <form
            onSubmit={handleWorkoutSubmit}
            style={{ ...cardStyle, marginBottom: "24px" }}
          >
            <h2 style={{ marginTop: 0 }}>Add a Workout</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "16px"
              }}
            >
              <div>
                <label style={labelStyle}>Exercise</label>
                <select
                  name="exerciseName"
                  value={workoutForm.exerciseName}
                  onChange={handleWorkoutChange}
                  style={inputStyle}
                >
                  <option>Walking</option>
                  <option>Running</option>
                  <option>Cycling</option>
                  <option>Gym</option>
                  <option>Yoga</option>
                  <option>Swimming</option>
                  <option>Skipping</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  step="1"
                  required
                  value={workoutForm.duration}
                  onChange={handleWorkoutChange}
                  placeholder="e.g. 30"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Calories burned (kcal)</label>
                <input
                  type="number"
                  name="caloriesBurned"
                  min="0"
                  step="1"
                  required
                  value={workoutForm.caloriesBurned}
                  onChange={handleWorkoutChange}
                  placeholder="e.g. 200"
                  style={inputStyle}
                />
              </div>
            </div>

            <button type="submit" style={{ ...primaryButton, marginTop: "20px" }}>
              <Plus size={17} />
              Save Workout
            </button>
          </form>
        )}

        {/* Activity form */}
        {activeTab === "activity" && (
          <form
            onSubmit={handleActivitySubmit}
            style={{ ...cardStyle, marginBottom: "24px" }}
          >
            <h2 style={{ marginTop: 0 }}>Add Daily Activity</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "16px"
              }}
            >
              <div>
                <label style={labelStyle}>Steps</label>
                <input
                  type="number"
                  name="steps"
                  min="0"
                  step="1"
                  required
                  value={activityForm.steps}
                  onChange={handleActivityChange}
                  placeholder="e.g. 7500"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Distance (km)</label>
                <input
                  type="number"
                  name="distance"
                  min="0"
                  step="0.01"
                  required
                  value={activityForm.distance}
                  onChange={handleActivityChange}
                  placeholder="e.g. 5.2"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Activity calories (kcal)</label>
                <input
                  type="number"
                  name="caloriesBurned"
                  min="0"
                  step="1"
                  required
                  value={activityForm.caloriesBurned}
                  onChange={handleActivityChange}
                  placeholder="e.g. 250"
                  style={inputStyle}
                />
              </div>
            </div>

            <button type="submit" style={{ ...primaryButton, marginTop: "20px" }}>
              <Plus size={17} />
              Save Activity
            </button>
          </form>
        )}

        {/* Workout history */}
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            <h2 style={{ margin: 0 }}>Workout History</h2>
            <button
              type="button"
              onClick={loadRecords}
              style={{ ...primaryButton, background: "#334155" }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading records...</p>
          ) : workouts.length === 0 ? (
            <p style={{ color: "#64748b" }}>No workouts recorded yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                <thead>
                  <tr style={{ textAlign: "left", background: "#f8fafc" }}>
                    <th style={{ padding: "12px" }}>Exercise</th>
                    <th style={{ padding: "12px" }}>Duration</th>
                    <th style={{ padding: "12px" }}>Calories</th>
                    <th style={{ padding: "12px" }}>Date</th>
                    <th style={{ padding: "12px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout._id || workout.id}>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {workout.exerciseName}
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {workout.duration} min
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {workout.caloriesBurned} kcal
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {workout.date ? new Date(workout.date).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        <button
                          type="button"
                          onClick={() => deleteRecord("workouts", workout._id || workout.id)}
                          aria-label="Delete workout"
                          style={{
                            border: "none",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            borderRadius: "8px",
                            padding: "8px",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Activity history */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Activity History</h2>

          {activities.length === 0 ? (
            <p style={{ color: "#64748b" }}>No activities recorded yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", background: "#f8fafc" }}>
                    <th style={{ padding: "12px" }}>Steps</th>
                    <th style={{ padding: "12px" }}>Distance</th>
                    <th style={{ padding: "12px" }}>Calories</th>
                    <th style={{ padding: "12px" }}>Date</th>
                    <th style={{ padding: "12px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity._id || activity.id}>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {Number(activity.steps || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {Number(activity.distance || 0).toFixed(2)} km
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {activity.caloriesBurned || 0} kcal
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {activity.date ? new Date(activity.date).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "12px", borderTop: "1px solid #e2e8f0" }}>
                        <button
                          type="button"
                          onClick={() => deleteRecord("activities", activity._id || activity.id)}
                          aria-label="Delete activity"
                          style={{
                            border: "none",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            borderRadius: "8px",
                            padding: "8px",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
