import React, { useState } from "react";

const StateComponent = () => {
  const [isGreen, setIsGreen] = useState(true);

  return (
    <h1
      onClick={() => setIsGreen(!isGreen)}
      style={{ color: isGreen ? "limegreen" : "crimson" }}
    >
      useState Example
    </h1>
  );
};

export default StateComponent;
