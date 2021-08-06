import { AbiItem } from "web3-utils";
import { Interface } from "@ethersproject/abi";
import { getWeb3NoAccount } from "./web3Global";
import { MultiCallAbi } from "../Resources/lib/abi";
import { getMulticallAddress } from "./adressHelpers";

interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

const multicall = async (abi: [], calls: Call[]) => {
  const web3 = getWeb3NoAccount();
  // console.log("MULTICALL ADDRESS");
  // console.log(getMulticallAddress());
  const multi = new web3.eth.Contract(
    (MultiCallAbi as unknown) as AbiItem,
    getMulticallAddress()
  );
  const itf = new Interface(abi);

  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params)
  ]);

  // console.log("Call Data");
  // console.log(calldata);
  const { returnData } = await multi.methods.aggregate(calldata).call();
  // console.log("Return data");
  // console.log(returnData);
  const res = returnData.map((call, i) =>
    itf.decodeFunctionResult(calls[i].name, call)
  );

  return res;
};

export default multicall;
