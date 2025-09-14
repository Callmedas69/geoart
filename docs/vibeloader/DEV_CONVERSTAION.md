const customConfig = {
        baseURI: `https://build.wield.xyz/vibe/boosterbox/metadata/${slug}/`,

// these don’t matter since they are deprecated. You can pass in 1 or 0
        tokensPerMint: 0,
        mintFeeETH: 0,
        initialLiquidityETH: 0,
        commonOffer: 0,
        rareOffer: 0,
        epicOffer: 0,
        legendaryOffer: 0,
        mythicOffer: 0,
      };

Can you try using the newest contract factory, we changed a bit of the API

      // Call the factory contract 
      const tx = await writeContractAsync({
        address: “VIBEMARKET_PROXY_ADDRESS”,
        abi: // paste the ABI,
        functionName: "createDropWithConfig",
        args: [
          packName, // tokenName
          finalTokenSymbol, // tokenSymbol
          packName, // nftName
          finalTokenSymbol, // nftSymbol
          finalOwnerAddress, // owner (custom or connected wallet)
          0, // amount of packs to purchase - use passed value
          customConfig,
        ],
        value: 0, // only Send ETH if buying packs
      });

basically use createDropWithConfig