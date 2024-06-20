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
  connectContractDeployed: () => Promise<void>;
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
      const savedTransactionHash = localStorage.getItem("transactionHash");
      const savedError = localStorage.getItem("error");
      const savedModelId = localStorage.getItem("modelId");
      const savedPrompt = localStorage.getItem("prompt");
      const savedValue = localStorage.getItem("value");
      const savedResult = localStorage.getItem("result");

      if (savedTransactionHash) setTransactionHash(savedTransactionHash);
      if (savedError) setError(savedError);
      if (savedModelId) setModelId(parseInt(savedModelId));
      if (savedPrompt) setPrompt(savedPrompt);
      if (savedValue) setValue(savedValue);
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

  const connectContractDeployed = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contract_address, abi, signer);

        const valueInEther = ethers.utils.parseEther(value);
        const transaction = await contract.calculateAIResult(modelId, prompt, { value: valueInEther });
        const receipt = await transaction.wait();

        setTransactionHash(receipt.transactionHash);
        saveToLocalStorage("transactionHash", receipt.transactionHash);

        const aiResult = await contract.getAIResult(modelId, prompt);
        setResult(aiResult);
        saveToLocalStorage("result", aiResult);
      } catch (error: any) {
        console.error("Error calling calculateAIResult:", error);
        setError(error.message);
        saveToLocalStorage("error", error.message);
      }
    } else {
      console.error("Ethereum wallet is not available");
      setError("Ethereum wallet is not available");
      saveToLocalStorage("error", "Ethereum wallet is not available");
    }
  };

  useEffect(() => {
    saveToLocalStorage("modelId", modelId.toString());
  }, [modelId]);

  useEffect(() => {
    saveToLocalStorage("prompt", prompt);
  }, [prompt]);

  useEffect(() => {
    saveToLocalStorage("value", value);
  }, [value]);

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
    connectContractDeployed
  };
};
