import React from "react";

interface BlogHeadingProps {
  title: string;
  date: string;
}

export const BlogHeading = (props: BlogHeadingProps) => {
  let dateMS = Date.parse(props.date);
  let date = new Date(dateMS).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
  return (
    <div>
      <h1>{props.title}</h1>
      <div style={{ fontStyle: "italic", paddingBottom: "32px" }}>- {date}</div>
    </div>
  );
};
