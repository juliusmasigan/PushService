import * as crypto from 'crypto';


export const jwtConstants = {
    // secret: crypto.createHmac('sha256', 'secret').digest('hex')
    secret: process.env.SECRET_KEY
};
