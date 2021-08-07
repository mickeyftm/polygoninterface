import Web3Modal from "web3modal";
import { providerOptions } from "../../utils/web3Modal/getNetworks";

export const createweb3Modal = new Web3Modal({
  network: "polygon", // optional or "binance"
  cacheProvider: false, // optional
  providerOptions, // required
  disableInjectedProvider: false,
  theme: {
    background: "var(--c-background-3)",
    main: "var(--c-txt)",
    secondary: "var(--c-primary-hover)",
    border: "var(--c-background-3)",
    hover: "var(--c-txt-2)"
  }
  //providerOptions // required
});
