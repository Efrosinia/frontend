import React, { useState, useEffect, useRef } from "react";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("/avatar.jpg");
  const [reputation, setReputation] = useState(0);
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const avatarInputRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null); // новий стан для фото

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please log in first!");
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUsername(data.username);
        setBio(data.bio || "");
        setReputation(data.reputation || 0);
        setRecommendationsCount(data.recommendations_count || 0);
        setCommentsCount(data.comments_count || 0);
        setAvatar(data.profile_photo_path ? `http://localhost:5000${data.profile_photo_path}` : "/avatar.jpg");

      })
      .catch((err) => {
        console.error(err);
        alert("Error loading profile. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, [token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // зберігаємо файл
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (avatarFile) {
        formData.append("avatar", avatarFile); // додаємо файл лише якщо він є
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ НЕ вказуємо Content-Type вручну — браузер сам зробить правильно!
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated!");
      avatarInputRef.current.value = ""; // очистити вибране фото
      setAvatarFile(null); // очистити стан
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ margin: "30px", backgroundColor: "#f4f4f4" }}>
      <nav style={{
        backgroundColor: "#333",
        padding: "10px 20px",
        marginBottom: "30px",
        borderRadius: "8px"
      }}>
        <a href="/" style={navLinkStyle}>Home</a>
        <a href="/create" style={navLinkStyle}>Create Recommendation</a>
        <a href="/profile" style={navLinkStyle}>Profile</a>
        <a href="/contact" style={navLinkStyle}>Contact</a>
        <a href="/login" style={navLinkStyle}>Login</a>
        <a href="/register" style={navLinkStyle}>Register</a>
      </nav>

      <div className="profile-container" style={profileContainerStyle}>
        <button
          onClick={logout}
          style={logoutButtonStyle}
        >
          Log Out
        </button>

        <div className="profile-header" style={profileHeaderStyle}>
          <img
            src={avatar}
            alt="User Avatar"
            style={avatarStyle}
          />
          <div className="profile-info">
            <label><strong>Username:</strong></label>
            <input
              type="text"
              value={username}
              maxLength={30}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />

            <label><strong>Bio:</strong></label>
            <textarea
              value={bio}
              rows="4"
              maxLength={300}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us something about yourself..."
              style={inputStyle}
            />

            <label><strong>Change Avatar:</strong></label>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              style={{ marginTop: "10px", marginBottom: "20px" }}
            />
          </div>
        </div>

        <button
          onClick={saveProfile}
          style={saveButtonStyle}
        >
          Save Changes
        </button>

        <div className="stats" style={statsStyle}>
          <div style={statBoxStyle}>
            <h3>Reputation</h3>
            <span>{reputation}</span>
          </div>
          <div style={statBoxStyle}>
            <h3>Recommendations</h3>
            <span>{recommendationsCount}</span>
          </div>
          <div style={statBoxStyle}>
            <h3>Comments</h3>
            <span>{commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Стилі:
const navLinkStyle = {
  color: "white",
  marginRight: "15px",
  textDecoration: "none",
  fontWeight: "bold"
};

const profileContainerStyle = {
  maxWidth: "900px",
  margin: "auto",
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  position: "relative"
};

const logoutButtonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  padding: "8px 16px",
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px"
};

const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const avatarStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #ddd",
  backgroundColor: "#ccc"
};

const inputStyle = {
  width: "100%",
  fontSize: "16px",
  marginTop: "5px",
  marginBottom: "15px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  resize: "vertical",
  fontFamily: "Arial, sans-serif"
};

const saveButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  padding: "10px 18px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "10px"
};

const statsStyle = {
  marginTop: "30px",
  display: "flex",
  justifyContent: "space-between",
  textAlign: "center"
};

const statBoxStyle = {
  flex: "1",
  background: "#f9f9f9",
  margin: "0 10px",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 5px rgba(0,0,0,0.05)"
};
