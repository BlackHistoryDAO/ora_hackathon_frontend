import { ethers } from "ethers";
import { abi, contract_address } from "@/constants/abi";

const ConnectContract = () => {

  const connectContractDeployed =  async () => {
    const provider = new ethers.AlchemyProvider('sepolia', process.env.SEPOLIA_ALCHEMY_API_KEY)
    const connect = new ethers.Contract(contract_address, abi, provider)

    const readContract = await connect.estimateFee(11);
    return readContract.toString();
  };
  return (
    <div className='container'>{connectContractDeployed()}</div>
  )
}

export default ConnectContract;
