declare module 'use-store' {
  export type StoreResult<T> = [T, (val: T) => void];

  export interface UseStoreOptions {
    persist?: boolean;
    broadcast?: boolean;
  }
  export default function useStore<T>(
    path: string,
    initialValue: T,
    options?: UseStoreOptions
  ): StoreResult<T>;
  export default function useStore<T>(
    path: string,
    options?: UseStoreOptions
  ): StoreResult<T>;
}
