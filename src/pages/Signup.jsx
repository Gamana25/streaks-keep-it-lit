import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles-sign-up.css";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(form));
    navigate("/login");
  };

  return (
    <>
      <nav>
        <div className="con">
          <div className="name">
            <img src="/images/logo.png" className="icon-logo" />
            <img src="/images/title.png" className="title" />
          </div>
        </div>
      </nav>

      <div className="middle">
        <div className="right-middle">
          <p className="sign-up">Sign up</p>

          <form onSubmit={handleSubmit}>
            <input
              className="input-box"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input-box"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button className="continue">Continue</button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
