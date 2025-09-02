import { readContract } from '@wagmi/core'
import { config } from '@/lib/wagmi'
import L2ResolverAbi from '@/abi/L2ResolverAbi'
import { namehash, Address, keccak256, encodePacked } from 'viem'
import { base } from 'viem/chains'

const BASENAME_L2_RESOLVER_ADDRESS = process.env.NEXT_PUBLIC_BASENAME_L2_RESOLVER_ADDRESS as `0x${string}`

// EXACT implementation from OnchainKit
function convertReverseNodeToBytes(address: Address, chainId: number): `0x${string}` {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(encodePacked(['string'], [addressFormatted.substring(2)]));
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(`${chainCoinType.toLocaleUpperCase()}.reverse`);
  const addressReverseNode = keccak256(
    encodePacked(['bytes32', 'bytes32'], [baseReverseNode, addressNode])
  );
  return addressReverseNode;
}

// Convert chainId to coinType hex for reverse chain resolution
function convertChainIdToCoinType(chainId: number): string {
  // L1 resolvers to addr
  if (chainId === 1) { // mainnet
    return "addr";
  }

  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
}

export async function getBasenameAvatar(basename: string): Promise<string | null> {
  if (!BASENAME_L2_RESOLVER_ADDRESS) {
    return null
  }
  
  try {
    const avatar = await readContract(config, {
      abi: L2ResolverAbi,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: 'text',
      args: [namehash(basename), 'avatar'],
    })
    
    return avatar as string || null
  } catch (error) {
    console.error('Failed to resolve basename avatar:', error)
    return null
  }
}

export async function resolveBasename(address: Address): Promise<string | null> {
  if (!BASENAME_L2_RESOLVER_ADDRESS) {
    return null
  }
  
  try {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id)
    
    const basename = await readContract(config, {
      abi: L2ResolverAbi,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: 'name',
      args: [addressReverseNode],
    })
    
    if (basename && basename.trim() !== '') {
      return basename as string
    }
    
    return null
    
  } catch (error) {
    console.error('Failed to resolve basename:', error)
    return null
  }
}