import React, { useCallback, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import Web3 from "web3";
import { tryFetchPrice } from "../../utils/getPrices";
import { logo, qbertpxl, qbertdice } from "../assets/logos";
import { popupclose, popupcopy } from "../assets/svg";
//mport utils from "../../utils/aprLib/index";
import { formatNumberHumanize } from "../../utils/formatBalance";
import { tokenAbi } from "../../Resources/lib/abi";
import { shortenAddress } from "../../utils/stylish";
import { Contract, Provider } from "ethcall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createweb3Modal } from "../../utils/web3Modal/createweb3Modal";
import getRpcUrl from "../../utils/getRpcUrl";
//import {providerOptions} from "../../utils/web3Modal/getNetworks"
const RPC_URL = getRpcUrl();
const providerQbert = new JsonRpcProvider(RPC_URL);

//import logo from "./UIMain/assets/logos/QBERTSWAG.png";
//import getWeb3 from "../../utils/web3Utils";
//import Util from "./utils/aprLib/index.js";
//import nativeFarmAbi from "./utils/nativeFarmAbi.js";
let web3 = "";
//let web3Modal = "";
let modalProvider = "";
let provider = "";
let injectedChainId = "";
let accounts = "";

const wbnbAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const qbertAddress = "0x6ED390Befbb50f4b492f08Ea0965735906034F81";
const zeroAdress = "0x0000000000000000000000000000000000000000";
const burnAddress = "0x000000000000000000000000000000000000dEaD";

export default function Nav() {
  const [web3Modal, setModal] = useState("");
  var [menu, setMenu] = useState(false);
  var [account, setAccount] = useState("");
  var [data, setData] = useState({
    balance: 0,
    burnBalance: 0,
    totalSupply: 0,
    ciculatingSupply: 0,
    price: 0,
    marketCap: 0
  });

  const toggleMenu = () => {
    if (!menu) {
      setMenu(true);
    } else {
      setMenu(false);
    }
  };

  async function startup(web3Modal) {
    if (!window.account) {
      console.log("starting up");

      //web3Modal

      modalProvider = await web3Modal.connect();
      provider = new Web3(modalProvider);
      web3 = new Web3(provider);
      injectedChainId = await web3.eth.getChainId();
      //getWeb3(provider);
      //window.web3 = new Web3(provider);
      //window.ethereum = new Web3(provider);
      accounts = await web3.eth.getAccounts();
      window.account = accounts[0];
      setAccount(window.account);
      console.log({ injectedChainId });
      //await getQbertStats();
    } else {
      console.log("Disconnect");
      await onDisconnect();
      setAccount(window.account);
      //await getQbertStats();
    }
  }

  async function onDisconnect() {
    web3 = "";
    provider = "";
    accounts = "";
    window.account = "";
    //window.web3 = "";
    //window.ethereum = "";
    setAccount("");
    //onDisconnect();
    await web3Modal.clearCachedProvider();
  }

  const getQbertStats = useCallback(async () => {
    //web3ext = getWeb3NoAccount();
    let multiCall = new Provider();
    await multiCall.init(providerQbert);
    let qbert = new Contract(qbertAddress, tokenAbi);
    // hacer algo
    //if (!data.loaded) {
    try {
      if (window.account) {
        //setAccount(window.account);
        let balanceCall = qbert.balanceOf(window.account);
        let burnBalanceCall = qbert.balanceOf(burnAddress);
        let totalSupplyCall = qbert.totalSupply();
        let [balance, burnBalance, totalSupply] = await multiCall.all([
          balanceCall,
          burnBalanceCall,
          totalSupplyCall
        ]);
        let ciculatingSupply = totalSupply - burnBalance;
        let bnbPrice = await tryFetchPrice(wbnbAddress);
        let price = await tryFetchPrice(qbertAddress);
        window.qbertprice = price;
        window.bnbprice = bnbPrice;
        //let price = await utils.getTokenPrice("0x6D45A9C8f812DcBb800b7Ac186F1eD0C055e218f",18);
        let marketCap = price * (ciculatingSupply / 10 ** 18);
        setData({
          balance: balance / 10 ** 18,
          burnBalance: burnBalance / 10 ** 18,
          totalSupply: totalSupply / 10 ** 18,
          ciculatingSupply: ciculatingSupply / 10 ** 18,
          price: price,
          marketCap: marketCap
        });
      } else {
        let balanceCall = qbert.balanceOf(zeroAdress);
        let burnBalanceCall = qbert.balanceOf(burnAddress);
        let totalSupplyCall = qbert.totalSupply();
        let [balance, burnBalance, totalSupply] = await multiCall.all([
          balanceCall,
          burnBalanceCall,
          totalSupplyCall
        ]);
        let ciculatingSupply = totalSupply - burnBalance;
        let bnbPrice = await tryFetchPrice(wbnbAddress);
        let price = await tryFetchPrice(qbertAddress);
        window.qbertprice = price;
        window.bnbprice = bnbPrice;
        //let price = await utils.getTokenPrice("0x6D45A9C8f812DcBb800b7Ac186F1eD0C055e218f",18);
        let marketCap = price * (ciculatingSupply / 10 ** 18);
        setData({
          balance: balance / 10 ** 18,
          burnBalance: burnBalance / 10 ** 18,
          totalSupply: totalSupply / 10 ** 18,
          ciculatingSupply: ciculatingSupply / 10 ** 18,
          price: price,
          marketCap: marketCap
        });
      }
    } catch (error) {
      console.log(error);
    }
    //}
  }, []);

  useEffect(() => {
    //window.ts = { value: 0, pending: 0, deposited: 0, added: [] };
    //async function updateNav() {await getQbertStats();}
    setModal(createweb3Modal);
    getQbertStats();
    //setAccount(window.account);
    const interval = setInterval(() => {
      // do something
      //updateNav();
      getQbertStats();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [account]);

  return (
    <header>
      <div className="top-notification hidden">
        <span className="txt"></span>
        <a className="btn-close"></a>
      </div>
      <div className="container">
        <div className="logo">
          <a href="/">
            <img src={logo} />
          </a>
        </div>
        <menu>
          <ul>
            <li className="selected">
              <a href="#">Earn</a>
            </li>
            <li>
              <a
                href="https://exchange.pancakeswap.finance/#/pool"
                target="_blank"
              >
                Create LP<div className="mini-tag">SWAP</div>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=3zsoLuEvTz8"
                target="_blank"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                href="https://retrodefi.gitbook.io/retro-defi/"
                target="_blank"
              >
                Docs
              </a>
            </li>
            <li>
              <a href="https://luckyqbert.retrofarms.net/" target="_blank">
                Lucky QBERT<div className="mini-tag">PLAY</div>
              </a>
            </li>
          </ul>
        </menu>
        <div className="wallet">
          <div className="qbert-price">
            <img src={qbertpxl} />
            <div className="txt ml-10 price">
              ${formatNumberHumanize(data.price, 2)}
            </div>
          </div>
          <Popup
            trigger={
              <a className="btn small ml-20 primary buy-qbert hidden">
                {" "}
                QBERT Stats{" "}
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <div className="popup-container visible">
                <div
                  id="popup-buy-qbert"
                  className="popup"
                  style={{ display: "block" }}
                >
                  <div className="header">
                    <div className="ttl">Your Qbert</div>
                    <img
                      className="btn close"
                      src={popupclose}
                      onClick={close}
                    />
                  </div>
                  <div className="content">
                    <img src="images/qbert.png" />
                    <div className="balance">
                      {formatNumberHumanize(data.balance, 2)}
                    </div>
                    <div className="key-value">
                      <div className="key">Price</div>
                      <div className="value qbert-price">
                        ${formatNumberHumanize(data.price, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Current Supply</div>
                      <div className="value qbert-supply">
                        {formatNumberHumanize(data.totalSupply, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Circulating Supply</div>
                      <div className="value qbert-supply">
                        {formatNumberHumanize(data.ciculatingSupply, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Market Cap</div>
                      <div className="value market-cap">
                        ${formatNumberHumanize(data.marketCap, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Contract Address</div>
                      <div className="value qbert-contract">
                        <span />
                        <img className="copy" src={popupcopy} />
                      </div>
                    </div>
                    <a
                      className="chart"
                      target="_blank"
                      href="https://dex.guru/token/0x6ed390befbb50f4b492f08ea0965735906034f81-bsc"
                    >
                      View chart
                    </a>
                    <a
                      className="btn primary buy"
                      target="_blank"
                      href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x6ED390Befbb50f4b492f08Ea0965735906034F81"
                    >
                      Buy QBERT
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Popup>
          <a
            style={{
              textOverflow: "ellipsis",
              maxWidth: 150,
              whiteSpace: "nowrap",
              overflow: "hidden",
              display: "none"
            }}
            className="btn small ml-10 "
            id="btn-wallet-unlock"
          >
            {shortenAddress(account)
              ? shortenAddress(account)
              : "Unlock Wallet"}
          </a>
          <div
            className="balance ml-10"
            style={{
              color: "#fff",
              backgroundColor: "#8247e5"
              //color: '#000',
              //backgroundColor: '#f3ba2f'
            }}
          >
            <span className="qbert-balance">
              {formatNumberHumanize(data.balance, 1)} QBERT
            </span>
            <div
              className="wallet-info"
              style={{
                backgroundColor: "#000",
                boxShadow: "0 0 20px 5px #18da8d"
              }}
            >
              <span
                className="wallet-address"
                style={{
                  textOverflow: "ellipsis",
                  maxWidth: 160,
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }}
                onClick={() => startup(web3Modal)}
              >
                {shortenAddress(account)
                  ? shortenAddress(account)
                  : "Unlock Wallet"}
              </span>
              <span className="icon ml-10"></span>
            </div>
          </div>
        </div>
        <div
          onClick={(e) => {
            toggleMenu();
          }}
          className="hamburger"
        >
          <svg viewBox="0 0 18 15">
            <path
              fill="#3C4E5A"
              d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"
            />
            <path
              fill="#3C4E5A"
              d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"
            />
            <path
              fill="#3C4E5A"
              d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"
            />
          </svg>
        </div>
      </div>
      <div className={`mobile-menu ${menu ? "visible" : null}`}>
        <div className="wallet">
          <a
            className="btn small ml-10 btn-wallet"
            id="btn-wallet-unlock"
            style={{ display: "none" }}
          >
            {shortenAddress(account)
              ? shortenAddress(account)
              : "Unlock Wallet"}
          </a>
          <div
            className="balance ml-10"
            style={{
              color: "#fff",
              backgroundColor: "#8247e5"
              //color: '#000',
              //backgroundColor: '#f3ba2f'
            }}
          >
            <span className="qbert-balance">
              {formatNumberHumanize(data.balance, 1)} QBERT
            </span>
            <div
              className="wallet-info"
              style={{
                backgroundColor: "#000",
                boxShadow: "0 0 20px 5px #18da8d"
              }}
            >
              <span
                className="wallet-address"
                style={{
                  textOverflow: "ellipsis",
                  maxWidth: 130,
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }}
                onClick={() => startup(web3Modal)}
              >
                {shortenAddress(account)
                  ? shortenAddress(account)
                  : "Unlock Wallet"}
              </span>
              <span className="icon ml-10"></span>
            </div>
          </div>
          <div className="break"></div>
          <div className="qbert-price">
            <img src={qbertpxl} />
            <div className="txt ml-10 price">
              ${formatNumberHumanize(data.price, 2)}
            </div>
          </div>
          <Popup
            trigger={
              <a className="btn small ml-20 primary buy-qbert"> QBERT Stats </a>
            }
            modal
            nested
          >
            {(close) => (
              <div className="popup-container visible">
                <div
                  id="popup-buy-qbert"
                  className="popup"
                  style={{ display: "block" }}
                >
                  <div className="header">
                    <div className="ttl">Your Qbert</div>
                    <img
                      className="btn close"
                      src={popupclose}
                      onClick={close}
                    />
                  </div>
                  <div className="content">
                    <img src="images/qbert.png" />
                    <div className="balance">
                      {formatNumberHumanize(data.balance, 2)}
                    </div>

                    <div className="key-value">
                      <div className="key">Price</div>
                      <div className="value qbert-price">
                        ${formatNumberHumanize(data.price, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Current Supply</div>
                      <div className="value qbert-supply">
                        {formatNumberHumanize(data.totalSupply, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Circulating Supply</div>
                      <div className="value qbert-supply">
                        {formatNumberHumanize(data.ciculatingSupply, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Market Cap</div>
                      <div className="value market-cap">
                        ${formatNumberHumanize(data.marketCap, 2)}
                      </div>
                    </div>
                    <div className="key-value mt-10">
                      <div className="key">Contract Address</div>
                      <div className="value qbert-contract">
                        <span />
                        <img className="copy" src={popupcopy} />
                      </div>
                    </div>
                    <a
                      className="chart"
                      target="_blank"
                      href="https://dex.guru/token/0x6ed390befbb50f4b492f08ea0965735906034f81-bsc"
                    >
                      View chart
                    </a>
                    <a
                      className="btn primary buy"
                      target="_blank"
                      href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x6ED390Befbb50f4b492f08Ea0965735906034F81"
                    >
                      Buy QBERT
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Popup>
        </div>
        <div className="menu ">
          <ul>
            <li>
              <a href="#">Earn</a>
            </li>
            <li>
              <a href="https://exchange.pancakeswap.finance/#/pool">
                Create LP
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/watch?v=3zsoLuEvTz8">
                Tutorials
              </a>
            </li>
            <li>
              <a href="https://retrodefi.gitbook.io/retro-defi/">Docs</a>
            </li>
            <li>
              <a href="https://luckyqbert.retrofarms.net/">
                <img
                  src={qbertdice}
                  style={{
                    height: 35,
                    width: 35,
                    marginBottom: -10,
                    marginRight: 10
                  }}
                />
                Lucky QBERT
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
