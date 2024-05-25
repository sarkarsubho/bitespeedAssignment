import React from "react";

const Navbar = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 0px",
        background: "lightgray",
        height: "8vh",
        // width:"100vw",
        boxSizing: "border-box",
      }}
    >
      <div></div>
      {props.isError && (
        <button
          style={{
            background: "#FBCCCA",
          }}
        >
          Cannot save Flow
        </button>
      )}
      <button
        style={{
          marginRight: " 50px",
          // marginBottom:"20px"
          border: "2px solid lightblue",
        }}
        onClick={props.checkConnection}
      >
        Save Changes
      </button>
    </div>
  );
};

export default Navbar;
