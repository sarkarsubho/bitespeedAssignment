import React from "react";

const Sidebar = () => {
  const [innertext, setInnertext] = React.useState("");
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow/nodetext", innertext);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      {/* <div>
        <button>olksskkdk</button>
      </div> */}
      <div className="description">messages</div>
      <hr />

      <textarea
        placeholder="Type a node text"
        value={innertext}
        onChange={(e) => {
          setInnertext(e.target.value);
        }}
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      ></textarea>
    </aside>
  );
};

export default Sidebar;
