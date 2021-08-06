import random from "lodash/random";

//# 10+ nodes balanced, US/EU
const REACT_APP_NODE_1 = "https://rpc-mainnet.matic.network";

//# 10+ nodes balanced, US/EU
const REACT_APP_NODE_2 = "https://matic-mainnet.chainstacklabs.com";

//# 10+ nodes balanced in each region, global
const REACT_APP_NODE_3 = "https://rpc-mainnet.maticvigil.com";

// Ankr node test node
const REACT_APP_NODE_4 = "https://rpc-mainnet.matic.quiknode.pro";

const REACT_APP_NODE_5 = "https://matic-mainnet-full-rpc.bwarelabs.com";

const REACT_APP_NODE_6 = "https://matic-mainnet-archive-rpc.bwarelabs.com";

// Array of available nodes to connect to
export const nodes = [
  REACT_APP_NODE_1,
  REACT_APP_NODE_2,
  REACT_APP_NODE_3,
  REACT_APP_NODE_4,
  REACT_APP_NODE_5,
  REACT_APP_NODE_6
];

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

export default getNodeUrl;
