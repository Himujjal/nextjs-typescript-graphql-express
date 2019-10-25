export const isBrowser: boolean = (process as any).browser;
export const endpoint =
  process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000';
