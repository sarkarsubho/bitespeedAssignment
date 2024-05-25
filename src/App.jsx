import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./components/Sidebar";

import "./App.css";
import Navbar from "./components/Navbar";

const initialNodes = [
  {
    id: "1",
    type: "input",
    sourcePosition: "right",
    data: { label: "input node" },
    position: { x: 250, y: 5 },
  },
];

let id = localStorage.getItem("nodes")
  ? localStorage.getItem("nodes").length
  : 1;
const getId = () => `${++id}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(localStorage.getItem("nodes")) || initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(localStorage.getItem("edges")) || []
  );
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isConnected, setIsConnected] = useEdgesState(false);
  const [isError, setShowError] = useState(false);

  const onConnect = useCallback((params) => {
    console.log("edge params", params);
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const nodetext = event.dataTransfer.getData(
        "application/reactflow/nodetext"
      );
      console.log("type", type, "nodetext", nodetext);
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        sourcePosition: "right",
        targetPosition: "left",
        data: { label: `${nodetext} ` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const areAllNodesConnected = () => {
    if (reactFlowInstance) {
      const nodes = reactFlowInstance.getNodes();
      const edges = reactFlowInstance.getEdges();
      const areAllNodesConnected =
        getConnectedEdges(nodes, edges).length === nodes.length - 1;

      // if (!areAllNodesConnected) {
      //   alert("Error: Not all nodes are connected!");
      // }

      return areAllNodesConnected;
    }
  };
  const checkConnection = () => {
    const connected = areAllNodesConnected();
    setIsConnected(connected);
    setShowError(!connected);
    console.log("connected", connected);
    if (connected) {
      // can save the nodes and edges to the database
    }
  };

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [nodes, edges]);

  return (
    <>
      <Navbar
        isConnected={isConnected}
        isError={isError}
        checkConnection={checkConnection}
      />
      {/* <button onClick={checkConnection} className="check-connection-button">
        Check Connection
      </button> */}
      <div className="dndflow">
        <ReactFlowProvider className="reactflow">
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
          <Sidebar />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default App;
