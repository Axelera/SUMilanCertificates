const express = require('express');
const cors = require('cors');

const { mintNFT, getTokenURI, checkIfCanMint } = require('./mint-nft');
const { generateCertificateImg } = require('./img-generator');
const { getEventData } = require('./event-query');
const { uploadToIPFS } = require('./pinata-upload');
const { getNFTMetadata } = require('./utils');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/api/mint', async (request, response) => {
    /* Request body should be in the following format:
     *   {
     *       "recipiendAddress": "0x...", // address of the recipient
     *       "recipientName": "John Doe" // name of the recipient
     *       "eventId": "incontro-41" // id of the event
     *   }
     */
    try {
        console.log(request.body);
        const { recipientAddress, recipientName, eventId } = request.body;

        await checkIfCanMint(recipientAddress, 'ipfs://dummyURI', eventId);

        const eventData = await getEventData(eventId);
        if (eventData.error) {
            response.status(eventData.status).send(eventData.error);
            return;
        }

        const certificateBuffer = await generateCertificateImg(
            recipientName,
            eventData.title,
            `Milano, ${eventData.date}`
        );
        const certificateIpfsHash = await uploadToIPFS(
            certificateBuffer,
            'certificate.png'
        );

        const nftMetadata = getNFTMetadata(
            recipientName,
            eventData.title,
            eventData.date,
            certificateIpfsHash
        );
        console.log(nftMetadata);
        const nftMetadataIpfsHash = await uploadToIPFS(
            Buffer.from(JSON.stringify(nftMetadata)),
            'nft-metadata.json'
        );
        console.log(`NFT metadata uploaded to IPFS: ${nftMetadataIpfsHash}`);

        const tokenUri = `ipfs://${nftMetadataIpfsHash}`;
        const txHash = await mintNFT(recipientAddress, tokenUri, eventId);
        response.set(200).send({
            transactionHash: txHash,
        });
        // used for tests
        // response.set(200).send({
        //     transactionHash: '0xfeb3756f864e095a5e8c5c22ccb01917e1ecd721417820f466e4296d9835a7ed',
        // });
    } catch (error) {
        console.error(error);
        response.status(500).send(error.message);
    }
});

app.get('/api/tokenUri', async (request, response) => {
    /* Request query must have the following parameters:
        tokenId: number, // incremental tokenId of the NFT
    */
    try {
        const { tokenId } = request.query;
        const tokenUri = await getTokenURI(tokenId);
        response.set(200).send({ tokenUri });
    } catch (error) {
        console.error(error);
        response.status(500).send('Error retrieving tokenURI');
    }
});

app.listen(port, console.log('App Listening to port ' + port));
