/*
  FUNCTION: pick(keys)(object) creates new object with "keys" picked from original object.
  EXAMPLE: pick(['foo'])({ foo: 'bar', age: 7 }) ==> { foo: 'bar' }
*/
export const pick =
  (keys = []) =>
  (object) =>
    keys.reduce((acc, key) => {
      acc[key] = object[key];
      return acc;
    }, {});

/*
  FUNCTION: toQuery(object) creates queries from objects
  EXAMPLE: { foo: 'bar', cat: 'dog' } ==> "foo=bar&cat=dog"
*/
export const toQuery = (object) =>
  Object.entries(object)
    .map((pair) => pair.join('='))
    .join('&');

/*
  FUNCTION: getUrl(url:string, options:object?) returns new string url with optional query/whitelisted-query
  EXAMPLE1: getUrl('https://foo.com/compare?cat=dog&age=7') ==> 'https://foo.com/compare'
  EXAMPLE2: getUrl('https://foo.com/compare?cat=dog&age=7', { query: true }) ==> 'https://foo.com/compare?cat=dog&age=7'
  EXAMPLE3: getUrl('https://foo.com/compare?cat=dog&age=7', { query: ['age'] }) ==> 'https://foo.com/compare?age=7'
*/
export interface QueryWhitelist {
  query: boolean | string[];
}

export const getUrl = (url, { query }: QueryWhitelist): string => {
  if (!url.includes('http')) {
    url = window.location.origin + url;
  }

  url = new URL(url);

  if (Array.isArray(query)) {
    // use whitelist and make custom url
    const customUrl =
      url.origin +
      url.pathname +
      '?' +
      toQuery(pick(query)(Object.fromEntries(url.searchParams)));
    return customUrl;
  }

  if (!query) {
    url.search = '';
  }

  return url.toString();
};
