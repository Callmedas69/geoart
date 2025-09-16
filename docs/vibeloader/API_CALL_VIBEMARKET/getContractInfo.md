{"success":true,"contractInfo":{"gameId":"park-0003","tokenAddress":"0x55ebe388f17936a07d430e33d50e6870d8c1edeb","tokenName":"MEME PARK CARDS","tokenSymbol":"PARK","nftName":"MEME PARK CARDS","nftSymbol":"PARK","description":"Oh boy, here they come again… friends from Meme Park! They’re weird, they’re dumb, they’re totally broke… but that’s exactly why we love ‘em.\n \nPure hand-drawn art only, no AI. \n\nINK / 2025","imageUrl":"https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fdcd95b80-33ca-4358-7872-4e5304c3c700%2Fpublic","isGraduated":true,"marketCap":"00000000000046336391217322413641","marketCapUsd":"$210,228.21","preorderProgress":100,"bgColor":"#8dd605","featuredImageUrl":"https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fdcd95b80-33ca-4358-7872-4e5304c3c700%2Fpublic","slug":"meme-park-cards","ownerAddress":"0x2299aeb4baa0b102382ae0df95660fd004bd5ffa","pricePerPack":"00000000000000004633639121732241","pricePerPackUsd":"$21.02","dropContractAddress":"0x00038c3f1a8e6279d41cdebc215f908532b72e22","disableFoil":false,"disableWear":false,"packImage":"https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fbd6ef7dd-0a6d-4bb8-0613-0026d51c1700%2Fpublic","isActive":true,"links":{"twitter":"ink_mfer","website":"inkmfer.com"},"isNSFW":false,"isVerified":true,"isVerifiedArtist":true,"version":"v8","chainId":8453,"createdAt":"2025-09-08T16:33:59.723Z","updatedAt":"2025-09-12T15:11:34.454Z"}}

const url = 'https://build.wield.xyz/vibe/boosterbox/contractAddress/meme-park-cards?chainId=8453';
const options = {
  method: 'GET',
  headers: {'API-KEY': 'DEMO_REPLACE_WITH_FREE_API_KEY'},
  body: undefined
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}