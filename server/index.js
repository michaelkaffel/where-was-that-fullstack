import { http } from '@google-cloud/functions-framework';
import app from './app.js';


http('whereWasThatServer', app);