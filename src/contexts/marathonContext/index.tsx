import React, { useContext, useEffect, useRef, useState } from 'react';
import { AssetType, AssetTypeData } from '~/classes/AssetType';
import { AssetData } from '~/classes/asset';
import { EventTypeData } from '~/classes/EventType';
import { EventTypes } from '~/classes/EventTypes';
import { EventCode } from '~/classes/EventType';
import { TagTypeData } from '~/classes/TagType';
import { DataSourceData } from '~/classes/DataSource';
import { UnitData } from '~/classes/Unit';
import { AssetViewData } from '~/classes/AssetView';
import { GroupData } from '~/classes/Group';
import { DataFetcher } from '~/classes/DataFetcher';
import { Marathon } from '~/classes/Marathon';
import { descBy } from '~/utils';
import { Assets } from '~/classes/assets';
import { User } from '~/classes/User';
import { AssetTypes } from '~/classes/assetTypes';
import { InvestigationTypeData } from '~/types/investigations';
import { GraphTypeData } from '~/classes/graphType';
import { GraphTypes } from '~/classes/graphTypes';

import {
  ASSETS_API_URL as ASSETS_API_BASE,
  EVENTS_API_URL as EVENTS_API_URL,
  CLIENT_MARATHON_API as MARATHON_API,
  IDENTITY_API_URL,
  GRAPH_API_URL
} from '~/constants';
import { error } from '~/services/messages';
import { useAuth } from '~/hooks/useAuth';
import { MarathonApi } from './api';
import { NavigateFunction, useNavigate } from 'react-router';

const ASSETS_API_URL = `${ASSETS_API_BASE}/assets?returnUnVerified=true`;
const ASSET_TYPES_API_URL = `${ASSETS_API_BASE}/types?hasTagType=true`;
const DATASOURCES_API_URL = `${ASSETS_API_BASE}/datasources`;
const EVENT_TYPES_API_URL = `${EVENTS_API_URL}/types`;
const UNITS_API_URL = `${MARATHON_API}/api/tags/units`;
const ASSET_VIEW_API_URL = `${MARATHON_API}/api/v1/assets/views`;
const USERS_API_URL = `${IDENTITY_API_URL}/api/v3/users`;
const GROUP_API_URL = `${IDENTITY_API_URL}/api/v1/usergroups`;
const TAG_TYPE_API_URL = `${MARATHON_API}/api/tags/types`;
const INVESTIGATIONS_API_URL = `${EVENTS_API_URL}/Investigations/types`;
const EVENT_CODES_API_URL = `${EVENTS_API_URL}/codes`;
const EVENT_TYPE_ROLESLIST = `${EVENTS_API_URL}/types/roleList`;
const GRAPH_TYPE_API_URL = `${GRAPH_API_URL}/GraphTypes`;

const pollingTimer = undefined;

// helper function to simplify fetching code
function loadFromFetcher<T = unknown>(
  fetcher: DataFetcher,
  what: string,
  where: string,
  doAfter: (what: string) => (data: T) => T
): Promise<T> {
  return fetcher
    .get<T>(new URL(where).toString())
    .then(doAfter(what))
    .catch((err) => {
      error(`API ERROR: could not load ${what}`, { autoClose: 30000 });
      console.warn(`API LOAD ERROR: could not load ${what} from ${where}`, err);
      return [] as unknown as T;
    });
}

function assetTypeExpand(assetType) {
  assetType.createdDate = assetType.createdDate
    ? new Date(assetType.createdDate)
    : new Date('1970-01-01T00:00-0500');
  assetType.assetViewId = assetType.assetView ? assetType.assetView.id : '';
  assetType.dataSourceId = assetType.dataSource ? assetType.dataSource.id : '';
  assetType.eventTypeId = assetType.eventType ? assetType.eventType.id : '';
  assetType.notificationGroupId = assetType.notificationGroup
    ? assetType.notificationGroup.id
    : '';
  assetType.unitId = assetType.unit ? assetType.unit.id : '';
  assetType.assetViewName = assetType.assetView ? assetType.assetView.name : '';
  assetType.dataSourceName = assetType.dataSource
    ? assetType.dataSource.name
    : '';
  assetType.eventTypeName = assetType.eventType ? assetType.eventType.name : '';
  assetType.notificationGroupName = assetType.notificationGroup
    ? assetType.notificationGroup.name
    : '';
  assetType.unitName = assetType.unit ? assetType.unit.name : '';
  assetType.hasParent = !!assetType.parentId;
  assetType.key = assetType.id;
  assetType.value = assetType.id;
  assetType.label = assetType.name;
  
  return assetType;
}

