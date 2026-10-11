import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get registered user from localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));

    // Check if user exists
    if (!savedUser) {
      setError("No registered user found. Please register first.");
      return;
    }

    // Check email and password
    if (
      formData.email === savedUser.email &&
      formData.password === savedUser.password
    ) {
      alert("Login successful!");

      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Welcome Back</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;