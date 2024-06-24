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
    setModelId,
    setPrompt,
    setValue,
    handleInputChange,
    calculateAIResult,
    fetchNFTMetadata
  } = useContract();
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMetadata, setTokenMetadata] = useState<{ image: string; prompt: string } | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);

  useEffect(() => {
    if (transactionHash) {
      toast.success("Fetching the data successfully!");
      console.log(transactionHash);
    }

    if (error) {
      toast.error("Transaction failed!");
      console.log(error);
    }
  }, [transactionHash, error]);

  const handleCallContract = async () => {
    setLoading(true);
    const result = await calculateAIResult(modelId, prompt, value);
    if (result) {
      setRequestId(result.requestId.toString());
      setTokenId(result.tokenId.toString());
      const metadata = await fetchNFTMetadata(modelId, prompt);
      console.log("Fetched Metadata:", metadata);
      if (metadata) {
        setTokenMetadata(metadata);
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-2 p-4 flex flex-col gap-4">
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
        <div className="mt-4 p-4 bg-gray-100/20 border border-gray-400 text-gray-700 rounded">
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <div className="loader border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-16 w-16"></div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div>
                <Image src={`https://ipfs.io/ipfs/${tokenMetadata}`} height={300} width={300} alt="Result" />
                <p>Token ID: {tokenId}</p>
                <Link href={`https://sepolia.etherscan.io/${requestId}`}>Check on etherscan</Link>
              </div>
              <Button>Mint</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectContract;
