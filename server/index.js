import { http } from '@google-cloud/functions-framework';
import { connectDB } from './db.js';
import app from './app.js';

http('whereWasThatServer', async (req, res) => {
    await connectDB();
    app(req, res);
});