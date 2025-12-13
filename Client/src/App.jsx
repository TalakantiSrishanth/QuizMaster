import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import Display from "./Display";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <>
            <SignedIn>
              <Navigate to="/display" />
            </SignedIn>
            <SignedOut>
              <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
              <SignIn
                path="/login"
                routing="path"
                redirectSettings={{ afterSignIn: "/display" }}
              />
              </div>
            </SignedOut>
            </>
          }
        />
  
        <Route
          path="/register"
          element={
            <>
            <SignedIn>
              <Navigate to="/display" />
            </SignedIn>
            <SignedOut>
              <SignUp
                path="/register"
                routing="path"
                redirectSettings={{ afterSignUp: "/display" }}
              />
            </SignedOut>
            </>
          }
        />
        <Route
          path="/display"
          element={
            <SignedIn>
              <Display />
            </SignedIn>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
