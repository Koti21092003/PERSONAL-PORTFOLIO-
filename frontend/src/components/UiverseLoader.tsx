// From Uiverse.io by Cobp - https://uiverse.io/Cobp/nice-bullfrog-68
// MIT License, Copyright (c) Cobp (Fabio Cobb)

import React from "react";

interface UiverseLoaderProps {
  label?: string;
  className?: string;
}

const UiverseLoader: React.FC<UiverseLoaderProps> = ({ label = "Loading...", className = "" }) => {
  return (
    <div className={`uiverse-loader ${className}`.trim()}>
      <div className="uiverse-load-inner uiverse-load-one" />
      <div className="uiverse-load-inner uiverse-load-two" />
      <div className="uiverse-load-inner uiverse-load-three" />
      <span className="uiverse-text">{label}</span>
    </div>
  );
};

export default UiverseLoader;
