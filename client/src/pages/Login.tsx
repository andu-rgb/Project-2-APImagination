import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
    setOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
    setOpen(false);
  }

  return (
    <nav
      style={{
        background: "#f48fb1",
        padding: "18px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: "22px",
        borderBottomRightRadius: "22px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: "28px" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/stats" style={linkStyle}>Stats</Link>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ position: "relative" }} ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "white",
            color: "#f48fb1",
            border: "none",
            padding: "10px 18px",
            borderRadius: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {loggedIn ? "My Account 👤" : "Login ▼"}
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "0",
              width: "290px",
              background: "white",
              padding: "22px",
              borderRadius: "20px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
              animation: "fadeDown 0.25s ease"
            }}
          >
            {!loggedIn ? (
              <form onSubmit={handleLogin}>
                <h3
                  style={{
                    marginTop: 0,
                    color: "#f48fb1",
                    marginBottom: "16px"
                  }}
                >
                  Welcome Back 🎀
                </h3>

                <input
                  placeholder="Email"
                  style={inputStyle}
                />

                <input
                  type="password"
                  placeholder="Password"
                  style={inputStyle}
                />

                <button style={buttonStyle}>
                  Sign In 💖
                </button>

                <p
                  style={{
                    textAlign: "center",
                    marginTop: "12px",
                    color: "#777",
                    fontSize: "14px"
                  }}
                >
                  New here? Sign up ✨
                </p>
              </form>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h3 style={{ color: "#f48fb1" }}>
                  Hello Bestie 💅
                </h3>

                <p style={{ color: "#666" }}>
                  Ready to crush your goals today?
                </p>

                <button
                  onClick={handleLogout}
                  style={{
                    ...buttonStyle,
                    marginTop: "10px"
                  }}
                >
                  Logout ✨
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "18px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "2px solid #ffe0ea",
  fontSize: "15px"
};

const buttonStyle = {
  width: "100%",
  background: "#ff8fb1",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "14px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

export default Navbar;