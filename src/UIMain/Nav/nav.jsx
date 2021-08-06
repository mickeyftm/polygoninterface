import React, { useEffect, useRef, useState, useCallback } from "react";
import { renderIcon } from "@download/blockies";
import Avatar from "@material-ui/core/Avatar";
import Popup from "reactjs-popup";
import { tryFetchPrice } from "../../utils/getPrices";
import { logo, qbertpxl, qbertdice } from "../assets/logos";
import { popupclose, popupcopy } from "../assets/svg";
import { formatNumberHumanize } from "../../utils/formatBalance";
import { tokenAbi } from "../../Resources/lib/abi";
import { shortenAddress } from "../../utils/stylish";
import { Contract, Provider } from "ethcall";
import { JsonRpcProvider } from "@ethersproject/providers";
import getRpcUrl from "../../utils/getRpcUrl";

const RPC_URL = getRpcUrl();
const providerQbert = new JsonRpcProvider(RPC_URL);

const wbnbAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const qbertAddress = "0x6ED390Befbb50f4b492f08Ea0965735906034F81";
const zeroAdress = "0x0000000000000000000000000000000000000000";
const burnAddress = "0x000000000000000000000000000000000000dEaD";

const Nav = ({ connected, address, connectWallet, disconnectWallet }) => {
  //const [shortAddress, setShortAddress] = useState("");
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);
  var [menu, setMenu] = useState(false);
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

  const getQbertStats = useCallback(async () => {
    let multiCall = new Provider();
    await multiCall.init(providerQbert);
    let qbert = new Contract(qbertAddress, tokenAbi);
    var balance = 0;
    var burnBalance = 0;
    var totalSupply = 0;
    var balanceCall;
    var burnBalanceCall;
    var totalSupplyCall;
    var ciculatingSupply;
    var marketCap;
    if (address) {
      balanceCall = qbert.balanceOf(address);
      burnBalanceCall = qbert.balanceOf(burnAddress);
      totalSupplyCall = qbert.totalSupply();
    } else {
      balanceCall = qbert.balanceOf(zeroAdress);
      burnBalanceCall = qbert.balanceOf(burnAddress);
      totalSupplyCall = qbert.totalSupply();
    }
    [balance, burnBalance, totalSupply] = await multiCall.all([
      balanceCall,
      burnBalanceCall,
      totalSupplyCall
    ]);
    console.log(balanceCall, burnBalanceCall, totalSupplyCall);
    ciculatingSupply = totalSupply - burnBalance;
    var bnbPrice = await tryFetchPrice(wbnbAddress);
    var price = await tryFetchPrice(qbertAddress);
    window.qbertprice = price;
    window.bnbprice = bnbPrice;
    marketCap = price * (ciculatingSupply / 10 ** 18);
    setData({
      balance: balance / 10 ** 18,
      burnBalance: burnBalance / 10 ** 18,
      totalSupply: totalSupply / 10 ** 18,
      ciculatingSupply: ciculatingSupply / 10 ** 18,
      price: price,
      marketCap: marketCap
    });
    //}
  }, [address]);

  useEffect(() => {
    getQbertStats();
    const interval = setInterval(() => {
      // do something
      getQbertStats();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [getQbertStats]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    const canvas = canvasRef.current;
    renderIcon({ seed: address.toLowerCase() }, canvas);
    const updatedDataUrl = canvas.toDataURL();
    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl);
    }
    //if (address.length < 11) {
    //   setShortAddress(address);
    // } else {
    //    setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    // }
  }, [dataUrl, address, connected]);

  return (
    <header>
      <div className="top-notification hidden">
        <span className="txt"></span>
        <a className="btn-close"></a>
      </div>
      <div className="container">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="logo" />
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
            {shortenAddress(address)
              ? shortenAddress(address)
              : "Unlock Wallet"}
          </a>
          <div
            className="balance ml-10"
            style={
              {
                //color: '#000',
                //backgroundColor: '#f3ba2f'
              }
            }
          >
            <span className="qbert-balance">
              {formatNumberHumanize(data.balance, 1)} QBERT
            </span>
            <div className="wallet-info" style={{}}>
              <span
                className="wallet-address"
                style={{
                  textOverflow: "ellipsis",
                  maxWidth: 160,
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }}
                onClick={connected ? disconnectWallet : connectWallet}
                //onClick={() => startup(web3Modal)}
              >
                {shortenAddress(address)
                  ? shortenAddress(address)
                  : "Unlock Wallet"}
              </span>
              <span className="icon ml-10">
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Avatar
                  alt="address"
                  src={dataUrl}
                  style={{
                    width: "24px",
                    height: "24px",
                    marginRight: "4px"
                  }}
                />
              </span>
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
            {shortenAddress(address)
              ? shortenAddress(address)
              : "Unlock Wallet"}
          </a>
          <div
            className="balance ml-10"
            style={
              {
                //color: '#000',
                //backgroundColor: '#f3ba2f'
              }
            }
          >
            <span className="qbert-balance">
              {formatNumberHumanize(data.balance, 1)} QBERT
            </span>
            <div
              className="wallet-info"
              style={
                {
                  //backgroundColor: "#000",
                  // boxShadow: "0 0 20px 5px #eca408"
                }
              }
            >
              <span
                className="wallet-address"
                style={{
                  textOverflow: "ellipsis",
                  maxWidth: 130,
                  whiteSpace: "nowrap",
                  overflow: "hidden"
                }}
                onClick={connected ? disconnectWallet : connectWallet}
                //onClick={() => startup(web3Modal)}
              >
                {connected ? (
                  <>{shortenAddress(address)}</>
                ) : (
                  <>{"Unlock Wallet"}</>
                )}
              </span>
              <span className="icon ml-10">
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Avatar
                  alt="address"
                  src={dataUrl}
                  style={{
                    width: "24px",
                    height: "24px",
                    marginRight: "4px"
                  }}
                />
              </span>
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
      <div>
        <button
          className="wallet-addres"
          disableElevation
          onClick={connected ? disconnectWallet : connectWallet}
        >
          {connected ? (
            <>
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <Avatar
                alt="address"
                src={dataUrl}
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "4px"
                }}
              />
              {shortenAddress(address)}
            </>
          ) : (
            <>{"Vault-Wallet"}</>
          )}
        </button>
      </div>
    </header>
  );
};

export default Nav;
