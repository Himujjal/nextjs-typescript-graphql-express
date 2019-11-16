export const isBrowser: boolean = (process as any).browser;
export const endpoint =
	process.env.NODE_ENV === 'production' ? 'http://localhost:3100/api' : 'http://localhost:3100/api';
export const dev = process.env.PORT !== 'production';
