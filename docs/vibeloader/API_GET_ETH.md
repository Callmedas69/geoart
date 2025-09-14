const url = 'https://build.wield.xyz/vibe/boosterbox/eth-price';
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

{
    "success":true,
    "price":4662.52691935909,
    "priceFormatted":"$4,662.53",
    "lastUpdated":"2025-09-14T07:41:21.278Z"}