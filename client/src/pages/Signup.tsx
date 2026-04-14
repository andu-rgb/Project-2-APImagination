import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3001";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields 💝");
      return;
    }
    try {
      const res = await axios.post(`${API}/api/signup`, { username, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("loggedIn", "true");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div
      className="page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "85vh"
      }}
    >
      <div
        style={{
          background: "white",
          width: "430px",
          padding: "45px",
          borderRadius: "30px",
          boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}
      >
        <h1
          style={{
            color: "#f48fb1",
            fontSize: "46px",
            marginBottom: "10px"
          }}
        >
          Join StudyFlow ✨
        </h1>

        <p style={{ color: "#777", marginBottom: "28px" }}>
          Create your account and stay productive 🚀
        </p>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
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
            Create Account 
          </button>
        </form>

        <p style={{ marginTop: "18px", color: "#666", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#f48fb1", fontWeight: "bold", textDecoration: "none" }}
          >
            Log In 🎀
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
  cursor: "pointer",
};

export default Signup;