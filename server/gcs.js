import { Storage } from '@google-cloud/storage';
import path from 'path';

const storage = new Storage(
    process.env.GOOGLE_APPLICATION_CREDENTIALS
        ? { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS }
        : {}
);

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export const uploadToGCS = (fileBuffer, originalName, mimetype) => {
    return new Promise((resolve, reject) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(originalName);
        const filename = uniqueSuffix + ext;

        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: mimetype,
            metadata: {
                cacheControl: 'public, max-age=31536000'
            }
        });

        blobStream.on('error', reject);
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`;
            resolve(publicUrl);
        });

        blobStream.end(fileBuffer);
    });
};

export const deleteFromGCS = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('storage.googleapis.com')) return Promise.resolve();

    const filename = imageUrl.split('/').pop();
    return bucket.file(filename).delete().catch(err => {
        console.error('GCS delete error:', err.message)
    });
};