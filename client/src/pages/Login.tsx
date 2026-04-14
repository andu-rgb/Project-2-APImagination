import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3001";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("loggedIn", "true");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password");
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "85vh"
    }}>
      <div style={{
        background: "white",
        width: "430px",
        padding: "45px",
        borderRadius: "30px",
        boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
        textAlign: "center"
      }}>
        <h1 style={{ color: "#f48fb1", fontSize: "40px", marginBottom: "10px" }}>
          Welcome Back 🎀
        </h1>

        <p style={{ color: "#777", marginBottom: "28px" }}>
          Ready to crush your goals today? 
        </p>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Sign In 
          </button>
        </form>

        <p style={{ marginTop: "18px", color: "#666", fontSize: "14px" }}>
          New here?{" "}
          <Link to="/signup" style={{
            color: "#f48fb1",
            fontWeight: "bold",
            textDecoration: "none"
          }}>
            Sign up ✨
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "14px",
  border: "2px solid #ffe8ea",
  fontSize: "16px",
  boxSizing: "border-box" as const
};

const buttonStyle = {
  width: "100%",
  background: "#ff8fb1",
  color: "white",
  border: "none",
  padding: "15px",
  borderRadius: "16px",
  fontWeight: "bold",
  fontSize: "17px",
  cursor: "pointer"
};

export default Login;