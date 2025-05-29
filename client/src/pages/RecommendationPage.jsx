import React, { useState } from "react";

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 30,
    backgroundColor: "#f7f7f7",
  },
  container: {
    maxWidth: 900,
    margin: "auto",
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },
  mainTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    fontSize: 18,
    color: "#f39c12",
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    color: "#444",
  },
  recommendations: {
    marginTop: 30,
  },
  recommendation: {
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationText: {
    maxWidth: "80%",
  },
  likeButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 5,
    cursor: "pointer",
  },
  likeButtonHover: {
    backgroundColor: "#2980b9",
  },
  commentSection: {
    marginTop: 40,
  },
  commentFormTextarea: {
    width: "100%",
    height: 80,
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  commentFormButton: {
    marginTop: 10,
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 5,
    cursor: "pointer",
  },
  commentFormButtonHover: {
    backgroundColor: "#27ae60",
  },
  existingComments: {
    marginTop: 30,
  },
  comment: {
    background: "#f2f2f2",
    borderLeft: "4px solid #ccc",
    padding: "10px 15px",
    marginBottom: 15,
    borderRadius: 5,
    position: "relative",
  },
  commentStrong: {
    display: "block",
    fontSize: 14,
    color: "#333",
  },
  commentDate: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  commentText: {
    margin: "0 0 10px 0",
  },
  commentActions: {
    display: "flex",
    gap: 15,
    fontSize: 14,
    color: "#555",
  },
  commentActionButton: {
    background: "none",
    border: "none",
    color: "#3498db",
    cursor: "pointer",
    padding: 0,
  },
  commentActionButtonHover: {
    textDecoration: "underline",
  },
  replyForm: {
    marginTop: 10,
  },
  replyFormHidden: {
    display: "none",
  },
  replyFormTextarea: {
    width: "100%",
    height: 50,
    padding: 5,
    fontSize: 13,
    borderRadius: 5,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  replyFormButton: {
    marginTop: 5,
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
  },
  replyFormButtonHover: {
    backgroundColor: "#2980b9",
  },
  replies: {
    marginTop: 10,
    marginLeft: 20,
    borderLeft: "2px solid #ddd",
    paddingLeft: 10,
  },
  reply: {
    background: "#e9e9e9",
    borderRadius: 5,
    padding: "8px 10px",
    marginBottom: 8,
  },
  replyStrong: {
    fontSize: 13,
    color: "#222",
  },
  replyDate: {
    fontSize: 11,
    color: "#666",
    marginBottom: 3,
  },
};

function Recommendation() {
  // Початкові дані рекомендацій
  const recommendedTitles = [
    {
      id: 1,
      title: "Arrival",
      description:
        "Explores nonlinear time and emotional depth in a first-contact scenario.",
      likes: 0,
    },
    {
      id: 2,
      title: "Contact",
      description:
        "A story of scientific faith, discovery, and personal belief through cosmic communication.",
      likes: 0,
    },
    {
      id: 3,
      title: "Ad Astra",
      description:
        "Follows a solitary space mission and the psychological journey of a son searching for his father.",
      likes: 0,
    },
  ];

  // Початкові коментарі
  const initialComments = [
    {
      id: 1,
      author: "Anna K.",
      date: "May 25, 2025",
      text: 'Great list! "Arrival" fits perfectly with the emotional and thematic depth of Interstellar.',
      likes: 2,
      replies: [
        {
          id: 1,
          author: "FilmFan123",
          date: "May 26, 2025",
          text: "I agree, Arrival really is a fantastic match!",
        },
      ],
    },
    {
      id: 2,
      author: "FilmBuff42",
      date: "May 26, 2025",
      text: 'Would also recommend “Moon” – minimalistic but powerful and thought-provoking.',
      likes: 0,
      replies: [],
    },
  ];

  const [likes, setLikes] = useState(
    recommendedTitles.reduce((acc, r) => {
      acc[r.id] = 0;
      return acc;
    }, {})
  );
  const [comments, setComments] = useState(initialComments);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [newReplyText, setNewReplyText] = useState({});
  const [newCommentText, setNewCommentText] = useState("");

  // Лайк для рекомендації
  const handleLikeRecommendation = (id) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // Лайк для коментаря
  const handleLikeComment = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1, liked: true } : c
      )
    );
  };

  // Відкриття/закриття форми відповіді
  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Зміна тексту відповіді
  const handleReplyTextChange = (commentId, text) => {
    setNewReplyText((prev) => ({
      ...prev,
      [commentId]: text,
    }));
  };

  // Надсилання відповіді
  const submitReply = (commentId) => {
    const text = newReplyText[commentId]?.trim();
    if (!text) {
      alert("Reply cannot be empty!");
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                { id: Date.now(), author: "You", date: dateStr, text },
              ],
            }
          : c
      )
    );
    setNewReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
  };

  // Зміна тексту нового коментаря
  const handleNewCommentChange = (e) => {
    setNewCommentText(e.target.value);
  };

  // Надсилання нового коментаря
  const submitNewComment = (e) => {
    e.preventDefault();
    const text = newCommentText.trim();
    if (!text) {
      alert("Comment cannot be empty!");
      return;
    }
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const newComment = {
      id: Date.now(),
      author: "You",
      date: dateStr,
      text,
      likes: 0,
      replies: [],
    };

    setComments((prev) => [...prev, newComment]);
    setNewCommentText("");
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.mainTitle}>
          <h1>Interstellar</h1>
          <div style={styles.rating}>⭐ 4.7 / 5</div>
        </div>

        <div style={styles.description}>
          <strong>
            Atmospheric sci-fi journey through space, time, and emotional depth.
          </strong>
          <br />
          This recommendation list includes titles that explore similar
          scientific, philosophical, and emotional themes.
        </div>

        <div style={styles.recommendations}>
          <h2>Recommended Titles</h2>

          {recommendedTitles.map((rec) => (
            <div key={rec.id} style={styles.recommendation}>
              <div style={styles.recommendationText}>
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
              </div>
              <button
                style={styles.likeButton}
                onClick={() => handleLikeRecommendation(rec.id)}
              >
                Like 👍 {likes[rec.id] || 0}
              </button>
            </div>
          ))}
        </div>

        <div style={styles.commentSection}>
          <h3>Leave a Comment</h3>
          <form onSubmit={submitNewComment}>
            <textarea
              style={styles.commentFormTextarea}
              value={newCommentText}
              onChange={handleNewCommentChange}
              placeholder="Share your thoughts..."
            />
            <button type="submit" style={styles.commentFormButton}>
              Submit
            </button>
          </form>
        </div>

        <div style={styles.existingComments}>
          <h3>Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} style={styles.comment}>
              <strong style={styles.commentStrong}>{comment.author}</strong>
              <div style={styles.commentDate}>{comment.date}</div>
              <p style={styles.commentText}>{comment.text}</p>
              <div style={styles.commentActions}>
                <button
                  style={{
                    ...styles.commentActionButton,
                    cursor: comment.liked ? "default" : "pointer",
                    color: comment.liked ? "gray" : "#3498db",
                  }}
                  disabled={comment.liked}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  Like (<span>{comment.likes}</span>)
                </button>
                <button
                  style={styles.commentActionButton}
                  onClick={() => toggleReplyForm(comment.id)}
                >
                  Reply
                </button>
              </div>

              <form
                style={
                  showReplyForm[comment.id]
                    ? styles.replyForm
                    : { ...styles.replyForm, display: "none" }
                }
                onSubmit={(e) => {
                  e.preventDefault();
                  submitReply(comment.id);
                }}
              >
                <textarea
                  style={styles.replyFormTextarea}
                  placeholder="Write a reply..."
                  value={newReplyText[comment.id] || ""}
                  onChange={(e) =>
                    handleReplyTextChange(comment.id, e.target.value)
                  }
                />
                <button type="submit" style={styles.replyFormButton}>
                  Submit Reply
                </button>
              </form>

              <div style={styles.replies}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} style={styles.reply}>
                    <strong style={styles.replyStrong}>{reply.author}</strong>
                    <div style={styles.replyDate}>{reply.date}</div>
                    <p>{reply.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendation;
