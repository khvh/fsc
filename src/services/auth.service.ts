import { Expose, plainToClass } from 'class-transformer';
import got from 'got';
import { verify } from 'jsonwebtoken';
import jwks from 'jwks-rsa';
import { stringify } from 'qs';
import { Service } from 'typedi';
import { Authorize } from '..';

export class OIDCResponse {
  @Expose({ name: 'access_token', toClassOnly: true })
  accessToken: string;

  @Expose({ name: 'expires_in', toClassOnly: true })
  expiresIn: number;

  @Expose({ name: 'refresh_expires_in', toClassOnly: true })
  refreshExpiresIn: number;

  @Expose({ name: 'refresh_token', toClassOnly: true })
  refreshToken: string;

  @Expose({ name: 'token_type', toClassOnly: true })
  tokenType: string;

  @Expose({ name: 'id_token', toClassOnly: true })
  idToken: string;

  @Expose({ name: 'no-before-policy', toClassOnly: true })
  notBeforePolicy: number;

  @Expose({ name: 'session_state', toClassOnly: true })
  sessionState: string;

  scope: string;
}

export class WellKnown {
  @Expose()
  issuer: string;

  @Expose({ name: 'authorization_endpoint' })
  authorizationEndpoint: string;

  @Expose({ name: 'token_endpoint' })
  tokenEndpoint: string;

  @Expose({ name: 'introspection_endpoint' })
  introspectionEndpoint: string;

  @Expose({ name: 'userinfo_endpoint' })
  userinfoEndpoint: string;

  @Expose({ name: 'end_session_endpoint' })
  endSessionEndpoint: string;

  @Expose({ name: 'jwks_uri' })
  jwksUri: string;

  @Expose({ name: 'check_session_iframe' })
  checkSessionIframe: string;

  @Expose({ name: 'registration_endpoint' })
  registrationEndpoint: string;
}

export interface OIDCConfig {
  provider: string;
  redirect: string;
  clientId: string;
  clientSecret?: string;
}

@Service()
export class OpenIDAuthService {
  private config: OIDCConfig;
  private key: string;
  private wellKnown: WellKnown;

  setConfig(config: OIDCConfig) {
    this.config = config;

    return this;
  }

  async fetchWellKnown() {
    const res = await got(this.config.provider).json();

    this.wellKnown = plainToClass(WellKnown, res, { excludeExtraneousValues: true });
  }

  async fetchKeys() {
    const client = jwks({
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000,
      jwksUri: this.wellKnown.jwksUri
    });

    const key = await client.getSigningKey();

    this.key = key.getPublicKey();
  }

  getKey() {
    return this.key;
  }

  authenticate(redirect) {
    const params = {
      redirect_uri: `${this.config.redirect}?redirect=${redirect}`,
      client_id: this.config.clientId,
      response_type: 'code',
      response_mode: 'query',
      scope: 'openid'
    };

    const url = `${this.wellKnown.authorizationEndpoint}?${stringify(params)}`;

    return {
      url
    };
  }

  async getToken(code: string, redirect: string) {
    const form: Record<string, any> = {
      grant_type: 'authorization_code',
      code,
      client_id: this.config.clientId,
      redirect_uri: `${this.config.redirect}?redirect=${redirect}`
    };

    if (this.config.clientSecret) {
      form.client_secret = this.config.clientSecret;
    }

    const res = await got
      .post(this.wellKnown.tokenEndpoint, {
        form
      })
      .json();

    return plainToClass(OIDCResponse, res);
  }

  @Authorize()
  async userInfo(token: string) {
    return got(this.wellKnown.userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).json();
  }

  async verifyToken(token: string) {
    return new Promise<boolean>((resolve, reject) => {
      verify(token, this.key, (err) => {
        if (!!err) {
          return reject(false);
        }

        return resolve(true);
      });
    });
  }

  async decodeUser<U>(token: string) {
    return new Promise<U>((resolve, reject) => {
      verify(token, this.key, (err, decoded) => {
        if (!!err) {
          return reject(null);
        }

        return resolve(decoded as U);
      });
    });
  }
}
