export interface BuyTokenParams {
  tokenAddress: `0x${string}` // Drop contract address
  tokenAmount: bigint // Number of packs to mint
  recipient: `0x${string}`
  referrer?: `0x${string}`
  originReferrer?: `0x${string}`
}

export interface BuyModalProps {
  isOpen: boolean
  onClose: () => void
  tokenAddress: `0x${string}` // Drop contract address
  creatorAddress: `0x${string}`
}