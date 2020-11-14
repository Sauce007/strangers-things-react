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
  const [viewMessages, setViewMessages] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [editablePost, setEditablePost] = useState({});
  const [_deletePost, setDeletePost] = useState({});

  function addNewPost(newPost) {
    setPostList([...postList, newPost]);
  }

  function deletePost(postToDelete) {
      let index = postList.findIndex((post) => {
          return post._id === postToDelete._id;
      });
      if (index > -1) {
          let postListCopy = [...postList];
          postListCopy.slice(index);
          setPostList(postListCopy);
      }
  }

  function updatePost(updatedPost) {
    let index = postList.findIndex((post) => {
      return post._id === updatedPost._id;
    });

    if (index > -1) {
      let postListCopy = [...postList];
      postListCopy[index] = updatedPost;
      setPostList(postListCopy);
    }
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
    if (!isLoggedIn) {
      setUserMessages([]);
      return;
    }

    hitAPI("get", "/users/me")
      .then((data) => {
        const { messages } = data;
        setUserMessages(messages);
      })
      .catch(console.error);
  }, [isLoggedIn]);


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
        position: "relative",
        height: "100vh",
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
      <PostList postList={filteredPosts()} setEditablePost={setEditablePost} />
      {isLoggedIn ? (
        <PostForm
          addNewPost={addNewPost}
          updatePost={updatePost}
          {...editablePost}
          setEditablePost={setEditablePost}
          deletePost={deletePost}
          
        />
      ) : null}
      <div
        className="personal-messages"
        style={{
          position: "fixed",
          bottom: "12px",
          right: "12px",
        }}
      >
        {viewMessages ? (
          <div
            className="personal-message-list"
            style={{
              padding: "12px",
              overflowY: "scroll",
              background: "#ddf",
              marginBottom: "12px",
              boxShadow: "0 2px 4px -2px black",
              borderRadius: "4px",
              fontFamily: "sans-serif",
            }}
          >
            {userMessages.map((msg, idx) => {
              return (
                <p key={idx}>
                  On {msg.post.title}, {msg.fromUser.username} says:{" "}
                  {msg.content}
                </p>
              );
            })}
          </div>
        ) : null}

        <div
          className="personal-message-list-toggle"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            maxHeight: "480px",
          }}
        >
          <span
            className="material-icons"
            style={{
              padding: "6px",
              borderRadius: "50%",
              background: "#f88",
              color: "#fff",
            }}
            onClick={() => setViewMessages(!viewMessages)}
          >
            mail
          </span>
        </div>
      </div>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));