"use client";

import React, { useState } from "react";
import { useSimulateContract, useAccount } from "wagmi";
import {
  vibeMarketProxyAbi,
  VIBEMARKET_PROXY_ADDRESS,
} from "@/abi/vibeMarketProxyABI";
import { parseEther } from "viem";
import { CustomConnectButton } from "@/components/CustomConnectButton";

const SimulateContractPage = () => {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    packName: "",
    tokenSymbol: "",
    nftSymbol: "",
    owner: address || "",
    packAmount: "0",
    slug: "",
    contractAddress: "", // Add contract address for getMintPrice simulation
  });
  const [packPriceResult, setPackPriceResult] = useState<any>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  const customConfig = {
    baseURI: `https://build.wield.xyz/vibe/boosterbox/metadata/${formData.slug}/`,
    tokensPerMint: BigInt("100000000000000000000000"), // 100K tokens
    commonOffer: BigInt("10000000000000000000000"), // 10K tokens
    rareOffer: BigInt("115000000000000000000000"), // 115K tokens
    epicOffer: BigInt("400000000000000000000000"), // 400K tokens
    legendaryOffer: BigInt("4000000000000000000000000"), // 4M tokens
    mythicOffer: BigInt("20000000000000000000000000"), // 20M tokens
  };

  const {
    data: simulationResult,
    isLoading,
    isError,
    error,
  } = useSimulateContract({
    address: VIBEMARKET_PROXY_ADDRESS,
    abi: vibeMarketProxyAbi,
    functionName: "createDropWithConfig",
    args: [
      formData.packName, // tokenName
      formData.tokenSymbol,
      formData.packName, // nftName
      formData.nftSymbol,
      (formData.owner as `0x${string}`) || address,
      BigInt(formData.packAmount),
      customConfig,
    ],
    value: BigInt(0),
    query: {
      enabled: Boolean(
        formData.packName &&
          formData.tokenSymbol &&
          formData.nftSymbol &&
          formData.owner &&
          formData.slug
      ),
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to call the getMintPrice route API
  const calculatePackPrice = async () => {
    if (!formData.contractAddress || !formData.packAmount || formData.packAmount === "0") {
      return;
    }

    setIsLoadingPrice(true);
    try {
      const response = await fetch('/api/simulatecontract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress: formData.contractAddress,
          packAmount: parseInt(formData.packAmount)
        })
      });

      const result = await response.json();
      setPackPriceResult(result);
    } catch (error) {
      console.error('Failed to calculate pack price:', error);
      setPackPriceResult({ success: false, error: 'Failed to calculate pack price' });
    } finally {
      setIsLoadingPrice(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6 max-w-2xl">
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Simulate VibeMarket Contract
        </h1>
        <CustomConnectButton />
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Pack Name
            </label>
            <input
              type="text"
              value={formData.packName}
              onChange={(e) => handleInputChange("packName", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., My Awesome Pack"
            />
            <p className="mt-1 text-sm text-gray-500">
              Used for both Token Name and NFT Name
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Token Symbol
            </label>
            <input
              type="text"
              value={formData.tokenSymbol}
              onChange={(e) => handleInputChange("tokenSymbol", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., MAP"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              NFT Symbol
            </label>
            <input
              type="text"
              value={formData.nftSymbol}
              onChange={(e) => handleInputChange("nftSymbol", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., MAP"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Owner Address
            </label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => handleInputChange("owner", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Pack Amount
            </label>
            <input
              type="number"
              value={formData.packAmount}
              onChange={(e) => handleInputChange("packAmount", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              Use 0 to just create the drop, {">"}0 to create and buy packs
              (requires ETH)
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Metadata Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-collection-slug"
            />
            <p className="mt-1 text-sm text-gray-500">
              Will generate baseURI:
              https://build.wield.xyz/vibe/boosterbox/metadata/{formData.slug}/
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="mb-3 text-lg font-medium text-blue-800">
              Pack Price Calculation
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-blue-700">
                  Drop Contract Address
                </label>
                <input
                  type="text"
                  value={formData.contractAddress}
                  onChange={(e) => handleInputChange("contractAddress", e.target.value)}
                  className="px-3 py-2 w-full rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x... (deployed drop contract address)"
                />
                <p className="mt-1 text-xs text-blue-600">
                  Enter the deployed drop contract address to calculate pack price
                </p>
              </div>
              <button
                onClick={calculatePackPrice}
                disabled={!formData.contractAddress || !formData.packAmount || formData.packAmount === "0" || isLoadingPrice}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPrice ? "Calculating..." : "Calculate Pack Price"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 mt-6 bg-green-50 rounded-md border border-green-200">
          <h3 className="mb-2 text-lg font-medium text-green-800">
            ✅ Updated Contract Configuration
          </h3>
          <p className="mb-3 text-sm text-green-700">
            Fixed based on successful vibe.market transaction analysis:
          </p>
          <ul className="mb-3 text-xs list-disc list-inside text-green-600">
            <li>Removed mintFeeETH and initialLiquidityETH parameters</li>
            <li>Added realistic non-zero token amounts from working example</li>
            <li>BaseURI uses vibe.market format with your provided slug</li>
          </ul>
          <pre className="overflow-x-auto text-sm text-gray-700">
            {JSON.stringify(
              {
                ...customConfig,
                tokensPerMint: customConfig.tokensPerMint.toString(),
                commonOffer: customConfig.commonOffer.toString(),
                rareOffer: customConfig.rareOffer.toString(),
                epicOffer: customConfig.epicOffer.toString(),
                legendaryOffer: customConfig.legendaryOffer.toString(),
                mythicOffer: customConfig.mythicOffer.toString(),
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-lg font-medium">Simulation Result</h3>
          {isLoading && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-blue-700">Simulating contract call...</p>
            </div>
          )}

          {isError && (
            <div className="p-4 bg-red-50 rounded-md">
              <p className="text-red-700">Error: {error?.message}</p>
            </div>
          )}

          {simulationResult && (
            <div className="p-4 bg-green-50 rounded-md">
              <p className="mb-2 text-green-700">✅ Simulation successful!</p>
              <div className="text-sm">
                <p>
                  <strong>Gas Estimate:</strong>{" "}
                  {simulationResult.request.gas?.toString()}
                </p>
                <p>
                  <strong>Expected Token Contract:</strong>{" "}
                  {simulationResult.result?.[0]}
                </p>
                <p>
                  <strong>Expected Drop Contract:</strong>{" "}
                  {simulationResult.result?.[1]}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && !simulationResult && (
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-yellow-700">
                Fill in all required fields to simulate the contract call
              </p>
            </div>
          )}
        </div>

        {/* Pack Price Calculation Results */}
        {packPriceResult && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-medium">Pack Price Calculation</h3>
            {packPriceResult.success ? (
              <div className="p-4 bg-green-50 rounded-md">
                <p className="mb-2 text-green-700">✅ Price calculation successful!</p>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Pack Amount:</strong> {packPriceResult.packAmount}
                  </p>
                  <p>
                    <strong>Total Price (Wei):</strong> {packPriceResult.mintPrice}
                  </p>
                  <p>
                    <strong>Total Price (ETH):</strong> {(Number(packPriceResult.mintPrice) / 1e18).toFixed(10)} ETH
                  </p>
                  <p>
                    <strong>Contract Address:</strong> {packPriceResult.contractAddress}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-md">
                <p className="mb-2 text-red-700">❌ Price calculation failed</p>
                <p className="text-sm text-red-600">{packPriceResult.error}</p>
                {packPriceResult.fallback && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800">Fallback Calculation:</p>
                    <p className="text-xs text-yellow-700">
                      <strong>Pack Amount:</strong> {packPriceResult.fallback.packAmount}
                    </p>
                    <p className="text-xs text-yellow-700">
                      <strong>Estimated Price (Wei):</strong> {packPriceResult.fallback.mintPrice}
                    </p>
                    <p className="text-xs text-yellow-700">
                      <strong>Estimated Price (ETH):</strong> {(Number(packPriceResult.fallback.mintPrice) / 1e18).toFixed(10)} ETH
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">{packPriceResult.fallback.note}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="p-4 mt-6 bg-blue-50 rounded-md">
          <h3 className="mb-2 text-lg font-medium">Contract Details</h3>
          <p className="text-sm text-gray-700">
            <strong>Contract Address:</strong> {VIBEMARKET_PROXY_ADDRESS}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Function:</strong> createDropWithConfig
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulateContractPage;
