import { UserButton } from "@clerk/clerk-react";
import logo from "./assets/Logo2.png";
import { Link } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";

function Appbar({value}) {
  return (
    <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid ms-7">
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

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto me-4 mb-2 mb-lg-0">
            <li className="nav-item">
           { !value?  <Link
                to="/dashboard"
                className="nav-link text-dark text-decoration-none"
              >
                Dashboard
              </Link> :  <Link
                to="/display"
                className="nav-link text-dark text-decoration-none"
              >
                Display
              </Link> }
            </li>
          </ul>
        </div>

        <UserButton />
      </div>
    </nav>
  );
}

export default Appbar;
