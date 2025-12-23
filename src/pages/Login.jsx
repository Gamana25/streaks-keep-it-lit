import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/styles-sign-up.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      setMessage("No account found. Please sign up.");
      return;
    }

    if (
      email === savedUser.email &&
      password === savedUser.password
    ) {
      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setMessage("Invalid email or password");
    }
  };

  return (
    <>
      {/* Header */}
      <nav>
        <div className="con">
          <div className="name">
            <img className="icon-logo" src="/images/logo.png" alt="logo" />
            <img className="title" src="/images/title.png" alt="title" />
          </div>

          <ul className="info">
            <li>Get Started</li>
            <li>Mobile Apps</li>
            <li>Learn More</li>
          </ul>
        </div>
      </nav>

      {/* Middle */}
      <div className="middle">
        <div className="left-middle">
          <p className="tag-line">
            <span style={{ color: "#05c26a" }}>Welcome back!</span>
            <br />
            Log in to continue your journey.
          </p>
        </div>

        <div className="right-middle">
          <p className="sign-up">Log In</p>

          <form onSubmit={handleSubmit}>
            <input
              className="input-box"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input-box"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="continue">
              Log In
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <p style={{ color: "white", marginTop: "10px" }}>
            Don&apos;t have an account?{" "}
            <Link to="/" style={{ color: "#05c26a" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
