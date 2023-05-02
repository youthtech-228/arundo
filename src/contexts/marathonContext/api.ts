import {
  ASSETS_API_URL as ASSETS_API_BASE,
  EVENTS_API_URL as EVENTS_API_URL,
  CLIENT_MARATHON_API as MARATHON_API,
  IDENTITY_API_URL,
  GRAPH_API_URL
} from '~/constants';
import { Marathon } from '~/classes/Marathon';

const ASSET_TYPES_API_URL = `${ASSETS_API_BASE}/types/admin`;
const ASSETS_API_URL = `${ASSETS_API_BASE}/assets`;
const USERS_API_URL = `${IDENTITY_API_URL}/api/v3/users`;
const GROUP_API_URL = `${IDENTITY_API_URL}/api/v1/usergroups`;
const INVESTIGATIONS_API_URL = `${EVENTS_API_URL}/Investigations/types`;
const EVENT_TYPES_API_URL = `${EVENTS_API_URL}/types`;
const GRAPH_TYPE_API_URL = `${GRAPH_API_URL}/GraphTypes`;
const GRAPH_IMAGE_API_URL = `${GRAPH_API_URL}/GraphImages`;

export class MarathonApi {
  private marathon: Marathon;
  public constructor(marathon: Marathon) {
    this.marathon = marathon;
  }

  public getAssetTypeApi = (id: string) => ({
    create: async (assetType, url) => {
      await this.marathon.fetcher.post(
        `${ASSET_TYPES_API_URL}`,
        JSON.stringify(assetType)
      );
      window.location = url;
    },

    update: async (id, assetType, url) => {
      await this.marathon.fetcher.patch(
        `${ASSET_TYPES_API_URL}/${id}`,
        JSON.stringify(assetType)
      );
      window.location = url;
    },
    delete: async (id: string) => {
      await this.marathon.fetcher.delete(`${ASSET_TYPES_API_URL}/${id}`);
    },
  });

  public getUserApi = () => ({
    create: async (user) => {
      return await this.marathon.fetcher.post(
        `${USERS_API_URL}`,
        JSON.stringify(user)
      );
    },

    update: async (id, user) => {
      await this.marathon.fetcher.patch(
        `${USERS_API_URL}/${id}`,
        JSON.stringify(user)
      );
    },

    delete: async (id: string) => {
      await this.marathon.fetcher.delete(`${USERS_API_URL}/${id}`);
    },
  });
  public getGroupApi = () => ({
    create: async (group, url) => {
      await this.marathon.fetcher.post(
        `${GROUP_API_URL}`,
        JSON.stringify(group)
      );
      window.location = url;
    },

    update: async (id, group) => {
      await this.marathon.fetcher.patch(
        `${GROUP_API_URL}/${id}`,
        JSON.stringify(group)
      );
    },

    delete: async (id: string) => {
      await this.marathon.fetcher.delete(`${GROUP_API_URL}/${id}`);
    },
  });
  public getAssetApi = (id: string) => ({
    create: async (asset, url) => {
      await this.marathon.fetcher.post(
        `${ASSETS_API_URL}`,
        JSON.stringify(asset)
      );
      window.location = url;
    },

    update: async (id, asset) => {
      await this.marathon.fetcher.patch(
        `${ASSETS_API_URL}/${id}`,
        JSON.stringify(asset)
      );
    },
    delete: async (id: string) => {
      await this.marathon.fetcher.delete(`${ASSETS_API_URL}/${id}`);
    },
  });
  public getImageApi = () => ({
    upload: async (imageFile, name) => {
      return await this.marathon.fetcher.post(
        `${EVENTS_API_URL}/images?name=${name}`,
        imageFile
      );
    },
  });
  public getInvestigationApi = () => ({
    update: async (id, type) => {
      return await this.marathon.fetcher.put(
        `${INVESTIGATIONS_API_URL}/${id}`,
        JSON.stringify(type)
      );
    },
  });
  public getEventTypeApi = () => ({
    get: async (id) => {
      return await this.marathon.fetcher.get(`${EVENT_TYPES_API_URL}/${id}`);
    },
    create: async (eventType) => {
      await this.marathon.fetcher.post(
        `${EVENT_TYPES_API_URL}`,
        JSON.stringify(eventType)
      );
    },
    update: async (id, eventType) => {
      return await this.marathon.fetcher.patch(
        `${EVENT_TYPES_API_URL}/${id}`,
        JSON.stringify(eventType)
      );
    },
  });
  public getGraphTypeApi = () => ({
    get: async (id) => {
      return await this.marathon.fetcher.get(`${GRAPH_TYPE_API_URL}/${id}`);
    },
    create: async (graphType) => {
      await this.marathon.fetcher.post(
        `${GRAPH_TYPE_API_URL}`,
        JSON.stringify(graphType)
      );
    },
    update: async (id, graphType) => {
      return await this.marathon.fetcher.patch(
        `${GRAPH_TYPE_API_URL}/${id}`,
        JSON.stringify(graphType)
      );
    },
  });
  public getGraphImageApi = () => ({
    get: async (id) => {
      return await this.marathon.fetcher.get(`${GRAPH_IMAGE_API_URL}/${id}`);
    },
    list: async () => {
      return await this.marathon.fetcher.get(`${GRAPH_IMAGE_API_URL}`);
    },
    upload: async (graphImage) => {
      return await this.marathon.fetcher.post(
        `${GRAPH_IMAGE_API_URL}`,
        graphImage
      );
    },
    update: async (id, graphType) => {
      return await this.marathon.fetcher.patch(
        `${GRAPH_IMAGE_API_URL}/${id}`,
        JSON.stringify(graphType)
      );
    },
  });
}
