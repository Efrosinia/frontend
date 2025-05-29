import React, { useState, useEffect, useRef } from "react";

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 30,
    backgroundColor: "#f4f4f4",
  },
  nav: {
    backgroundColor: "#333",
    padding: "10px 20px",
    marginBottom: 30,
    borderRadius: 8,
  },
  navLink: {
    color: "white",
    marginRight: 15,
    textDecoration: "none",
    fontWeight: "bold",
  },
  navLinkHover: {
    textDecoration: "underline",
  },
  profileContainer: {
    maxWidth: 900,
    margin: "auto",
    background: "white",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
  },
  logoutButtonHover: {
    backgroundColor: "#c0392b",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ddd",
    backgroundColor: "#ccc",
  },
  profileInfo: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
  },
  inputText: {
    width: "100%",
    fontSize: 16,
    marginTop: 5,
    marginBottom: 15,
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 5,
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    fontSize: 16,
    marginTop: 5,
    marginBottom: 15,
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 5,
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },
  fileInput: {
    marginTop: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 16,
  },
  saveButtonHover: {
    backgroundColor: "#2980b9",
  },
  stats: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
  },
  statBox: {
    flex: 1,
    background: "#f9f9f9",
    margin: "0 10px",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 0 5px rgba(0,0,0,0.05)",
  },
  statBoxH3: {
    marginBottom: 5,
    color: "#333",
  },
  statBoxSpan: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  recommendationList: {
    marginTop: 40,
  },
  recommendationItem: {
    display: "flex",
    alignItems: "center",
    background: "#fdfdfd",
    border: "1px solid #ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textDecoration: "none",
    color: "#222",
    transition: "background 0.2s ease",
  },
  recommendationItemHover: {
    background: "#f2f2f2",
  },
  recommendationImg: {
    width: 60,
    height: 60,
    borderRadius: 5,
    objectFit: "cover",
    marginRight: 15,
    backgroundColor: "#ccc",
  },
  recommendationContent: {
    display: "flex",
    flexDirection: "column",
  },
  recommendationTitle: {
    fontWeight: "bold",
  },
  recommendationRating: {
    color: "#888",
    fontSize: 14,
  },
};

function getUsers() {
  return JSON.parse(localStorage.getItem("recomfilm_users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("recomfilm_users", JSON.stringify(users));
}

function getLoggedInUser() {
  return localStorage.getItem("loggedInUser");
}

function getUserData(username) {
  const users = getUsers();
  return users.find((u) => u.username === username);
}

function saveUserData(user) {
  let users = getUsers();
  const idx = users.findIndex((u) => u.username === user.username);
  if (idx !== -1) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  saveUsers(users);
}

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [reputation, setReputation] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const avatarInputRef = useRef();

  useEffect(() => {
    const loggedUser = getLoggedInUser();
    if (!loggedUser) {
      alert("Please log in first!");
      window.location.href = "/login";
      return;
    }
    const user = getUserData(loggedUser);
    if (!user) {
      alert("User data not found!");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
      return;
    }

    setUsername(user.username);
    setBio(user.bio || "");
    setReputation(user.reputation || 0);
    setRecommendations(user.recommendations || []);
    setCommentsCount(user.comments || 0);
    setAvatar(user.avatar || "/avatar.jpg");
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
      setAvatarFile(file);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (!username.trim()) {
      alert("Username cannot be empty!");
      return;
    }

    const oldUsername = getLoggedInUser();
    const newUsername = username.trim();

    const users = getUsers();

    if (
      newUsername !== oldUsername &&
      users.some((u) => u.username === newUsername)
    ) {
      alert("Username is already taken, please choose another.");
      return;
    }

    let user = users.find((u) => u.username === oldUsername);
    if (!user) {
      alert("User not found!");
      return;
    }

    user.username = newUsername;
    user.bio = bio;

    if (avatarFile) {
      // avatar already set via setAvatar on file read
      user.avatar = avatar;
    }

    // Якщо ім'я змінилося, оновити користувачів і локальний логін
    if (oldUsername !== newUsername) {
      const idx = users.findIndex((u) => u.username === oldUsername);
      if (idx !== -1) users.splice(idx, 1);
      users.push(user);
      localStorage.setItem("loggedInUser", newUsername);
    } else {
      const idx = users.findIndex((u) => u.username === user.username);
      if (idx !== -1) users[idx] = user;
    }

    saveUsers(users);
    alert("Profile saved!");
    setAvatarFile(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  return (
    <div style={styles.body}>
      <nav style={styles.nav}>
        <a href="/" style={styles.navLink}>
          Home
        </a>
        <a href="/create_recommendation" style={styles.navLink}>
          Create Recommendation
        </a>
        <a href="/profile" style={styles.navLink}>
          Profile
        </a>
        <a href="/contact" style={styles.navLink}>
          Contact
        </a>
        <a href="/login" style={styles.navLink}>
          Login
        </a>
        <a href="/register" style={styles.navLink}>
          Register
        </a>
      </nav>

      <div style={styles.profileContainer}>
        <button
          style={styles.logoutButton}
          onClick={logout}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor)
          }
        >
          Log Out
        </button>

        <div style={styles.profileHeader}>
          <img src={avatar} alt="User Avatar" style={styles.avatar} />
          <div style={styles.profileInfo}>
            <label htmlFor="usernameInput" style={styles.label}>
              Username:
            </label>
            <input
              type="text"
              id="usernameInput"
              maxLength={30}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.inputText}
            />

            <label htmlFor="bioInput" style={styles.label}>
              Bio:
            </label>
            <textarea
              id="bioInput"
              rows={4}
              maxLength={300}
              placeholder="Tell us something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={styles.textarea}
            />

            <label htmlFor="avatarInput" style={styles.label}>
              Change Avatar:
            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleAvatarChange}
              ref={avatarInputRef}
              style={styles.fileInput}
            />
          </div>
        </div>

        <button
          className="save-button"
          onClick={saveProfile}
          style={styles.saveButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = styles.saveButtonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = styles.saveButton.backgroundColor)
          }
        >
          Save Changes
        </button>

        <div style={styles.stats}>
          <div style={styles.statBox}>
            <h3 style={styles.statBoxH3}>Reputation</h3>
            <span style={styles.statBoxSpan}>{reputation}</span>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statBoxH3}>Recommendations</h3>
            <span style={styles.statBoxSpan}>{recommendations.length}</span>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statBoxH3}>Comments</h3>
            <span style={styles.statBoxSpan}>{commentsCount}</span>
          </div>
        </div>

        <div style={styles.recommendationList}>
          <h3>My Recommendations</h3>

          {recommendations.length === 0 && <p>No recommendations yet.</p>}

          {recommendations.map((rec) => (
            <a
              key={rec.id}
              href={rec.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.recommendationItem}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.recommendationItemHover.background)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  styles.recommendationItem.background)
              }
            >
              <img
                src={rec.image || "/avatar.jpg"}
                alt={rec.title}
                style={styles.recommendationImg}
              />
              <div style={styles.recommendationContent}>
                <span style={styles.recommendationTitle}>{rec.title}</span>
                <span style={styles.recommendationRating}>
                  Rating: {rec.rating}/10
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
