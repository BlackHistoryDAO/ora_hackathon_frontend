import { Card } from "./ui/card";
import { useContract } from "@/hooks/useContract";

const ConnectContract = () => {
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
    connectContractDeployed
  } = useContract();

  return (
    <div className="container mx-auto p-4">
      <Card className="w-1/2 p-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modelId">Model ID:</label>
          <input
            type="number"
            id="modelId"
            value={modelId}
            onChange={handleInputChange((e) => setModelId(e))}
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
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded">
          AI Result: {result}
        </div>
      )}
    </div>
  );
};

export default ConnectContract;
