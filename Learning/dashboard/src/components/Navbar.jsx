import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <h2>Employee Dashboard</h2>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/add">Add Employee</Link>
        <Link to="/about">About</Link>
      </div>

    </nav>
  );
}

export default Navbar;