import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { tryFetchPrice, tryFetchLPPrice } from "../../../../utils/getPrices";
import { calculateApr } from "../../../../utils/apr";
import { getWeb3NoAccount } from "../../../../utils/web3Global";
import util from "../../../../utils/aprLib/index";
//import BigNumber from "bignumber.js";
import { infoPry } from "../../../assets/svg";
import $ from "jquery";
import getBalance from "../../../../utils/tokenUtils";
import { constants } from "ethers";
import { formatNumberSuffix } from "../../../../utils/formatBalance";
import {
  tokenAbi,
  rcubeAbi,
  poolAbi,
  strategyAbi
} from "../../../../Resources/lib/abi";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
var web3ext;
export default function Pool({
  id,
  name,
  number_fee,
  special,
  image_name,
  pair_image,
  pool_multiplier,
  decimals,
  tokenDecimals,
  token_address,
  buy_url,
  poolAddress,
  isLp,
  price,
  isBNB,
  compound,
  isLpCompund,
  web3,
  address,
  connected
}) {
  //var [loaded, setLoaded] = useState(false);
  var [balance, setBalance] = useState(0);
  var [depositState, setDepositState] = useState(0);
  var [withdrawState, setWithdrawState] = useState(0);
  var [poolInfo, setPoolInfo] = useState({
    pool: "",
    deposited: 0,
    allowonce: 0,
    pending: 0,
    price: 0,
    balance: 0,
    apr: 0,
    locked: true
  });

  const loadPool = async () => {
    window.ts = { value: 0, pending: 0, deposited: 0, added: [] };
    web3ext = getWeb3NoAccount();
    let token = new web3ext.eth.Contract(tokenAbi, token_address);
    let pool = new web3ext.eth.Contract(poolAbi, farmAddress);
    let strategy = new web3ext.eth.Contract(strategyAbi, poolAddress);
    let rcube = new web3ext.eth.Contract(rcubeAbi, token_address);
    //if (window.qbertprice) {
    var deposited = 0;
    var allowance = 0;
    var pending = 0;
    var price;
    var locked;
    var balance;
    var apr = 0;
    var balanced = 0;
    var burnAmount = 0;
    setBalance(balanced);
    //if (!poolInfo.price) {
    price = await tokenPrice();
    //}
    if (token_address === "0xa6e53f07bD410df069e20Ced725bdC9135146Fe9") {
      burnAmount = await rcube.methods._getBurnLevy.call().call();
    }

    balance = await strategy.methods.wantLockedTotal().call();

    if (poolAddress === "0xB9468Ee4bEf2979615855aB1Eb6718505b1BB756") {
      //console.log(price);
    }
    //let total = (balance / 10 ** decimals) * price;
    //console.log(burnAmount);
    if (address) {
      balanced = await getBalance(token_address, address);
      setBalance(balanced);
      //var QBERT_PERBLOCK = await pool.methods.NATIVEPerBlock().call();
      deposited = await pool.methods.stakedWantTokens(id, address).call();
      allowance = await token.methods.allowance(address, farmAddress).call();
      //let pendingBefore = poolInfo.pending;
      //console.log(pending);
      pending = await pool.methods.pendingNATIVE(id, address).call();
    }
    apr = await calculateApr(pool, balance, price, id, decimals);
    if (burnAmount > 1) {
      locked = true;
    } else {
      locked = false;
    }
    if (!window.ts.added.includes(token_address)) {
      window.ts.value = window.ts.value + (balance / 10 ** decimals) * price;
      window.ts.deposited =
        window.ts.deposited + (deposited / 10 ** decimals) * price;
      window.ts.pending = window.ts.pending + pending / 10 ** 18;
      window.ts.added.push(token_address);
    }
    setPoolInfo({
      pool,
      deposited,
      allowance,
      pending,
      price,
      balance,
      apr,
      userBalance: balanced,
      locked
    });
    //}
  };

  async function tokenPrice() {
    var tokenPrice = 0;
    if (!isLp) {
      try {
        tokenPrice = await tryFetchPrice(token_address);
        return tokenPrice;
      } catch (error) {
        console.log("Try Failed APIS");
      }
      try {
        tokenPrice = await util.getTokenPrice(price.lpaddress, decimals);
        tokenPrice = tokenPrice[price.reserve];
        return tokenPrice;
      } catch (error) {
        console.log("Try query RPC");
      }
    } else {
      try {
        tokenPrice = await tryFetchLPPrice(token_address);
        return tokenPrice;
      } catch (error) {
        console.log("Try Failed APIS LP");
      }
      try {
        let value = await util.getLpPrice(price.lpaddress, tokenDecimals);
        value = value[price.reserve] * 2;
        tokenPrice = await util.getTokenPrice(
          price.bnnlpaddress,
          tokenDecimals
        );
        tokenPrice = tokenPrice[price.reserve];
        return value * tokenPrice;
      } catch (error) {
        console.log("Try query RPC");
      }
    }
  }

  const maxButton = async (param) => {
    if (param === "deposit") {
      setDepositState(balance);
      let elem = document.getElementsByClassName("depositInput" + id);
      elem[0].value = balance / 10 ** decimals;
    } else if (param === "withdraw") {
      setWithdrawState(poolInfo.deposited);
      let elem = document.getElementsByClassName("withdrawInput" + id);
      elem[0].value = poolInfo.deposited / 10 ** decimals;
    }
  };
  const handdleInput = async (param, event) => {
    event.preventDefault();
    if (param === "withdraw" && event.target.value) {
      if (event.target.value) {
        setWithdrawState(parseFloat(event.target.value) * 10 ** decimals);
      } else {
        setWithdrawState(0);
      }
    } else if (event.target.value) {
      if (event.target.value) {
        setDepositState(parseFloat(event.target.value) * 10 ** decimals);
      } else {
        setDepositState(0);
      }
    }
  };

  async function approve() {
    let token = new web3.eth.Contract(tokenAbi, token_address);
    await token.methods
      .approve(farmAddress, constants.MaxUint256)
      .send({ from: address });
    await token.methods.allowance(address, farmAddress).call();
  }
  async function deposit() {
    if (balance >= depositState) {
      let depod = depositState.toLocaleString("fullwide", {
        useGrouping: false
      });
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let amount = new web3.utils.toBN(depod).toString();
      await pool.methods.deposit(id, amount).send({ from: address });
      setTimeout(async () => {
        let tokenStakeds = await pool.methods
          .stakedWantTokens(id, address)
          .call();
        window.ts.deposited =
          window.ts.deposited +
          (tokenStakeds / 10 ** decimals) * poolInfo.price;
      }, 4000);
    }
  }
  async function whitdraw() {
    if (poolInfo.deposited >= withdrawState) {
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let withs = withdrawState.toLocaleString("fullwide", {
        useGrouping: false
      });
      let amount = new web3.utils.toBN(withs).toString();
      await pool.methods.withdraw(id, amount).send({ from: address });
      setTimeout(async () => {
        let tokenStakeds = await pool.methods
          .stakedWantTokens(id, address)
          .call();
        window.ts.deposited =
          window.ts.deposited -
          (tokenStakeds / 10 ** decimals) * poolInfo.price;
      }, 4000);
    }
  }
  async function harvest() {
    let pool = new web3.eth.Contract(poolAbi, farmAddress);
    if (poolInfo.pending > 1e8) {
      await pool.methods.withdraw(id, 0).send({ from: address });
      let pendingQbert = await pool.methods.pendingNATIVE(id, address).call();
    }
  }

  useEffect(() => {
    //loadall();
    loadPool();
    const interval = setInterval(() => {
      //loadall();
      loadPool();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [connected]);

  let sd = () => {
    $(`div.details.id${id}`).slideToggle(500);
    $(`div.pool-card.id${id}`).toggleClass("expanded", true);
  };
  return (
    <div className={`pool-card  highlighted radioactive  ${special} id${id}`}>
      <div className="tag-container">
        {poolInfo.locked ? (
          <font
            style={{
              color: "red",
              fontSize: 15,
              backgroundColor: "var(--c-background-2)",
              borderRadius: "var(--r-border-2)",
              border: "#d40000 2px solid",
              padding: "2px 4px",
              boxShadow: "var(--t-shadow-3)"
            }}
          >
            Locked
          </font>
        ) : (
          <div className="mini-tag">
            {poolInfo.locked ? "Locked" : number_fee}
          </div>
        )}
      </div>
      <div className="info">
        <div className="symbols">
          <img src={"../images/" + image_name} />
          <img src={"../images/" + pair_image} />
        </div>
        <div className="pool">
          <div className="ttl">
            {name}
            <div className="sub-ttl"></div>
          </div>
          <div className="bottom">
            <div className="tag multiplier">{pool_multiplier}</div>
            <div className="provider ml-10">QBert</div>
          </div>
        </div>
        <div className="key-value apy shorter">
          <div className="val primary">
            {formatNumberSuffix(poolInfo.apr, 2)}%
          </div>
          <div className="key">APR</div>
        </div>
        <div className="key-value balance">
          <div className="val">
            {poolInfo.userBalance
              ? (poolInfo.userBalance / 10 ** decimals).toFixed(2)
              : "***"}
          </div>
          <div className="key">Balance</div>
        </div>
        <div className="key-value deposited">
          <div className="val">
            {poolInfo.deposited
              ? (poolInfo.deposited / 10 ** decimals).toFixed(2)
              : "***"}
          </div>
          <div className="key">Deposited</div>
        </div>
        <div className="key-value daily shorter">
          <div className="val">
            {poolInfo.apr
              ? formatNumberSuffix(poolInfo.apr / 365, 2) + "%"
              : "***"}
          </div>
          <div className="key">Daily</div>
        </div>
        <div className="key-value tvl shorter">
          <div className="val">
            {poolInfo.price
              ? "$" +
                formatNumberSuffix(
                  (poolInfo.balance / 10 ** decimals) * poolInfo.price,
                  0
                )
              : "***"}
          </div>
          <div className="key">TVL</div>
        </div>
        <div
          className="btn outlined ml-auto get"
          href={buy_url}
          target="_blank"
        >
          Get {name}
        </div>
        <div
          onClick={() => {
            sd();
          }}
          className="btn expand ml-10"
        ></div>
      </div>
      <div className={`details id${id}`}>
        <div className="line"></div>
        <div className="transactions">
          <div className="transaction deposit no-bg">
            <div className="amount">
              <span className="ttl">Wallet:</span>
              <span className="val" data-display-decimals="6">
                {(poolInfo.userBalance / 10 ** decimals).toFixed(3)}{" "}
                <span className="estimate"></span>
              </span>
            </div>
            <div className="swap">
              <a href={buy_url}>Get {name}</a>
            </div>
            <div className="input-container number with-max">
              <input
                className={"depositInput" + id}
                onChange={(e) => handdleInput("deposit", e)}
                type="number"
                data-humanize="false"
                data-decimal-places="18"
              />
              <div
                onClick={() => {
                  maxButton("deposit");
                }}
                className="max"
              >
                MAX
              </div>
            </div>
            {parseInt(poolInfo.allowance) < parseInt(depositState) ? (
              <div
                className="btn secondary mt-20 deposit"
                onClick={() => {
                  approve();
                }}
              >
                Approve
              </div>
            ) : (
              <div
                className="btn mt-20 deposit"
                onClick={() => {
                  deposit();
                }}
                data-currency-contract="0x0000000000000000000000000000000000000000"
              >
                Deposit
              </div>
            )}
          </div>
          <div className="transaction withdraw">
            <div className="amount">
              <span className="ttl">Vault:</span>
              <span className="val" data-display-decimals="6">
                {poolInfo.deposited > 1e8
                  ? (poolInfo.deposited / 10 ** decimals).toFixed(3)
                  : 0}
                <span className="estimate"></span>
              </span>
            </div>
            <div className="input-container number with-max">
              <input
                className={"withdrawInput" + id}
                onChange={(e) => handdleInput("withdraw", e)}
                type="number"
                data-humanize="false"
                data-decimal-places="18"
              />
              <div
                onClick={() => {
                  maxButton("withdraw");
                }}
                className="max"
              >
                MAX
              </div>
            </div>
            <div
              onClick={() => {
                whitdraw();
              }}
              className="btn secondary mt-20 withdraw"
            >
              Withdraw to Wallet
            </div>
          </div>
          <div className="transaction harvest">
            <div className="ttl">Pending :</div>
            <div className="val">
              <span className="amount">
                {(poolInfo.pending / 10 ** 18).toFixed(2)}
              </span>
              <span style={{ fontSize: 13 }} className="value">
                {" "}
                ($
                {formatNumberSuffix(
                  (poolInfo.pending / 10 ** 18) * window.qbertprice,
                  2
                )}
                )
              </span>
            </div>
            <div
              onClick={() => {
                harvest();
              }}
              className="btn primary harvest"
            >
              Harvest
            </div>
          </div>
        </div>
        <div className="farm-info">
          <div className="information">
            <div className="info">
              <div className="itm head">
                <span className="ttl">APR</span>
              </div>
              <div className="itm qbert-apy">
                <span className="ttl">{name} APR:&nbsp;</span>
                <span className="val">
                  {formatNumberSuffix(poolInfo.apr, 2)} %
                </span>
                <img className="tooltip" src={infoPry}></img>
              </div>
            </div>
            <div className="info">
              <div className="itm head">
                <span className="ttl">Daily</span>
              </div>
              <div className="itm qbert-daily-apy">
                <span className="ttl">{name} Daily:&nbsp;</span>
                <span className="val">
                  {formatNumberSuffix(poolInfo.apr / 365, 2)}%
                </span>
              </div>
            </div>
            <div className="info">
              <div className="itm head">
                <span className="ttl">Farm</span>
              </div>
              <div className="itm qbert-daily-apy">
                <span className="ttl">{name} TVL:&nbsp;</span>
                <span className="val">
                  $
                  {formatNumberSuffix(
                    (poolInfo.balance / 10 ** decimals) * poolInfo.price,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
