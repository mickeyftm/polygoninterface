//mport Web3 from "web3";
//import { useEffect } from "react";
import config from "../../../../pools_config.json";
import Pool from "./pool";
//import getTokenPrice from "../../../utils/aprLib/index";
//import send from "../../../utils/getTvl";

export default function Pools({ web3, address, connected }) {
  return (
    <div className="pools">
      {config.map((pool, i) => (
        <Pool
          key={i}
          id={pool.id}
          name={pool.name}
          number_fee={pool.number_fee}
          special={pool.special}
          image_name={pool.image_name}
          pair_image={pool.pair_image}
          pool_multiplier={pool.pool_multiplier}
          decimals={pool.decimals}
          tokenDecimals={pool.tokenDecimals}
          token_address={pool.token_address}
          buy_url={pool.url}
          poolAddress={pool.poolAddress}
          isLp={pool.isLP}
          price={pool.price}
          isBNB={pool.isBNB}
          compound={pool.compound}
          isLpCompund={pool.isLPcompund}
          web3={web3}
          address={address}
          connected={address}
        />
      ))}
    </div>
  );
}
