import { ApolloClient, InMemoryCache, NormalizedCacheObject } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { isBrowser, endpoint } from './config';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
	(global as any).fetch = fetch;
}

interface IOptions {
	getToken: () => string;
}

function create(initialState?: any, options?: IOptions) {
	const httpLink = createHttpLink({
		uri: endpoint,
		credentials: 'include',
	});

	// **
	// const authLink = setContext((_, { headers }) => {
	// 	const token = options.getToken();
	// 	return {
	// 		headers: {
	// 			...headers,
	// 			cookie: token ? `qid=${token}` : '',
	// 		},
	// 	};
	// });

	// Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
	return new ApolloClient({
		connectToDevTools: isBrowser,
		ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
		// link: authLink.concat(httpLink),
		link: httpLink,
		cache: new InMemoryCache().restore(initialState || {}),
	});
}

export default function initApollo(initialState?: any, options?: IOptions) {
	// Make sure to create a new client for every server-side request so that data
	// isn't shared between connections (which would be bad)
	if (!isBrowser) {
		return create(initialState, options);
	}

	// Reuse client on the client-side
	if (!apolloClient) {
		apolloClient = create(initialState, options);
	}

	return apolloClient;
}
