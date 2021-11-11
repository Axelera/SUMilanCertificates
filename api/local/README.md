# SUMilanCertificate Node.js API (local)
This code is typically used for development.

## Usage
### Requirements
- [these](../README.md#requirements) requirements

### Install
- create a file named `.env` and put these lines inside:
```
METAMASK_PRIVATE_KEY="<obtained in the requirements>"
METAMASK_PUBLIC_KEY="<obtained in the requirements>"

ALCHEMY_API_URL="<obtained in the requirements>"

CONTRACT_ADDRESS="<the contract address>"

PINATA_API_KEY="<obtained in the requirements>"
PINATA_SECRET_API_KEY="<obtained in the requirements>"
PINATA_JWT="<obtained in the requirements>"

SUPABASE_URL="<obtained in the requirements>"
SUPABASE_KEY="<obtained in the requirements>"
```
- install dependencies by running the command:
```
npm install
```

### Run
Run this command from this folder:
```
node api.js
```

## API reference
**Endpoint** : `api/mint`

**Method** : `POST`

**Auth required** : No

**Permissions required** : None

## Request

**type: body**

```json
{
    "recipiendAddress": "0x...",
    "recipientName": "John Doe",
    "eventId": "incontro-41"
}
```

**Request Fields Description**

| key | value | description |
|------------|--------------|-------------|
| recipiendAddress  |  0x... | ETH address that receives the certificate |
| recipientName  | John Doe | Name that appears on the certificate |
| eventId  | incontro-41 | event ID from Supabase database |

## Response

```json
{
    "transactionHash": "0x...",
}
```

**Response Fields Description**

| key | value | description |
|------------|--------------|-------------|
| transactionHash  |  0x... | ETH blockchain hash of the transaction that mints the certificate  |

**Response codes**

- If response is success, http **status** will be **200**
- If the invocation ends with error, http status will have the standard status: 401, 403, 500, 502, etc

| code | description |
|------------|-------------|
| 200  | ✅ success  |
| 400  | ❌ server did not find the event with that eventId of the event is not ended yet |
| 500  | ❌ server encountered an error  |
