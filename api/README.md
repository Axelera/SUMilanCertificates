# SUMilanCertificate Node.js API
This folder has this structure:
- `local/`: if you want to run an Express + Node.js server that exposes the API (typically used for development). More info [here](local/README.md).
- `lambda/`: if you want to deploy the API to Amazon AWS Lambda service. More info [here](lambda/README.md).

## How the certificate is minted
1. The server receives a `POST` request (see endpoint specifications inside each folder) with this body:
    ```javascript
    {
        "recipiendAddress": "0x...", // address of the recipient
        "recipientName": "John Doe", // name of the recipient
        "eventId": "incontro-41" // id of the event
    }
    ```
2. Verifies if the event exists on Supabase database
3. Checks if the certificate is mintable (typically rejected if the `recipientAddress` already has a certifificate associated to that `eventId`)
4. From the [base.png](local/base.png), generates an image of the certificate using Jimp library. Example:
![certificate.png](https://gateway.pinata.cloud/ipfs/QmNZLQj6GDoJZzj5iU9aTv8EMssMZRXJ3SUZ7MccR4vubU)

5. uploads the image to IPFS using Pinata and gets the IPFS hash
6. generates NFT metadata following the [ERC721 Metadata JSON Schema](https://eips.ethereum.org/EIPS/eip-721#specification). Example:
    ```javascript
    {
        "name": "SUMilan Chapter Event Participation Certificate",
        "description": "To: SU Milan Chapter; Event: Incontro 41: NFT: che cosa sono e come funzionano; Date: 24/09/2021",
        "image": "ipfs://QmNZLQj6GDoJZzj5iU9aTv8EMssMZRXJ3SUZ7MccR4vubU"
    }
    ```
7. upload the NFT metadata to IPFS using Pinata and gets the IPFS hash
8. invokes the `mintCertificate` function of the smart contract by signing a transaction using Alchemy
9. returns the transaction hash.

### Requirements
- `Node.js` and `npm` installed
- Ethereum private and public address keys (see [Requirements](../README.md#2-ethereum-wallet))
- Alchemy API Url (see [Requirements](../README.md#3-alchemy-api))
- Pinata API Keys (see [Requirements](../README.md#4-ipfs--pinata-api))
- Supabase API Keys (see [Requirements](../README.md#5-supabase-api))
- deployed contract address (see [here](../README.md#store-the-contract-address))