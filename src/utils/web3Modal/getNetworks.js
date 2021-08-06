import { connectors } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  mathwlt,
  twtwlt,
  sfplwlt,
  bnbwlt,
  mtmskwlt
} from "../../UIMain/assets/wallets";

export const providerOptions = {
  /* See Provider Options Section */
  injected: {
    display: {
      name: "Metamask",
      description: "Metamask",
      logo: mtmskwlt
    }
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: "https://bsc-dataseed.binance.org/",
        56: "https://bsc-dataseed.binance.org/"
      }
    }
  },
  "custom-binance": {
    display: {
      name: "Binance",
      description: "Binance Chain Wallet",
      logo: bnbwlt
    },
    package: "binance",
    connector: async (ProviderPackage, options) => {
      let provider = window.BinanceChain;
      provider.autoRefreshOnNetworkChange = true;
      await provider.enable();
      return provider;
    }
  },
  "custom-math": {
    display: {
      name: "Math",
      description: "Math Wallet",
      logo: mathwlt
    },
    package: "math",
    connector: connectors.injected
  },
  "custom-twt": {
    display: {
      name: "Trust",
      description: "Trust Wallet",
      logo: twtwlt
    },
    package: "twt",
    connector: connectors.injected
  },
  "custom-safepal": {
    display: {
      name: "SafePal",
      description: "SafePal App",
      logo: sfplwlt
    },
    package: "safepal",
    connector: connectors.injected
  }
};
