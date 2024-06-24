import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "./ui/card";
import { useContract } from "@/hooks/useContract";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const ConnectContract = () => {
  const {
    transactionHash,
    error,
    modelId,
    prompt,
    value,
    result,
    metadata,
    allMetadata,
    setModelId,
    setPrompt,
    setValue,
    handleInputChange,
    calculateAIResult,
    fetchNFTMetadata,
    fetchAllNFTMetadata
  } = useContract();
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMetadata, setTokenMetadata] = useState<{ image: string; prompt: string } | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllNFTMetadata();
  }, []);

  const handleCallContract = async () => {
    setLoading(true);
    const result = await calculateAIResult(modelId, prompt, value);
    if (result) {
      setRequestId(result.requestId.toString());
      setTokenId(result.tokenId.toString());
      const data = await fetchNFTMetadata(modelId, prompt);
      console.log("Fetched Metadata:", data);
      if (metadata) {
        setTokenMetadata(data);
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-2 p-4 flex justify-between gap-4">
      <Card className="w-full p-4 mb-4">
        <div className="mb-4 hidden">
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
        <div className="mb-4 hidden">
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
      {tokenMetadata && (
        <div className="mt-8 p-6 bg-gray-100/20 border border-gray-400 text-gray-700 rounded-lg shadow-md">
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <div className="loader border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-16 w-16"></div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <Image
                  src={`https://ipfs.io/ipfs/${tokenMetadata}`}
                  height={300}
                  width={300}
                  alt="Result"
                  className="rounded-lg mb-4"
                />
                <p className="text-lg font-semibold">Token ID: {tokenId}</p>
                <Link href={`https://sepolia.etherscan.io/${requestId}`} className="text-blue-500 hover:underline">Check on Etherscan</Link>
              </div>
              <Button className="ml-4">Mint</Button>
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {allMetadata.map((ele, index) => (
          <Card key={index} className="p-4">
            <h2 className="text-xl font-bold mb-2">Token Metadata {index + 1}</h2>
            {ele && (
              <div className="mt-2">
                <Image
                  src={`https://ipfs.io/ipfs/${ele}`}
                  alt="Generated Image"
                  width={300}
                  height={300}
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConnectContract;
