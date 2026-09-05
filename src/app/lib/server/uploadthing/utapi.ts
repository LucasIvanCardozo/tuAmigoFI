import { UTApi } from 'uploadthing/server';

type UTApiType = InstanceType<typeof UTApi>;

let _utapi: UTApiType | undefined;

export const utapi = new Proxy({} as UTApiType, {
  get(_target, prop: string | symbol) {
    if (!_utapi) {
      _utapi = new UTApi();
    }
    const value = (_utapi as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(_utapi);
    }
    return value;
  },
});
