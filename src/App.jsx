import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  if (user.role === "ADMIN") {
  return <AdminDashboard onLogout={handleLogout} />;
}

return (
  <StudentDashboard
    user={user}
    onLogout={handleLogout}
  />
);
}

export default App;