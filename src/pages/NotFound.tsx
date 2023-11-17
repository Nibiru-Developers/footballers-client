import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <h1>404 - NOT FOUND</h1>
        <Link to={"/"}>Back</Link>
      </div>
    </Fragment>
  );
}
