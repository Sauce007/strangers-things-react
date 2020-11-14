import React from "react";

const PostList = (props) => {
  const { postList, setEditablePost, deletePost} = props;

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
            <div>{ post.isAuthor ? <button
            onClick ={()=>{
              deletePost(post);
            }}>DELETE</button> : " "}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;