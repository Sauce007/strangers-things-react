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
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecent, setIsRecent] = useState(false);

  function addNewPost(newPost) {
    setPostList([...postList, newPost]);
  }

  function filteredPosts(){
      const postFilteredBySearchTerm = postList.filter ((post) =>{
          return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      }); 
      const postFilteredByRecency = postFilteredBySearchTerm.filter((post) =>{
          if (!isRecent){
              return true;
          }
          const postTime = Date.parse(post.createdAt);
          const nowTime = Date.now();
          const TWO_HOURS = 1000 * 60 * 60 * 4;

          return postTime + TWO_HOURS >= nowTime;
      });
      return postFilteredByRecency.reverse();
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


        <div classname= "filter-options">
            <input
            type = "text"
            value = {searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="filter your posts"
            />
            <label>
            <input
            type = "checkbox"
            checked = {isRecent}
            onChange = {() => setIsRecent(!isRecent)}
            
            />
            Recent Posts Only
            </label>
        </div>



      </header>
      <PostList postList={filteredPosts()} />
      {isLoggedIn ? <PostForm addNewPost={addNewPost} /> : null}
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));