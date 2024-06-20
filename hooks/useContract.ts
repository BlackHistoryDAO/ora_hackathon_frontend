import { useState, useEffect, ChangeEvent } from 'react';
import { ethers } from 'ethers';
import { abi, contract_address } from "@/constants/abi";

// Define the type for the hook's return value
interface UseContract {
  transactionHash: string | null;
  error: string | null;
  modelId: number;
  prompt: string;
  value: string;
  result: string | null;
  setModelId: (modelId: number) => void;
  setPrompt: (prompt: string) => void;
  setValue: (value: string) => void;
  handleInputChange: (setter: React.Dispatch<React.SetStateAction<any>>) => (e: ChangeEvent<HTMLInputElement>) => void;
  interactWithContract: (methodName: string, args: any[], value: string) => Promise<void>;
}

export const useContract = (): UseContract => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelId, setModelId] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedResult = localStorage.getItem("result");
      if (savedResult) setResult(savedResult);
    }
  }, []);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const saveToLocalStorage = (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const interactWithContract = async (methodName: string, args: any[], value: string) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found');
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contract_address, abi, signer);

        const valueInEther = ethers.utils.parseEther(value);
        const transaction = await contract[methodName](...args, { value: valueInEther });
        const receipt = await transaction.wait();

        setTransactionHash(receipt.transactionHash);
        saveToLocalStorage("transactionHash", receipt.transactionHash);

        if (methodName === "calculateAIResult") {
          const aiResult = await contract.getAIResult(args[0], args[1]);
          setResult(aiResult);
          saveToLocalStorage("result", aiResult);
        }
      } catch (error: any) {
        console.error(`Error calling ${methodName}:`, error);
        setError(error.message);
        saveToLocalStorage("error", error.message);
      }
    } else {
      const errMsg = "Ethereum wallet is not available";
      console.error(errMsg);
      setError(errMsg);
      saveToLocalStorage("error", errMsg);
    }
  };

  useEffect(() => {
    saveToLocalStorage("prompt", prompt);
  }, [prompt]);

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
    interactWithContract
  };
};
