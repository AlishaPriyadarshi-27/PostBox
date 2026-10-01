import { useState } from "react";
import "./App.css";

function App() {
  const [post, setPost] = useState("");
  const [category, setCategory] = useState("Study");
  const [mood, setMood] = useState("😊");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const categories = ["Study", "Tech", "Fitness", "Personal", "Other"];

  const isOverLimit = post.length > 100;
  const isEmpty = post.trim().length === 0;
  const isDisabled = isEmpty || isOverLimit;

  const wordCount = post.trim()
    ? post.trim().split(/\s+/).length
    : 0;

  // CREATE / UPDATE POST
  const handlePost = () => {
    if (isDisabled) return;

    if (editingId) {
      setPosts(
        posts.map((item) =>
          item.id === editingId
            ? {
                ...item,
                text: post,
                category,
                mood,
              }
            : item
        )
      );

      setEditingId(null);
    } else {
      const newPost = {
        id: Date.now(),
        text: post,
        category,
        mood,
        likes: 0,
        pinned: false,
        time: new Date().toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };

      setPosts([newPost, ...posts]);
    }

    setPost("");
    setMood("😊");
  };

  // DELETE
  const deletePost = (id) => {
    setPosts(posts.filter((item) => item.id !== id));
  };

  // LIKE
  const likePost = (id) => {
    setPosts(
      posts.map((item) =>
        item.id === id
          ? { ...item, likes: item.likes + 1 }
          : item
      )
    );
  };

  // PIN
  const togglePin = (id) => {
    setPosts(
      posts.map((item) =>
        item.id === id
          ? { ...item, pinned: !item.pinned }
          : item
      )
    );
  };

  // EDIT
  const editPost = (item) => {
    setPost(item.text);
    setCategory(item.category);
    setMood(item.mood);
    setEditingId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // COPY
  const copyPost = async (text) => {
    await navigator.clipboard.writeText(text);
    alert("Post copied!");
  };

  // CLEAR
  const clearDraft = () => {
    setPost("");
    setEditingId(null);
    setMood("😊");
  };

  // SIMPLE AI ASSIST DEMO
  const aiAssist = () => {
    if (!post.trim()) {
      setPost(
        "Today I learned something new and wanted to share it with everyone."
      );
      return;
    }

    const improved =
      post.charAt(0).toUpperCase() +
      post.slice(1);

    setPost(improved + " ✨");
  };

  // SEARCH + FILTER
  const filteredPosts = posts
    .filter((item) => {
      const matchesSearch = item.text
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.category === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="app">

      {/* Decorative background */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <main className="container">

        {/* HEADER */}
        <header className="header">

          <div className="brand">
            <div className="brand-icon">✦</div>

            <div>
              <h1>
                Post<span>Box</span>
              </h1>

              <p>
                Create. Share. Express yourself.
              </p>
            </div>
          </div>

          <div className="stats">
            <strong>{posts.length}</strong>
            <span>Total Posts</span>
          </div>

        </header>


        {/* COMPOSER */}
        <section className="composer">

          <div className="composer-heading">

            <div className="avatar">
              A
            </div>

            <div>
              <h2>
                {editingId
                  ? "Edit your post"
                  : "Create a Post"}
              </h2>

              <p>
                Share what's on your mind
              </p>
            </div>

          </div>


          {/* CATEGORY */}
          <label className="section-label">
            Choose a category
          </label>

          <div className="categories">

            {categories.map((item) => (

              <button
                key={item}
                className={
                  category === item
                    ? "category active"
                    : "category"
                }
                onClick={() => setCategory(item)}
              >

                {item === "Study" && "📚"}
                {item === "Tech" && "💻"}
                {item === "Fitness" && "💪"}
                {item === "Personal" && "🌿"}
                {item === "Other" && "✨"}

                <span>{item}</span>

              </button>

            ))}

          </div>


          {/* MOOD */}
          <label className="section-label">
            How are you feeling?
          </label>

          <div className="moods">

            {["😊", "🔥", "🤓", "💪", "❤️", "🚀", "😎"].map(
              (item) => (

                <button
                  key={item}
                  className={
                    mood === item
                      ? "mood active-mood"
                      : "mood"
                  }
                  onClick={() => setMood(item)}
                >
                  {item}
                </button>

              )
            )}

          </div>


          {/* TEXT AREA */}
          <div
            className={
              isOverLimit
                ? "textarea-wrapper danger"
                : "textarea-wrapper"
            }
          >

            <textarea
              value={post}
              onChange={(e) =>
                setPost(e.target.value)
              }
              placeholder="Write something worth sharing..."
            />

            <div className="textarea-footer">

              <button
                className="ai-button"
                onClick={aiAssist}
              >
                ✨ AI Assist
              </button>

              <div className="counters">

                <span>
                  {wordCount} words
                </span>

                <span
                  className={
                    isOverLimit
                      ? "danger-text"
                      : ""
                  }
                >
                  {post.length}/100
                </span>

              </div>

            </div>

          </div>


          {/* PROGRESS BAR */}
          <div className="progress">

            <div
              className={
                isOverLimit
                  ? "progress-fill danger-fill"
                  : "progress-fill"
              }
              style={{
                width: `${Math.min(
                  post.length,
                  100
                )}%`,
              }}
            />

          </div>


          {/* ERROR */}
          {isOverLimit && (

            <div className="error">
              ⚠️ Character limit exceeded.
              Please remove some characters.
            </div>

          )}


          {/* COMPOSER FOOTER */}
          <div className="composer-bottom">

            <div className="draft-info">

              <span className="live-dot"></span>

              <span>
                {editingId
                  ? "Editing post"
                  : "Draft saved locally"}
              </span>

            </div>


            <div className="composer-actions">

              {post && (

                <button
                  className="clear-button"
                  onClick={clearDraft}
                >
                  Clear
                </button>

              )}

              <button
                className="publish-button"
                disabled={isDisabled}
                onClick={handlePost}
              >

                {editingId
                  ? "✓ Update Post"
                  : "🚀 Publish Post"}

              </button>

            </div>

          </div>

        </section>


        {/* FEED */}
        <section className="feed">

          <div className="feed-heading">

            <div>
              <h2>Your Posts</h2>

              <p>
                Everything you've shared.
              </p>
            </div>

            <div className="feed-count">
              {filteredPosts.length} shown
            </div>

          </div>


          {/* SEARCH */}
          <div className="search-box">

            <span>🔎</span>

            <input
              type="text"
              placeholder="Search your posts..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* FILTER */}
          <div className="filters">

            <button
              className={
                filter === "All"
                  ? "filter active-filter"
                  : "filter"
              }
              onClick={() => setFilter("All")}
            >
              All
            </button>

            {categories.map((item) => (

              <button
                key={item}
                className={
                  filter === item
                    ? "filter active-filter"
                    : "filter"
                }
                onClick={() => setFilter(item)}
              >
                {item}
              </button>

            ))}

          </div>


          {/* EMPTY */}
          {filteredPosts.length === 0 ? (

            <div className="empty">

              <div className="empty-icon">
                ✍️
              </div>

              <h3>
                {posts.length === 0
                  ? "No posts yet"
                  : "No matching posts"}
              </h3>

              <p>
                {posts.length === 0
                  ? "Create your first post and it will appear here."
                  : "Try another search or category."}
              </p>

            </div>

          ) : (

            <div className="posts">

              {filteredPosts.map((item) => (

                <article
                  className={
                    item.pinned
                      ? "post-card pinned"
                      : "post-card"
                  }
                  key={item.id}
                >

                  {/* POST TOP */}
                  <div className="post-top">

                    <div className="user">

                      <div className="small-avatar">
                        A
                      </div>

                      <div>
                        <strong>
                          Alisha
                        </strong>

                        <span>
                          {item.time}
                        </span>
                      </div>

                    </div>


                    <div className="post-meta">

                      {item.pinned && (
                        <span className="pinned-label">
                          📌 Pinned
                        </span>
                      )}

                      <span className="category-badge">
                        {item.category}
                      </span>

                    </div>

                  </div>


                  {/* POST CONTENT */}
                  <div className="post-content">

                    <span className="post-mood">
                      {item.mood}
                    </span>

                    <p>
                      {item.text}
                    </p>

                  </div>


                  {/* POST FOOTER */}
                  <div className="post-footer">

                    <div className="post-actions">

                      <button
                        className="like"
                        onClick={() =>
                          likePost(item.id)
                        }
                      >
                        ❤️ {item.likes}
                      </button>

                      <button
                        onClick={() =>
                          copyPost(item.text)
                        }
                      >
                        📋 Copy
                      </button>

                      <button
                        onClick={() =>
                          editPost(item)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          togglePin(item.id)
                        }
                      >
                        {item.pinned
                          ? "📌 Unpin"
                          : "📌 Pin"}
                      </button>

                    </div>

                    <button
                      className="delete"
                      onClick={() =>
                        deletePost(item.id)
                      }
                    >
                      🗑️
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>


        <footer>
          Built with React • useState • Controlled Components
        </footer>

      </main>

    </div>
  );
}

export default App;