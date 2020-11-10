import React from "react";

const PostList = (props) => {
  const { postList } = props;

  return (
    <div
      className="post-list"
      style={{
        display: "grid",
        gap: "8px",
        gridColumn: 1,
        gridRow: 2,
      }}
    >
      <h3>All Posts</h3>
      {postList.map((post, idx) => {
        return (
          <div
            className="post"
            key={idx}
            style={{
              border: post.isAuthor ? "5px solid gold" : "1px solid brown",
            }}
          >
            <h5>
              {post.title} ({post.location})
            </h5>
            <p>{post.description}</p>
            <div>{ post.isAuthor ? <button>DELETE</button> : " "}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;