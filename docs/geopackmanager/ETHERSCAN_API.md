Logo
Ask or search…
Ctrl
K
Home
API PRO
Twitter

Etherscan V2
Introduction
Getting an API Key
Rate Limits
Supported Chains
V1 to V2 API Migration Guide
🔍
Use Cases
Accounting/Taxes
🎯
API Endpoints
Nametags
Accounts
Contracts
Transactions
Blocks
Logs
Geth/Parity Proxy
Tokens
Gas Tracker
Stats
L2 Deposits/Withdrawals
Usage
🏆
API PRO
Etherscan API PRO
🍳
Cookbook
Track Uniswap V4 DEX Trades
Get An Address's Full Transaction History
✅
Contract Verification
Verify with Foundry
Verify with Hardhat
Verify with Remix
Common Verification Errors
🤝
Support
FAQ
Checking Usage
Common Error Messages
Getting Help
Visit Etherscan.io
Powered by GitBook
Get Contract ABI for Verified Contract Source Codes
Get Contract Source Code for Verified Contract Source Codes
Get Contract Creator and Creation Tx Hash
Verify Source Code
Verify Vyper Source Code
Verify Stylus Source Code
Check Source Code Verification Status
Verify Proxy Contract
Verifying Proxy Contract using cURL
Checking Proxy Contract Verification Submission Status using cURL
Copy

🎯
API Endpoints
Contracts
Get Contract ABI for Verified Contract Source Codes
Returns the Contract Application Binary Interface ( ABI ) of a verified smart contract.

Find verified contracts ✅on our Verified Contracts Source Code page.

Copy
https://api.etherscan.io/v2/api
   ?chainid=1
   &module=contract
   &action=getabi
   &address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413
   &apikey=YourApiKeyToken
Try this endpoint in your browser 🔗

Request
Response
Query Parameters

Parameter
Description
address

the contract address that has a verified source code

Get Contract Source Code for Verified Contract Source Codes
Returns the Solidity source code of a verified smart contract.

📩 Tip : You can also download a CSV list of verified contracts addresses of which the code publishers have provided a corresponding Open Source license for redistribution.

Try this endpoint in your browser 🔗

Copy
https://api.etherscan.io/v2/api
   ?chainid=1
   &module=contract
   &action=getsourcecode
   &address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413
   &apikey=YourApiKeyToken 
Request
Response
Query Parameters

Parameter
Description
address

the contract address that has a verified source code

Get Contract Creator and Creation Tx Hash
Returns a contract's deployer address and transaction hash it was created, up to 5 at a time.

Copy
https://api.etherscan.io/v2/api
   ?chainid=1
   &module=contract
   &action=getcontractcreation
   &contractaddresses=0xB83c27805aAcA5C7082eB45C868d955Cf04C337F,0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45,0xe4462eb568E2DFbb5b0cA2D3DbB1A35C9Aa98aad,0xdAC17F958D2ee523a2206206994597C13D831ec7,0xf5b969064b91869fBF676ecAbcCd1c5563F591d0
   &apikey=YourApiKeyToken 
Try this endpoint in your browser 🔗

Request
Response
Query Parameters

Parameter
Description
contractaddresses

the contract address , up to 5 at a time

Verify Source Code
Submits a contract source code to an Etherscan-like explorer for verification.

🌐 Tutorial : A full walk through of submitting multichain contract verification.

By verifying a contract, you agree to our terms.

Copy
https://api.etherscan.io/v2/api
   ?chainid=1
   &module=contract
   &action=verifysourcecode
   &apikey=YourApiKeyToken 
Request
Response
Query Parameters

Requests must be sent using HTTP POST, limited to 250 verifications/day

Parameter
Description
chainId

the chain to submit verification, such as 1 for mainnet

codeformat

single file, use
solidity-single-file
JSON file ( recommended ), use solidity-standard-json-input

sourceCode

the Solidity source code

constructorArguements

optional, include if your contract uses constructor arguments

contractaddress

the address your contract is deployed at

contractname

the name of your contract, such as

contracts/Verified.sol:Verified

compilerversion

