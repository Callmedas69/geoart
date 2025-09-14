// Factory contract ABI for creating BoosterDrop collections
export const FACTORY_CONTRACT_ADDRESS = "0x89078aba782d14277325484960d576f6f38b4ea8";

export const FACTORY_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address", 
        "name": "dropContract",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenContract", 
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "nftName",
        "type": "string"
      },
      {
        "internalType": "string", 
        "name": "nftSymbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenName", 
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      }
    ],
    "name": "DropCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "nftName", 
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "nftSymbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address" 
          },
          {
            "internalType": "string",
            "name": "baseURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "tokensPerMint",
            "type": "uint256"
          },
          {
            "internalType": "uint256", 
            "name": "commonOffer",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rareOffer", 
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "epicOffer",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "legendaryOffer",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "mythicOffer", 
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "entropyAddress",
            "type": "address"
          }
        ],
        "internalType": "struct IBoosterDropV2.InitializeParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "createDrop",
    "outputs": [
      {
        "internalType": "address",
        "name": "dropContract",
        "type": "address"
      },
      {
        "internalType": "address", 
        "name": "tokenContract",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Default offer amounts - using more reasonable values 
export const DEFAULT_OFFERS = {
  common: "1000000000000000000",        // 1 token (1e18)
  rare: "10000000000000000000",         // 10 tokens (10e18)  
  epic: "50000000000000000000",         // 50 tokens (50e18)
  legendary: "100000000000000000000",   // 100 tokens (100e18)
  mythic: "500000000000000000000",      // 500 tokens (500e18)
  tokensPerMint: "1000000000000000000"  // 1 token per mint (1e18)
};