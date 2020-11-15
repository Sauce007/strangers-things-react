import React from "react";
import { hitAPI } from '../api';


function PostList(props) {
  const { postList, setEditablePost, setPostList} = props;
  

  return (
    <div
      className="post-list"
      style={{
        display: "grid",
        gap: "8px",
        gridColumn: 1,
        gridRow: 2,
        overflowY: "scroll",
        padding: "8px",
      }}
    >
      <h3>All Posts</h3>
      {postList.map((post, idx) => {
        return (
          <div
            className="post"
            key={idx}
            style={{
              border: post.isAuthor ? "5px solid #EAAA00" : "1px solid brown",
            }}
          >
            <h5>
              {post.title} ({post.location}) [{post.createdAt}]
            </h5>
            <p>{post.description}</p>
            {post.isAuthor ? (
              <button
                onClick={() => {
                  setEditablePost(post);
                }}
              >
                EDIT
              </button>
            ) : null}
            <div>
              {post.isAuthor ? (
                  <button 
                   onClick={async () => {
                    try {
                        const data = await hitAPI("DELETE", `/posts/${post._id}`);
                        setPostList([...postList]);
                    } catch(error) {
                        console.log(error)
                    }
                  }}>Delete</button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;