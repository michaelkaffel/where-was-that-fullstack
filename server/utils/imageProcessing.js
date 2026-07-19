import sharp from 'sharp';

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;
const PNG_COMPRESSION_LEVEL = 9;

export const compressImage = async (buffer, mimetype) => {
    const transformer = sharp(buffer)
        .rotate()
        .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true
        });

    switch (mimetype) {
        case 'image/png':
            return transformer.png({ compressionLevel: PNG_COMPRESSION_LEVEL }).toBuffer();
        case 'image/webp':
            return transformer.webp({ quality: WEBP_QUALITY }).toBuffer();
        case 'image/jpeg':
        default:
            return transformer.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    }
};

