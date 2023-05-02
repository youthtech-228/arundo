import useStoreOriginal, { StoreResult, UseStoreOptions } from 'use-store';
import { useAuth } from './useAuth';

export function useStore<T>(
  path: string,
  initialValue: T,
  options?: UseStoreOptions
): StoreResult<T>;
export function useStore<T>(
  path: string,
  options?: UseStoreOptions
): StoreResult<T>;
export function useStore<T>(path: string, ...args): StoreResult<T> {
  const { user } = useAuth();
  return useStoreOriginal(`(${user?.employeeId ?? 'no-user'})${path}`, ...args);
}
