import React from "react";
import PostH from "./PostH";

export default function PostSection({ title, posts }) {
  return (
    <div className="flex flex-col my-4">
      <div className="text-text font-medium">{title}</div>
      <div className=" grid grid-cols-4 gap-x-2 mt-5">
        {posts.map((post, index) => (
          <PostH key={index} post={post} />
        ))}
      </div>
    </div>
  );
}
