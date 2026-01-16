import Login from "./pages/Login";
import { useEffect, useState } from "react";
import API from "./services/api";

function App() {
  // --------------------
  // STATE
  // --------------------
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0–11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [hoveredCell, setHoveredCell] = useState(null);

  // --------------------
  // FETCH HABITS
  // --------------------
  useEffect(() => {
    const fetchHabits = async () => {
      const response = await API.get("/habits");
      setHabits(response.data);
    };
    fetchHabits();
  }, []);

  // --------------------
  // ADD HABIT
  // --------------------
  const addHabit = async () => {
    if (!newHabit.trim()) return;

    const response = await API.post("/habits", {
      name: newHabit,
    });

    setHabits([response.data, ...habits]);
    setNewHabit("");
  };

  // --------------------
  // DELETE HABIT
  // --------------------
  const deleteHabit = async (id) => {
    await API.delete(`/habits/${id}`);
    setHabits(habits.filter((habit) => habit._id !== id));
  };

  // --------------------
  // TOGGLE DAY
  // --------------------
  const toggleDay = async (habitId, dateKey, currentStatus) => {
    const newStatus = !currentStatus;

    const response = await API.patch(`/habits/${habitId}`, {
      date: dateKey,
      status: newStatus,
    });

    setHabits(
      habits.map((habit) => (habit._id === habitId ? response.data : habit))
    );
  };

  // --------------------
  // CALENDAR HELPERS
  // --------------------
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const formatDate = (day) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    return `${currentYear}-${month}-${date}`;
  };
  const todayKey = (() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  const getCellColor = ({ isDone, isFuture, isToday }) => {
    if (isFuture) return "#2f2f2f"; // future (disabled)
    if (!isDone) return "#ffffff"; // not done
    if (isToday) return "#22c55e"; // today + done
    return "#4ade80"; // normal done
  };

  // --------------------
  // COMPLETION DASHBOARD
  // --------------------
  const calculateCompletion = () => {
    let completed = 0;
    let total = habits.length * daysInMonth;

    habits.forEach((habit) => {
      Object.entries(habit.records || {}).forEach(([dateKey, value]) => {
        const date = new Date(dateKey);
        if (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth &&
          value === true
        ) {
          completed++;
        }
      });
    });

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const calculateStreak = (habit) => {
    let streak = 0;

    for (let day = today.getDate(); day >= 1; day--) {
      const dateKey = formatDate(day);

      // stop if day is in the future
      if (dateKey > todayKey) continue;

      if (habit.records?.[dateKey] === true) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // ✅ MUST BE HERE (before return)
  const { completed, total, percentage } = calculateCompletion();

  // --------------------
  // UI
  // --------------------
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }
  return (
    <div style={{ padding: "20px" }}>
      <h1>Habit Tracker</h1>

      {/* Add Habit */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button onClick={addHabit} style={{ marginLeft: "10px" }}>
          Add
        </button>
      </div>

      {/* Completion Dashboard */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          width: "fit-content",
        }}
      >
        <strong>Completion:</strong> {percentage}%
        <br />
        <small>
          {completed} / {total} checks completed
        </small>
      </div>

      {/* Month Selector */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
        >
          ◀
        </button>

        <span style={{ margin: "0 10px", fontWeight: "bold" }}>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
        >
          ▶
        </button>
      </div>

      {/* Calendar Grid */}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Habit</th>
            <th>🔥 Streak</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i + 1}>{i + 1}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <tr key={habit._id}>
              <td>
                {habit.name}
                <button
                  onClick={() => deleteHabit(habit._id)}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                >
                  ❌
                </button>
              </td>

              <td style={{ textAlign: "center", fontWeight: "bold" }}>
                {calculateStreak(habit)}
              </td>

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateKey = formatDate(day);
                const isDone = habit.records?.[dateKey];
                const isFuture = dateKey > todayKey;
                const isToday = dateKey === todayKey;
                const tooltipText = `${new Date(
                  currentYear,
                  currentMonth,
                  day
                ).toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} — ${
                  isFuture
                    ? "Future date"
                    : isDone
                      ? "Completed"
                      : "Not completed"
                }`;

                return (
                  <td
                    key={day}
                    onMouseEnter={() =>
                      setHoveredCell({
                        habitId: habit._id,
                        dateKey,
                        text: tooltipText,
                      })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={
                      isFuture
                        ? undefined
                        : () => toggleDay(habit._id, dateKey, isDone)
                    }
                    style={{
                      cursor: isFuture ? "not-allowed" : "pointer",
                      textAlign: "center",
                      backgroundColor: getCellColor({
                        isDone,
                        isFuture,
                        isToday,
                      }),
                      border: isToday ? "2px solid #166534" : "1px solid #ccc",
                      fontWeight: isToday ? "bold" : "normal",
                      opacity: isFuture ? 0.5 : 1,
                      position: "relative",
                    }}
                  >
                    {isDone ? "✔️" : ""}
                    {hoveredCell &&
                      hoveredCell.habitId === habit._id &&
                      hoveredCell.dateKey === dateKey && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-30px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#111827",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                          }}
                        >
                          {hoveredCell.text}
                        </div>
                      )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
