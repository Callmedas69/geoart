API Reference
Get metadata for a token
GET
/
metadata
/
{slug}
/
{tokenId}

Try it
Headers
​
API-KEY
stringdefault:DEMO_REPLACE_WITH_FREE_API_KEYrequired
Free API key needed to authorize requests, grab one at docs.wield.xyz

Path Parameters
​
slug
stringrequired
The game slug

​
tokenId
integerrequired
The token ID

Response
200
Token metadata

const url = 'https://build.wield.xyz/vibe/boosterbox/metadata/{slug}/{tokenId}';
const options = {method: 'GET', headers: {'API-KEY': '<api-key>'}, body: undefined};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

example
 {"name":"GEO #1","description":"Buy GEO Booster Packs on vibe.market","image":"https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fdbfbe2dc-1ead-43d8-bbb4-c4e76f4e1200%2Fpublic","imageUrl":"https://vibechain.com/api/proxy?url=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fdbfbe2dc-1ead-43d8-bbb4-c4e76f4e1200%2Fpublic","external_url":"https://vibechain.com/market/0xa2f5371bdebd577e1a059c3ddca02b0172f1f3ee","attributes":[{"trait_type":"Rarity","value":"Common","display_type":"string"},{"trait_type":"Randomness","value":700274,"display_type":"number"},{"trait_type":"Status","value":"Burned"},{"trait_type":"Wear","value":"Moderately Played"},{"trait_type":"Wear Value","value":0.7060378915,"display_type":"number","max_value":1},{"trait_type":"Foil","value":"None"}],"animation_url":"https://vibechain.com/preview/market?cardimage=https%3A%2F%2Fimagedelivery.net%2Fg4iQ0bIzMZrjFMgjAnSGfw%2Fdbfbe2dc-1ead-43d8-bbb4-c4e76f4e1200%2Fpublic&wear=0.7060378915&foil=Normal"}

 const url = 'https://build.wield.xyz/vibe/boosterbox/metadata/geo/1';
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