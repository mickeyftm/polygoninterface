import React from "react";
class Canvas extends React.Component {
  render() {
    return (
      <canvas
        id="canvas"
        style={{
          zIndex: 1,
          width: "100%",
          height: "35%"
        }}
      />
    );
  }
}

export default Canvas;
