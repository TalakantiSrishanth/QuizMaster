import { UserButton } from "@clerk/clerk-react";
import logo from "./assets/Logo2.png";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Appbar({ value }) {
  return (
    <nav className="navbar sticky-top bg-body-tertiary">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* LEFT: Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center text-decoration-none text-dark"
        >
          <img
            src={logo}
            alt="Logo"
            width="30"
            height="35"
            className="d-inline-block align-text-top me-2"
          />
          QuizMaster
        </Link>

        
        <div className="d-flex align-items-center">
          {!value ? (
            <Link
              to="/dashboard"
              className="nav-link text-dark text-decoration-none me-3"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/display"
              className="nav-link text-dark text-decoration-none me-3"
            >
              Display
            </Link>
          )}

          <UserButton />
        </div>

      </div>
    </nav>
  );
}

export default Appbar;
