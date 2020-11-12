import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getToken, clearToken, hitAPI } from "./api";

import Auth from "./components/Auth";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";

const App = () => {
  // a piece of state that represents the status of the current user
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [postList, setPostList] = useState([]);

  function addNewPost(newPost) {
    setPostList([newPost, ...postList]);
  }

  useEffect(() => {
    hitAPI("GET", "/posts")
      .then((data) => {
        const { posts } = data;
        setPostList(posts);
      })
      .catch(console.error);
  }, [isLoggedIn]);

  return (
    <div
      className="app"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <header
        style={{
          gridRow: 1,
          gridColumn: "1 / 3",
          marginBottom: "12px",
          background: "#590004",
          color: "#fff",
          padding: "8px",
        }}
      >
        {isLoggedIn ? (
          <>
            <h1>Thanks for logging in!</h1>
            <button
              onClick={() => {
                clearToken();
                setIsLoggedIn(false);
              }}
            >
              LOG OUT
            </button>
          </>
        ) : (
          <Auth setIsLoggedIn={setIsLoggedIn} />
        )}
      </header>
      <PostList postList={postList} />
      {isLoggedIn ? <PostForm addNewPost={addNewPost} /> : null}
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));