interface Props {
  assets: Assets;
  eventTypes: EventTypes;
  assetTypes: AssetTypes;
  dataSources: Array<DataSourceData>;
  investigationTypes: Array<InvestigationTypeData>;
  graphTypes: GraphTypes;
  units: Array<UnitData>;
  assetViews: Array<AssetViewData>;
  groups: Array<GroupData>;
  users: User[];
  tagTypes: Array<TagTypeData>;
  currentAssetType: AssetType;
  setCurrentAssetType: (current: AssetType) => void;
  marathon: Marathon;
  api: MarathonApi;
  refresh: () => void;
  navigate: NavigateFunction;
  hasChanged: number;
  loading: LoadingState;
  searchItems: Array<AssetType>;
}

export const MarathonContext = React.createContext<Props>({} as Props);

interface LoadingState {
  units: boolean;
  assets: boolean;
  events: boolean;
  eventTypes: boolean;
  assetTypes: boolean;
  anything: boolean;
  users: boolean;
}

export const MarathonProvider = ({ children }) => {
  const {
    user: AuthUser,
    isAuthenticated: isLoggedIn,
    getAccessTokenSilently,
    isLoading,
  } = useAuth();
  const navigate = useNavigate();

  const marathonRef = useRef<Marathon>(
    new Marathon({
      getToken: getAccessTokenSilently,
    })
  );
  const { assetTypes, assets } = marathonRef.current;
  const [hasChanged, setHasChanged] = useState(+new Date());
  const [currentAssetType, setCurrentAssetType] = useState<AssetType>();
  const [searchItems, setSearchItems] = useState<Array<AssetType>>([]);
  const [loading, setLoading] = useState<LoadingState>({
    units: true,
    assets: true,
    events: true,
    assetTypes: true,
    anything: true,
    users: true,
  });

  const doneLoading =
    (what: string) =>
    <T,>(data: T[]) => {
      if (loading[what]) {
        setLoading((state) => ({ ...state, [what]: false }));
      }

      if (!window.sample) {
        window.sample = {};
      }
      if (!window.sample[what]) {
        window.sample[what] = data[0];
      }
      return data;
    };

  const refresh = () => setHasChanged(+new Date());

  useEffect(() => {
    const loadFromApi = async () => {
      // register refresh event with assets
      const [
        assetsData,
        assetTypesData,
        dataSources,
        eventTypesData,
        eventCodeData,
        units,
        assetViews,
        groups,
        usersData,
        tagTypes,
        investigationTypesData,
        eventTypeRolesListData,
        graphTypesData
      ] = await Promise.all([
        loadFromFetcher<AssetData[]>(
          marathonRef.current.fetcher,
          'assets',
          ASSETS_API_URL,
          doneLoading
        ),
        loadFromFetcher<AssetTypeData[]>(
          marathonRef.current.fetcher,
          'assetTypes',
          ASSET_TYPES_API_URL,
          doneLoading
        ),
        loadFromFetcher<DataSourceData[]>(
          marathonRef.current.fetcher,
          'dataSources',
          DATASOURCES_API_URL,
          doneLoading
        ),
        loadFromFetcher<EventTypeData[]>(
          marathonRef.current.fetcher,
          'eventTypes',
          EVENT_TYPES_API_URL,
          doneLoading
        ),
        loadFromFetcher<EventCode[]>(
          marathonRef.current.fetcher,
          'eventCodes',
          EVENT_CODES_API_URL,
          doneLoading
        ),
        loadFromFetcher<UnitData[]>(
          marathonRef.current.fetcher,
          'units',
          UNITS_API_URL,
          doneLoading
        ),
        loadFromFetcher<AssetViewData[]>(
          marathonRef.current.fetcher,
          'assetViews',
          ASSET_VIEW_API_URL,
          doneLoading
        ),
        loadFromFetcher<GroupData[]>(
          marathonRef.current.fetcher,
          'groups',
          GROUP_API_URL,
          doneLoading
        ),
        loadFromFetcher<User[]>(
          marathonRef.current.fetcher,
          'users',
          USERS_API_URL,
          doneLoading
        ),
        loadFromFetcher<TagTypeData[]>(
          marathonRef.current.fetcher,
          'tagTypes',
          TAG_TYPE_API_URL,
          doneLoading
        ),
        loadFromFetcher<InvestigationTypeData[]>(
          marathonRef.current.fetcher,
          'investigationTypes',
          INVESTIGATIONS_API_URL,
          doneLoading
        ),
        loadFromFetcher<string[]>(
          marathonRef.current.fetcher,
          'eventTypeRolesList',
          EVENT_TYPE_ROLESLIST,
          doneLoading
        ),
        loadFromFetcher<GraphTypeData[]>(
          marathonRef.current.fetcher,
          'graphTypes',
          GRAPH_TYPE_API_URL,
          doneLoading
        ),
      ]);
      let assetTypesTree = [];
      if (assetTypesData) {
        assetTypesTree = assetTypesData.map(assetTypeExpand);
      }

      assetTypesData &&
        marathonRef.current.assetTypes.add(
          ...assetTypesTree.sort(descBy('name'))
        );

      assetTypesData && marathonRef.current.assets.addTypes(assetTypesData);
      usersData && marathonRef.current.users.add(...usersData);
      groups && marathonRef.current.groups.add(...groups);
      assetsData &&
        marathonRef.current.assets.add(...assetsData.sort(descBy('name')));
      investigationTypesData &&
        marathonRef.current.investigationTypes.add(
          ...(investigationTypesData?.sort(descBy('name')) || [])
        );
      eventTypesData &&
        marathonRef.current.eventTypes.add(
          ...(eventTypesData?.sort(descBy('name')) || [])
        );
      graphTypesData &&
        marathonRef.current.graphTypes.add(
          ...(graphTypesData?.sort(descBy('name')) || [])
        );
      marathonRef.current.eventCodes = eventCodeData;
      marathonRef.current.eventRolesList = eventTypeRolesListData;
      setSearchItems(marathonRef.current.assetTypes);
      window.assets = marathonRef.current.assets;
      window.assetTypes = marathonRef.current.assetTypes;
      window.investigationTypes = marathonRef.current.investigationTypes;
      window.graphTypes = marathonRef.current.graphTypes;
      window.dataSources = dataSources;
      window.eventTypes = marathonRef.current.eventTypes;
      window.units = units;
      window.assetViews = assetViews;
      window.tagTypes = tagTypes;

      marathonRef.current.refreshUI = refresh;
      marathonRef.current.activeUser = AuthUser;

      // done bootstrap
      console.log('done with data bootstrap, refreshing app state...');
      setHasChanged(+new Date());
      setLoading((state) => ({ ...state, anything: false }));
    };

    isLoggedIn && !isLoading && AuthUser && loadFromApi();

    window.marathon = marathonRef.current;
    return () => {
      console.log('clearing event polling timer.');
      clearInterval(pollingTimer);
    };
  }, [isLoggedIn, isLoading, AuthUser?.userId]);
  const dataSources = window.dataSources;
  const units = window.units;
  const assetViews = window.assetViews;
  const tagTypes = window.tagTypes;
  const { users, groups, investigationTypes, eventTypes, graphTypes } = marathonRef.current;

  return (
    <MarathonContext.Provider
      value={{
        assets,
        assetTypes,
        dataSources,
        eventTypes,
        units,
        assetViews,
        groups,
        investigationTypes,
        graphTypes,
        users,
        tagTypes,
        marathon: marathonRef.current,
        api: new MarathonApi(marathonRef.current),
        hasChanged,
        loading,
        navigate,
        refresh,
        searchItems,
        currentAssetType,
        setCurrentAssetType,
      }}
    >
      {children}
    </MarathonContext.Provider>
  );
};

export const useMarathon = () => useContext(MarathonContext);

export const useSyncAssetTypeTarget = (idOrSlug) => {
  const { assetTypes, currentAssetType, setCurrentAssetType } = useMarathon();

  useEffect(() => {
    const newAssetType = assetTypes.by.id[idOrSlug];

    if (newAssetType !== currentAssetType) {
      setCurrentAssetType(newAssetType);
    }
  }, [idOrSlug]);
};
