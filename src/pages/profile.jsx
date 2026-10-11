import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  // Get registered user data from localStorage
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(
    savedUser || {
      name: "",
      email: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
    }
  );

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(profile));

    setEditing(false);

    alert("Profile updated successfully!");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>User Profile</h1>

        {editing ? (
          <div className="register-form">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profile.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleChange}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={profile.age}
              onChange={handleChange}
            />

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={profile.height}
              onChange={handleChange}
            />

            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={profile.weight}
              onChange={handleChange}
            />

            <button onClick={handleSave}>
              Save Changes
            </button>

          </div>
        ) : (
          <div className="profile-info">

            <p>
              <strong>Name:</strong> {profile.name}
            </p>

            <p>
              <strong>Email:</strong> {profile.email}
            </p>

            <p>
              <strong>Age:</strong>{" "}
              {profile.age || "Not provided"}
            </p>

            <p>
              <strong>Gender:</strong>{" "}
              {profile.gender || "Not provided"}
            </p>

            <p>
              <strong>Height:</strong>{" "}
              {profile.height
                ? `${profile.height} cm`
                : "Not provided"}
            </p>

            <p>
              <strong>Weight:</strong>{" "}
              {profile.weight
                ? `${profile.weight} kg`
                : "Not provided"}
            </p>

            <button onClick={() => setEditing(true)}>
              Edit Profile
            </button>

          </div>
        )}

        <button
          className="profile-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Profile;