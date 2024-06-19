import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contract_address } from "@/constants/abi";
import { Card } from "./ui/card";

const ConnectContract = () => {
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

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="container mx-auto p-4">
      <Card className="w-1/2 p-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modelId">Model ID:</label>
          <input
            type="number"
            id="modelId"
            value={modelId}
            onChange={handleInputChange((value: number) => setModelId(parseInt(value)))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prompt">Prompt:</label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={handleInputChange(setPrompt)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">Value (in Ether):</label>
          <input
            type="text"
            id="value"
            value={value}
            onChange={handleInputChange(setValue)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={connectContractDeployed}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Call Contract
        </button>
      </Card>


      {transactionHash && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Transaction successful! Hash: {transactionHash}
        </div>
      )}
      {/* {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )} */}
      {result && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded">
          AI Result: {result}
        </div>
      )}
    </div>
  );
};

export default ConnectContract;
