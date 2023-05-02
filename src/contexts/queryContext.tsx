import { useNavigate } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';
import { LOGGING, ROOT_URL } from '~/constants';

type QueryParamName =
  | 'start'
  | 'end'
  | 'date'
  | 'period'
  | 'direction'
  | 'fullscreen'
  | 'assets'
  | 'efa-type'
  | 'efa-start'
  | 'efa-end'
  | 'efa-status';

export type QueryParams = {
  [key in QueryParamName]?: string;
};
interface QueryContextProps {
  query: QueryParams;
  getPath: (params?: QueryParams, to?: string) => string;
  getQueryString: (...params: string[]) => string;
  setParam: (name: QueryParamName) => (value: string) => void;
}

export const QueryContext = React.createContext<QueryContextProps>({
  query: {},
  getPath: () => '',
  getQueryString: () => '',
  setParam: () => () => null,
});

export const QueryProvider = ({ children }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState<QueryParams>({});
  const getUrlParams = () => {
    const url = new URL(window.location.href);
    return Object.fromEntries(url.searchParams.entries());
  };

  useEffect(() => {
    const params = getUrlParams();
    const next = JSON.stringify(params);
    const prev = JSON.stringify(query);

    if (next !== prev) {
      setTimeout(() => {
        setQuery(params);
      }, 0);
    }
  }, [window.location.href]);

  const getPath = (params: QueryParams = {}, to?: string) => {
    const overlay = Object.assign({}, query);

    for (const key of Object.keys(params)) {
      overlay[key] = params[key];
    }
    const queryString = Object.keys(overlay)
      .map((key) => key + '=' + overlay[key])
      .join('&');

    let base = (to || location.pathname) + '?' + queryString;

    if (base.indexOf('/') === 0 && base.indexOf(ROOT_URL) !== 0) {
      base = ROOT_URL + base;
    }

    return base;
  };

  const getQueryString = (...params: string[]) => {
    return Object.keys(query).reduce((aggr, key) => {
      if (!params.includes(key)) return aggr;
      if (aggr) aggr += '&';
      aggr += `${key}=${query[key]}`;
      return aggr;
    }, '');
  };

  window.query = query;

  const setParam = (name: QueryParamName) => (value: string) => {
    const { [name]: _del, ...rest } = query;
    if (!value) {
      return setQuery(rest);
    }
    setQuery({ ...rest, [name]: value });
  };

  window.setParam = setParam;

  // auto navigate on query change
  useEffect(() => {
    const urlParams = getUrlParams();
    const isAuth0Query = urlParams?.code && urlParams?.state;

    // Don't override Auth0 callback flow
    if (isAuth0Query) return;

    if (Object.keys(query).length || Object.keys(urlParams).length) {
      LOGGING &&
        console.log(
          'navigating because query changed to',
          Object.entries(query).flat()
        );
      navigate(
        '?' +
          Object.entries(query)
            .map((e) => e.join('='))
            .join('&'),
        { replace: true }
      );
    }
  }, [JSON.stringify(query)]);

  return (
    <QueryContext.Provider
      value={{
        query,
        getPath,
        getQueryString,
        setParam,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export const useQuery = () => useContext(QueryContext);
