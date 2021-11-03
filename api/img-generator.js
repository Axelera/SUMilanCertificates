var Jimp = require('jimp');

const generateImg = (name, event, date, saveToLocal = false) => {
    return new Promise((resolve, reject) => {
        Jimp.read('api/base.png', async (err, base) => {
            if (err) {
                reject(err);
                return;
            }
            const fontName = await Jimp.loadFont(
                'api/fonts/source-sans-pro/46-black/ufonts.com_source-sans-pro.ttf.fnt'
            );
            const fontEvent = await Jimp.loadFont(
                'api/fonts/source-sans-pro/32-blue/ufonts.com_source-sans-pro.ttf.fnt'
            );
            const fontDate = await Jimp.loadFont(
                'api/fonts/source-sans-pro/20-purple/ufonts.com_source-sans-pro.ttf.fnt'
            );
            base.print(
                fontName,
                0,
                200,
                {
                    text: name,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                },
                base.getWidth()
            )
                .print(
                    fontEvent,
                    0,
                    360,
                    {
                        text: event,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    },
                    base.getWidth()
                )
                .print(fontDate, 750, 480, date);

            if (saveToLocal) {
                base.write('api/certificate.png'); // save
            }

            base.getBuffer('image/png', (err, image) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(image);
            });
        });
    });
};

module.exports.generateCertificateImg = generateImg;

const main = async () => {
    console.log(
        await generateImg(
            'John Doe',
            'Incontro 41: NFT: cosa sono e come funzionano',
            'Milano, 24/09/2021',
            true
        )
    );
};

if (require.main === module) {
    main();
}
