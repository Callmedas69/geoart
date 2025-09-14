import { usePublicClient } from 'wagmi';
import { isAddress } from 'viem';

interface TokenStandardResult {
  isERC721: boolean;
  isERC1155: boolean;
  isLoading: boolean;
  error: string | null;
}

// Interface IDs for token standards
const ERC721_INTERFACE_ID = '0x80ac58cd';
const ERC1155_INTERFACE_ID = '0xd9b67a26';
const ERC165_INTERFACE_ID = '0x01ffc9a7';

export function useTokenStandard() {
  const publicClient = usePublicClient();

  const detectTokenStandard = async (contractAddress: string): Promise<TokenStandardResult> => {
    if (!contractAddress.trim() || !isAddress(contractAddress)) {
      return {
        isERC721: false,
        isERC1155: false,
        isLoading: false,
        error: 'Invalid contract address'
      };
    }

    if (!publicClient) {
      return {
        isERC721: false,
        isERC1155: false,
        isLoading: false,
        error: 'Public client not available'
      };
    }

    try {
      // Check if contract exists
      const bytecode = await publicClient.getBytecode({ address: contractAddress as `0x${string}` });
      if (!bytecode || bytecode.length <= 2) {
        return {
          isERC721: false,
          isERC1155: false,
          isLoading: false,
          error: 'Contract not found at this address'
        };
      }

      // Check if contract supports ERC165 (supportsInterface function)
      let supportsERC165 = false;
      try {
        await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: [
            {
              inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
              name: 'supportsInterface',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'view',
              type: 'function'
            }
          ],
          functionName: 'supportsInterface',
          args: [ERC165_INTERFACE_ID]
        });
        supportsERC165 = true;
      } catch {
        // Contract doesn't support ERC165, try direct method detection
      }

      let isERC721 = false;
      let isERC1155 = false;

      if (supportsERC165) {
        // Use supportsInterface to check standards
        try {
          const [erc721Support, erc1155Support] = await Promise.all([
            publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: [
                {
                  inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
                  name: 'supportsInterface',
                  outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                  stateMutability: 'view',
                  type: 'function'
                }
              ],
              functionName: 'supportsInterface',
              args: [ERC721_INTERFACE_ID]
            }) as Promise<boolean>,
            
            publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: [
                {
                  inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
                  name: 'supportsInterface',
                  outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                  stateMutability: 'view',
                  type: 'function'
                }
              ],
              functionName: 'supportsInterface',
              args: [ERC1155_INTERFACE_ID]
            }) as Promise<boolean>
          ]);

          isERC721 = erc721Support;
          isERC1155 = erc1155Support;
        } catch (error) {
          console.log('Error checking interface support:', error);
        }
      } else {
        // Fallback: try to detect by checking for specific functions
        
        // Check for ERC721 tokenURI function
        try {
          await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: [
              {
                inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
                name: 'tokenURI',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            functionName: 'tokenURI',
            args: [BigInt(1)]
          });
          isERC721 = true;
        } catch {
          // tokenURI not available or reverted
        }

        // Check for ERC1155 uri function
        try {
          await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: [
              {
                inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
                name: 'uri',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function'
              }
            ],
            functionName: 'uri',
            args: [BigInt(1)]
          });
          isERC1155 = true;
        } catch {
          // uri not available or reverted
        }

        // Check for ERC1155 balanceOf function (different signature than ERC721)
        if (!isERC1155) {
          try {
            await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: [
                {
                  inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'id', type: 'uint256' }
                  ],
                  name: 'balanceOf',
                  outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                  stateMutability: 'view',
                  type: 'function'
                }
              ],
              functionName: 'balanceOf',
              args: ['0x0000000000000000000000000000000000000001', BigInt(1)]
            });
            isERC1155 = true;
          } catch {
            // ERC1155 balanceOf not available
          }
        }
      }

      return {
        isERC721,
        isERC1155,
        isLoading: false,
        error: null
      };

    } catch (error) {
      return {
        isERC721: false,
        isERC1155: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to detect token standard'
      };
    }
  };

  return { detectTokenStandard };
}

export type { TokenStandardResult };