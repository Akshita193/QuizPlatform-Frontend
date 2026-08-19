import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";

import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [showRegister, setShowRegister] =
    useState(false);

  const [
    showForgotPassword,
    setShowForgotPassword,
  ] = useState(false);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    setShowRegister(false);
    setShowForgotPassword(false);
  };


  // ==============================
  // USER NOT LOGGED IN
  // ==============================

  if (!user) {

    // FORGOT PASSWORD PAGE
    if (showForgotPassword) {
      return (
        <ForgotPassword
          onBackToLogin={() =>
            setShowForgotPassword(false)
          }
        />
      );
    }


    // REGISTER PAGE
    if (showRegister) {
      return (
        <Register
          onRegister={() =>
            setShowRegister(false)
          }
        />
      );
    }


    // LOGIN PAGE
    return (
      <Login
        onLogin={handleLogin}

        onRegister={() => {
          setShowRegister(true);
          setShowForgotPassword(false);
        }}

        onForgotPassword={() => {
          setShowForgotPassword(true);
          setShowRegister(false);
        }}
      />
    );
  }


  // ==============================
  // ADMIN
  // ==============================

  if (user.role === "ADMIN") {
    return (
      <AdminDashboard
        onLogout={handleLogout}
      />
    );
  }


  // ==============================
  // STUDENT
  // ==============================

  return (
    <StudentDashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;