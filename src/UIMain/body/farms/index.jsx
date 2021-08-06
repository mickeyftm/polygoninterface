import Pools from "./poolsd/pools";
import Stats from "./stats";
import Tvl from "./tvl";
export default function Farms({ web3, address, connected }) {
  return (
    <div className="content">
      <div className="title">
        <div className="txt ttl">
          RetroDEFI <br></br> QBERT Optimized Farms
        </div>
        <Tvl web3={web3} address={address} connected={connected} />
      </div>

      <Stats web3={web3} address={address} />
      <Pools web3={web3} address={address} connected={connected} />
    </div>
  );
}
