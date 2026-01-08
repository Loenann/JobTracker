import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <h2>JobTracker</h2>
      
      <nav>
        {isAuthenticated && (
          <Link to="/" style={styles.link}>Jobs</Link>
        )}
        {!isAuthenticated &&(
          <>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </>
        )}
      </nav>
      {isAuthenticated && (
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#111",
    color: "#fff",
    zIndex: 1000,
  },
  button: {
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
  },
  link:{
    color: "white",
    marginLeft: "3rem",
  }
};