compiler version used, such as v0.8.24+commit.e11b9ed9

for ZK Stack, the Solidity version in this field should match what zkSolc expects, eg: v0.8.29-1.0.1

*compilermode

for ZK Stack, set to solc/zksync

*zksolcVersion

for ZK Stack, zkSolc version used, such as v1.3.14

Verify Vyper Source Code
Submits a Vyper contract source code to Etherscan for verification.

By verifying a contract, you agree to our terms.

Copy
https://api.etherscan.io/v2/api
   ?chainid=1
   &module=contract
   &action=verifysourcecode
   &apikey=YourApiKeyToken 
Request
Response
Query Parameters

Requests must be sent using HTTP POST, limited to 250 verifications/day

Parameter
Description
codeformat

use vyper-json

sourceCode

the Vyper source code, in JSON format

constructorArguments

optional, include if your contract uses constructor arguments

contractaddress

the address your contract is deployed at

contractname

the name of your contract, such as

contracts/Verified.vy:Verified

compilerversion

compiler version used, such as vyper:0.4.0

optimizationUsed

use 0 for no optimisation and 1 for optimisation used

Verify Stylus Source Code
Tip 💡 : Arbitrum Stylus lets you write smart contracts in familiar languages like C, C++, Rust and more.

Submits a contract source code written with Stylus for verification.

Copy
https://api.etherscan.io/v2/api
   ?chainid=42161
   module=contract
   &action=verifysourcecode
   &apikey=YourApiKeyToken 
Request
Response
Query Parameters

Requests must be sent using HTTP POST

Parameter
Description
codeformat

stylus

sourceCode

the Github link of the source code,

https://github.com/OffchainLabs/stylus-hello-world

contractaddress

the address your contract is deployed at

contractname

the contract name, stylus_hello_world

compilerversion

the compiler version such asstylus:0.5.3

licenseType

the open source license to add, such as 3 for MIT

Check Source Code Verification Status
Returns the success or error status of a contract verification request.

Copy
https://api.etherscan.io/v2/api
   ?chainid=1
   &module=contract
   &action=checkverifystatus
   &guid=x3ryqcqr1zdknhfhkimqmizlcqpxncqc6nrvp3pgrcpfsqedqi
   &apikey=YourApiKeyToken 
Try this endpoint in your browser 🔗

Request
Response
Query Parameters

Parameter
Description
guid

the unique guid received from the verification request

Verify Proxy Contract
Submits a proxy contract source code to Etherscan for verification.

Requires a valid Etherscan API key, it will be rejected otherwise

Current daily limit of 100 submissions per day per user (subject to change)

Only supports HTTP post

Upon successful submission you will receive a GUID (50 characters) as a receipt

You may use this GUID to track the status of your submission

Verified proxy contracts will display the "Read/Write as Proxy" of the implementation contract under the contract address's contract tab

Verifying Proxy Contract using cURL
Request
Response
Copy
// example with only the mandatory contract address parameter
curl -d "address=0xcbdcd3815b5f975e1a2c944a9b2cd1c985a1cb7f" "https://api.etherscan.io/v2/api?chainid=1&module=contract&action=verifyproxycontract&apikey=YourApiKeyToken"

// example using the expectedimplementation optional parameter
// the expectedimplementation enforces a check to ensure the returned implementation contract address == address picked up by the verifier
curl -d "address=0xbc46363a7669f6e12353fa95bb067aead3675c29&expectedimplementation=0xe45a5176bc0f2c1198e2451c4e4501d4ed9b65a6" "https://api.etherscan.io/v2/api?chainid=1&module=contract&action=verifyproxycontract&apikey=YourApiKeyToken"
Checking Proxy Contract Verification Submission Status using cURL
Request
Response
Copy
curl "https://api.etherscan.io/v2/api?chainid=1&module=contract&action=checkproxyverification&guid=gwgrrnfy56zf6vc1fljuejwg6pelnc5yns6fg6y2i6zfpgzquz&apikey=YourApiKeyToken"
Previous
Accounts
Next
Transactions
Last updated 1 month ago

Contracts | Etherscan