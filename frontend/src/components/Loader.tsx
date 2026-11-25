// From Uiverse.io by Cobp - https://uiverse.io/Cobp/nice-bullfrog-68
// MIT License, Copyright (c) Cobp (Fabio Cobb)

import UiverseLoader from "./UiverseLoader";

const Loader = ({ label }: { label?: string }) => {
  return <UiverseLoader label={label ?? "Loading..."} />;
};

export default Loader;
