import React, { useState } from "react";
import { hitAPI } from "../api";

const MessageForm = ({ post: { title, _id } }) => {
  const [reply, setReply] = useState("");
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          hitAPI("POST", `/posts/${_id}/messages`, {
            message: { content: reply },
          });
        }}
      >
        <h3>Send Message About {title}:</h3>
        <textarea
          type="scroll"
          value={reply}
          onChange={(event) => {
            setReply(event.target.value);
          }}
          placeholder="Your message will appear here"
        ></textarea>
        <button>Send</button>
      </form>
    </div>
  );
};

export default MessageForm;