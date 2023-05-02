import { GetTokenSilentlyOptions } from '@auth0/auth0-react';

const TTL = 1000 * 60 * 30; // 30 minutes

export class DataFetcher {
  private map = {};
  private readonly ttl: number;
  private getToken: (options?: GetTokenSilentlyOptions) => Promise<string>;

  constructor(getToken, { ttl = TTL } = {}) {
    this.ttl = ttl;
    this.getToken = getToken;
  }

  public request(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
    return async <T>(
      location: RequestInfo | string,
      body: BodyInit = '',
      cache = true
    ): Promise<T> => {
      const token = await this.getToken();
      const fetchOptions: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const cacheKey = `${method}|${location}|${JSON.stringify(fetchOptions)}`;

      // serve cached GET requests
      if (cache && this.map[cacheKey] && method === 'GET') {
        return this.map[cacheKey];
      }

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        if (typeof body == 'object') {
          fetchOptions.body = body;
        } else {
          fetchOptions.headers['content-type'] = 'application/json';
          fetchOptions.body =
            typeof body === 'string' ? body : JSON.stringify(body);
        }
      }

      const promise = fetch(location, fetchOptions).then((r) =>
        r.headers.get('content-type')?.includes('application/json')
          ? r.json()
          : r
      );

      const fetcher: Promise<T> = (this.map[cacheKey] = promise);
      fetcher.then(() => {
        setTimeout(() => {
          console.log('expiring data after', this.ttl, 'ms', location);
          delete this.map[cacheKey];
        }, this.ttl);
      });

      return fetcher;
    };
  }

  public get = this.request('GET');
  public post = this.request('POST');
  public put = this.request('PUT');
  public patch = this.request('PATCH');
  public delete = this.request('DELETE');
}

/*
  EXAMPLE USAGE:

  fetcher
    .get('/api/whatever')
    .then(console.log)
    .catch(console.error)

  fetcher
    .patch('/api/whatever', { foo: 'bar' })
    .then(console.log)
    .catch(console.error)
*/
