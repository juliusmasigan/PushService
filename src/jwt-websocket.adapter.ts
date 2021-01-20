import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io"
import { IncomingMessage } from "http";
import { extract, parse } from "query-string";
import * as JwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
// import * as auth_hdr from 'auth-header';


export class JwtWebsocketAdapter extends IoAdapter {
    private static pubKey;
    constructor(private app: INestApplicationContext) {
        super(app);
    }

    getKey(header, callback) {
        const config = new ConfigService();
        JwksClient({
            jwksUri: `${config.get('AUTH0_ISSUER_URL')}/.well-known/openid-configuration/jwks`,
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
        }).getSigningKey(header.kid, (err, key) => {
            JwtWebsocketAdapter.pubKey = key.getPublicKey();
            callback(null, key.getPublicKey());
        });
    }

    createIOServer(port: number, options?: SocketIO.ServerOptions): any {
        options.allowRequest = async (request: IncomingMessage, allowFunction) => {
            // Uncomment this if using ws platform and not socket.io.
            // Authorization Token should be in added in the request header.
            // const token = auth_hdr.parse(request.headers.authorization).token;
            const token = parse(extract(request.url))?.token as string;

            const key: any = JwtWebsocketAdapter.pubKey ? JwtWebsocketAdapter.pubKey : this.getKey;
            jwt.verify(token, key, (err: jwt.JsonWebTokenError, payload) => {
                if (!err) {
                    return allowFunction(null, true);
                }
                return allowFunction('Unauthorized', false);
            });
        }

        return super.createIOServer(port, options);
    }
}
