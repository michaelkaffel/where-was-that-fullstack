import cors from 'cors';

const whitelist = ['http://localhost:3000', 'https://localhost:3443', process.env.CLIENT_URL];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { orgin: true };
    } else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions)
};

export const corsMiddleware = cors();

export const corsWithOptions = cors(corsOptionsDelegate);