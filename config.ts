export default {
	dev: process.env.NODE_ENV !== 'production',
	browser: (process as any).browser,
	port: process.env.PORT || 3100,
	endpoint:
		process.env.NODE_ENV !== 'production' ? 'http://localhost:' + process.env.PORT || 3100 : '',
};
