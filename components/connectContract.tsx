import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "./ui/card";
import { useContract } from "@/hooks/useContract";
import Image from "next/image";

const ConnectContract = () => {

  const [isLoading, setIsLoading] = useState(false);

  const {
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
  } = useContract();

  if (transactionHash) {
    toast.success("Transaction successful!");
    console.log(transactionHash);
  }

  if (error) {
    toast.error("Transaction failed!");
    console.log(error);
  }

  const handleCallContract = async () => {
    await interactWithContract("calculateAIResult", [modelId, prompt], value);
  };


  return (
    <div className="container mx-auto p-4 flex gap-4">
      <Card className="w-1/2 p-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modelId">Model ID:</label>
          <input
            type="number"
            id="modelId"
            value={modelId}
            onChange={handleInputChange(setModelId)}
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
          onClick={handleCallContract}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Call Contract
        </button>
      </Card>
      {result && (
        <div className="mt-4 p-4 bg-gray-100/20 border border-gray-400 text-gray-700 rounded">
          <Image src={`https://ipfs.io/ipfs/${result}`} alt="Contract" width={300} height={300} />
        </div>
      )}
    </div>
  );
};

export default ConnectContract;
