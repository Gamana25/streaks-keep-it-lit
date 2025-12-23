// Updated: src/pages/Login.jsx (Set derived userName after login)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles-sign-up.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = JSON.parse(localStorage.getItem("user"));

    if (
      !stored ||
      stored.email !== form.email ||
      stored.password !== form.password
    ) {
      setError("Invalid email or password");
      return;
    }

    // Set derived name and email (for TopBar compat)
    const name = form.email.split("@")[0];
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", form.email);

    navigate("/dashboard");
  };

  return (
    <>
      <nav>
        <div className="con">
          <div className="name">Streaks</div>
        </div>

        <Link to="/signup">
          <button className="login-button">Sign Up</button>
        </Link>
      </nav>

      <div className="middle">
        <div className="right-middle">
          <p className="sign-up">Log In</p>

          <form onSubmit={handleSubmit}>
            <input
              className="input-box"
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="input-box"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {error && <p className="message">{error}</p>}

            <button className="continue">Log In</button>
          </form>
        </div>
      </div>
    </>
  );
}