import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, UserinfoResponse, TokenSet, Issuer } from 'openid-client';
import { AuthService } from './auth.service';

export const buildOpenIdClient = async () => {
    const TrustIssuer = (await Issuer.discover('http://server.softrons.com/auth/.well-known/openid-configuration'));
    // const TrustIssuer = new Issuer({
    //     issuer: 'Progrez Identity Server',
    //     token_endpoint: 'http://server.softrons.com/auth/connect/token',
    //     authorization_endpoint: 'http://server.softrons.com/auth/connect/authorize',
    // })
    const client = new TrustIssuer.Client({
        client_id: 'nestjs',
        client_secret: 'secret',
        token_endpoint_auth_method: 'client_secret_post'
    });
    return client;
};

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
    client: Client;

    constructor(private readonly authService: AuthService, client: Client) {
        super({
            client: client,
            // params: {
            //     redirect_uri: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_REDIRECT_URI,
            //     scope: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE,
            // },
            passReqToCallback: false,
            usePKCE: false,
        });

        this.client = client;
    }

    async validate(tokenset: TokenSet): Promise<any> {
        const userinfo: UserinfoResponse = await this.client.userinfo(tokenset);

        try {
            const id_token = tokenset.id_token
            const access_token = tokenset.access_token
            const refresh_token = tokenset.refresh_token
            const user = {
                id_token,
                access_token,
                refresh_token,
                userinfo,
            }
            return user;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}