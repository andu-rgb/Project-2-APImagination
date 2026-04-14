import { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";

const API = "http://localhost:3001/api/habits";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(API, { headers }).then((res) => {
      setHabits(res.data);
      setLoaded(true);
    });
  }, []);

  async function addHabit() {
    if (newHabit.trim() === "") return;
    const res = await axios.post(API, { name: newHabit }, { headers });
    setHabits([...habits, res.data]);
    setNewId(res.data._id);
    setNewHabit("");
    setTimeout(() => setNewId(null), 400);
  }

  async function toggleHabit(id: string, completed: boolean) {
    const res = await axios.put(`${API}/${id}`, { completed: !completed }, { headers });
    setHabits(habits.map((h) => (h._id === id ? res.data : h)));
  
    if (!completed) {
      setCelebratingId(id);
      setTimeout(() => setCelebratingId(null), 600);
  
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f472b6", "#fb923c", "#f9a8d4", "#fde68a"],
      });
    }
  }

  async function deleteHabit(id: string) {
    setDeletingId(id);
    setTimeout(async () => {
      await axios.delete(`${API}/${id}`, { headers });
      setHabits(habits.filter((h) => h._id !== id));
      setDeletingId(null);
    }, 280);
  }

  function startEditing(habit: Habit) {
    setEditingId(habit._id);
    setEditingName(habit.name);
  }

  async function saveEdit(id: string) {
    if (editingName.trim() === "") return;
    const res = await axios.put(`${API}/${id}`, { name: editingName }, { headers });
    setHabits(habits.map((h) => (h._id === id ? res.data : h)));
    setEditingId(null);
  }

  return (
    <div className="page">
      <h1>🌸 ° My Study Tasks</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Enter new study task"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          style={{
            border: "2px solid #f9a8d4",
            borderRadius: "20px",
            padding: "10px 16px",
            outline: "none",
            width: "300px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={addHabit}
          style={{
            background: "linear-gradient(to right, #f472b6, #fb923c)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Add Task
        </button>
      </div>

      {habits.length === 0 && loaded ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "20px" }}><strong>No study tasks yet</strong></p>
          <p style={{ color: "#9ca3af" }}>Add your first task above!</p>
        </div>
      ) : (
        habits.map((habit, index) => {
          const isDeleting = deletingId === habit._id;
          const isNew = newId === habit._id;

          // staggered load delay for initial render
          const staggerStyle = !loaded
            ? {}
            : {
                animationDelay: isNew ? "0ms" : `${index * 60}ms`,
              };

          return (
            <div
              key={habit._id}
              className={isDeleting ? "task-exit" : "task-enter"}
              style={{
                ...staggerStyle,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                opacity: habit.completed ? 0.7 : 1,
              }}
            >
              <div
               className={`card ${celebratingId === habit._id ? "task-celebrate" : ""}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  margin: 0,
                }}
              >
                {editingId === habit._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(habit._id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    style={{
                      border: "2px solid #f9a8d4",
                      borderRadius: "12px",
                      padding: "6px 12px",
                      fontSize: "16px",
                      outline: "none",
                      flex: 1,
                      marginRight: "10px",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      textDecoration: habit.completed ? "line-through" : "none",
                      color: habit.completed ? "#9ca3af" : "black",
                      fontSize: "16px",
                    }}
                  >
                    {habit.completed ? "✔ " : "✦ "}{habit.name}
                  </span>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  {editingId === habit._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(habit._id)}
                        style={{
                          background: "linear-gradient(to right, #f472b6, #fb923c)",
                          color: "white",
                          border: "none",
                          borderRadius: "20px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          background: "white",
                          color: "#9ca3af",
                          border: "2px solid #d1d5db",
                          borderRadius: "20px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleHabit(habit._id, habit.completed)}
                        style={{
                          background: habit.completed ? "#d1d5db" : "linear-gradient(to right, #f472b6, #fb923c)",
                          color: "white",
                          border: "none",
                          borderRadius: "20px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        {habit.completed ? "Undo" : "Done"}
                      </button>
                      <button
                        onClick={() => startEditing(habit)}
                        style={{
                          background: "white",
                          color: "#f472b6",
                          border: "2px solid #f9a8d4",
                          borderRadius: "20px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHabit(habit._id)}
                        style={{
                          background: "white",
                          color: "#f472b6",
                          border: "2px solid #f472b6",
                          borderRadius: "20px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Dashboard;