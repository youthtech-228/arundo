import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Assets } from './classes/assets';
import { AssetTypeData } from './classes/AssetType';
import { EventTypeData } from '~/classes/EventType';
import { TagTypeData } from '~/classes/TagType';
import { DataSourceData } from '~/classes/DataSource';
import { UnitData } from '~/classes/Unit';
import { AssetViewData } from '~/classes/AssetView';
import { GroupData } from '~/classes/Group';
import { InvestigationTypes } from './classes/investigationTypes';
import { DataFetcher } from './classes/DataFetcher';
import { Marathon } from './classes/Marathon';
import App from './components/App';
import {
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  LOGGING,
} from './constants';

import './styles/app.scss';
import { Dictionary } from './types/utils';
import { GraphTypeData } from './classes/graphType';

// Declare window object. For TypeScript only
declare global {
  interface Window {
    assets: Assets;
    dataSources: Array<DataSourceData>;
    assetTypes: Array<AssetTypeData>;
    investigationTypes: InvestigationTypes;
    graphTypes: Array<GraphTypeData>;
    eventTypes: Array<EventTypeData>;
    units: Array<UnitData>;
    assetViews: Array<AssetViewData>;
    groups: Array<GroupData>;
    tagTypes: Array<TagTypeData>;
    fetcher: DataFetcher;
    marathon: Marathon;
    sample: Dictionary<unknown>;
    query: Dictionary<unknown>;
    containerRef: HTMLDivElement;
    setParam: (name: string) => (value: string) => void;
  }
}
LOGGING && console.log('main.jsx loaded...');

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      audience={AUTH0_AUDIENCE}
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/connect/auth0/callback`}
      onRedirectCallback={(appState) => {
        window.history.replaceState(null, null, appState?.returnTo ?? '/');
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
