import addresses from "../Resources/lib/constants/contracts";
import tokens from "../Resources/lib/constants/tokens";
import { Address } from "../Resources/lib/constants/types";

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56;
  const chainId = mainNetChainId;
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

export const getRCUBEAddress = () => {
  return getAddress(tokens.rcube.address);
};
export const getQBertAddress = () => {
  return getAddress(tokens.qbert.address);
};
export const getnativeFarmAddress = () => {
  return getAddress(addresses.nativeFarm);
};
export const getMulticallAddress = () => {
  return getAddress(addresses.mulltiCall);
};
export const getZeroAddress = () => {
  return getAddress(addresses.zeroAddress);
};
export const getburnAddress = () => {
  return getAddress(addresses.burnAddress);
};
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address);
};
