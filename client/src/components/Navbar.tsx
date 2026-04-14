import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
    window.location.reload();
  }

  return (
    <nav style={{
      background: "#f48fb1",
      padding: "18px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomLeftRadius: "22px",
      borderBottomRightRadius: "22px",
      boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
    }}>
      {/* LEFT - links */}
      <div style={{ display: "flex", gap: "28px" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/stats" style={linkStyle}>Stats</Link>
      </div>

      {/* RIGHT - login/username */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {loggedIn ? (
          <>
            <span style={{ color: "white", fontWeight: "bold" }}>
              👋 {username}
            </span>
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={buttonStyle}>
            Login 🎀
          </Link>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px"
};

const buttonStyle: React.CSSProperties = {
  background: "white",
  color: "#f48fb1",
  border: "none",
  padding: "10px 18px",
  borderRadius: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
  textDecoration: "none"
};

export default Navbar;