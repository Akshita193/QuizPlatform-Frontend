import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("LOGGED IN USER:", data.user);
      console.log("USER ROLE:", data.user.role);

      onLogin(data.user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
  <div className="login-page">

    <div className="login-visual">

      <div className="login-brand-badge">
        🎓
        <span>QuizPlatform</span>
      </div>

      <div className="login-visual-content">
        <span className="login-eyebrow">
          LEARN • PRACTICE • GROW
        </span>

        <h1>
          Welcome back to
          <span> QuizPlatform</span>
        </h1>

        <p>
          Continue your learning journey,
          attempt quizzes and track your
          performance from one place.
        </p>

        <div className="login-feature-list">

          <div>
            <span>✓</span>
            Interactive quizzes
          </div>

          <div>
            <span>✓</span>
            Instant results
          </div>

          <div>
            <span>✓</span>
            Performance tracking
          </div>

        </div>
      </div>

      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

    </div>


    <div className="login-form-side">

      <form
        className="login-card"
        onSubmit={handleLogin}
      >

        <div className="login-mobile-brand">
          🎓 QuizPlatform
        </div>

        <div className="login-heading">
          <span>WELCOME BACK</span>

          <h2>
            Sign in to your account
          </h2>

          <p>
            Enter your credentials to continue.
          </p>
        </div>

        <div className="login-field">

          <label htmlFor="login-email">
            Email Address
          </label>

          <div className="login-input-wrapper">
            <span className="login-input-icon">
              ✉
            </span>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

        </div>

        <div className="login-field">

          <label htmlFor="login-password">
            Password
          </label>

          <div className="login-input-wrapper">
            <span className="login-input-icon">
              🔒
            </span>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

        </div>

        {error && (
          <div className="login-error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="login-primary-button"
        >
          Sign In
        </button>

        <div className="login-divider">
          <span></span>
          <p>New to QuizPlatform?</p>
          <span></span>
        </div>

        <button
          type="button"
          onClick={onRegister}
          className="login-secondary-button"
        >
          Create Student Account
        </button>

      </form>

    </div>

  </div>
);
}

export default Login;