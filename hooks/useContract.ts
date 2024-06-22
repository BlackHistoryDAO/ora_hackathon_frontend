import { useState, useEffect, ChangeEvent } from 'react';
import { ethers, BigNumber } from 'ethers';
import { abi as contractABI, contract_address } from "@/constants/abi";
import toast from 'react-hot-toast';

const contractAddress = contract_address;

interface ContractResult {
  requestId: string;
  tokenId: string;
}

export const useContract = () => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (transactionHash) {
      toast.success("Transaction successful!");
      console.log(transactionHash);
    }

    if (error) {
      toast.error("Transaction failed!");
      console.log(error);
    }
  }, [transactionHash, error]);

  const getContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      return new ethers.Contract(contractAddress, contractABI, signer);
    } else {
      throw new Error("Ethereum wallet is not connected");
    }
  };

  const calculateAIResult = async (modelId: string, prompt: string, ethValue: string): Promise<ContractResult | null> => {
    try {
      const contract = await getContract();
      const tx = await contract.calculateAIResult(modelId, prompt, { value: ethers.utils.parseEther(ethValue) });
      setTransactionHash(tx.hash);
      const receipt = await tx.wait();
      // Extract requestId and tokenId from the event logs
      const event = receipt.events.find((event: any) => event.event === "promptRequest");
      const [requestId, tokenId] = event.args;
      return { requestId, tokenId };
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);

  return {
    transactionHash,
    error,
    modelId,
    prompt,
    value,
    result,
    setModelId,
    setPrompt,
    setValue,
    handleInputChange,
    calculateAIResult,
  };
};
