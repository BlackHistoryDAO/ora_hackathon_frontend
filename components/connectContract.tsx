import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contract_address } from "@/constants/abi";

const ConnectContract = () => {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelId, setModelId] = useState<number>(() => {
    const savedModelId = localStorage.getItem("modelId");
    return savedModelId ? parseInt(savedModelId) : 0;
  });
  const [prompt, setPrompt] = useState<string>(() => {
    return localStorage.getItem("prompt") || "";
  });
  const [value, setValue] = useState<string>(() => {
    return localStorage.getItem("value") || "";
  });
  const [result, setResult] = useState<string | null>(() => {
    return localStorage.getItem("result");
  });

  const connectContractDeployed = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // We use the window.ethereum provider and get a signer
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contract_address, abi, signer);

        const valueInEther = ethers.utils.parseEther(value); // Ensure this is a valid ether amount

        // Call the contract function
        const transaction = await contract.calculateAIResult(modelId, prompt, { value: valueInEther });

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();
        setTransactionHash(receipt.transactionHash);
        localStorage.setItem("transactionHash", receipt.transactionHash);

        // Read the result (assuming getAIResult function can be called to fetch the result)
        const aiResult = await contract.getAIResult(modelId, prompt);
        setResult(aiResult);
        localStorage.setItem("result", aiResult);
      } catch (error: any) {
        console.error("Error calling calculateAIResult:", error);
        setError(error.message);
        localStorage.setItem("error", error.message);
      }
    } else {
      console.error("Ethereum wallet is not available");
      setError("Ethereum wallet is not available");
      localStorage.setItem("error", "Ethereum wallet is not available");
    }
  };

  useEffect(() => {
    const savedTransactionHash = localStorage.getItem("transactionHash");
    const savedError = localStorage.getItem("error");

    if (savedTransactionHash) {
      setTransactionHash(savedTransactionHash);
    }
    if (savedError) {
      setError(savedError);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("modelId", modelId.toString());
  }, [modelId]);

  useEffect(() => {
    localStorage.setItem("prompt", prompt);
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem("value", value);
  }, [value]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Model ID:</label>
        <input 
          type="number" 
          value={modelId} 
          onChange={(e) => setModelId(parseInt(e.target.value))} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Prompt:</label>
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Value (in Ether):</label>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
      </div>
      <button 
        onClick={connectContractDeployed} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Call Contract
      </button>

      {transactionHash && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Transaction successful! Hash: {transactionHash}
        </div>
      )}
      {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>}
      {result && <div className="mt-4 p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded">AI Result: {result}</div>}
    </div>
  );
}

export default ConnectContract;
