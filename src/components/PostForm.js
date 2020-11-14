import React, { useEffect, useState } from "react";

import { hitAPI } from "../api";

const PostForm = (props) => {
  // maybe later we read title, etc from props... if they exist
  const { addNewPost, _id, setEditablePost, updatePost } = props;

  // title, description, price, location, willDeliver
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [willDeliver, setWillDeliver] = useState(false);

  useEffect(() => {
    setTitle(props.title || "");
    setDescription(props.description || "");
    setPrice(props.price || "");
    setLocation(props.location || "");
    setWillDeliver(props.willDeliver || false);
  }, [_id]);

  function clearForm() {
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setWillDeliver(false);
  }

  const [isDirty, setIsDirty] = useState(false);

  return (
    <form
      className="post-form"
      onSubmit={async (event) => {
        event.preventDefault();

        if (title.length === 0) {
          setIsDirty(true);
          return;
        }

        const postData = {
          post: {
            title,
            description,
            price,
            willDeliver,
          },
        };

        if (location.length > 0) {
          postData.post.location = location;
        }

        try {
          if (_id) {
            const result = await hitAPI("PATCH", `/posts/${_id}`, postData);
            updatePost(result.post);
            setEditablePost({});
          } else {
            const result = await hitAPI("POST", "/posts", postData);
            addNewPost(result.post);
            clearForm();
          }
        } catch (error) {
          console.error(error);
        }
      }}
      style={{
        alignSelf: "flex-start",
        display: "grid",
        gridTemplateColumns: "1fr",
        maxWidth: "480px",
        gap: "10px",
        padding: "8px",
      }}
    >
       {_id ? <h3>Update Your Post</h3> : <h3>Share your stuff</h3>}
      <input
        type="text"
        placeholder="title for your post"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      {isDirty && title.length === 0 ? (
        <h3 style={{ color: "red" }}>You need a title</h3>
      ) : null}
      <textarea
        type="text"
        placeholder="description of the item"
        rows="10"
        columns="80"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <input
        type="text"
        placeholder="requested price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <input
        type="text"
        placeholder="location, leave blank for [On Request]"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={willDeliver}
          onChange={() => setWillDeliver(!willDeliver)}
        />
       <span style={{ marginLeft: "6px" }}>I will deliver this</span>
      </label>
      <button>POST IT</button>
    </form>
  );
};

export default PostForm;