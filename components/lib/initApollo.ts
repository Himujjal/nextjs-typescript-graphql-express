import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloLink } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { isBrowser, endpoint } from './config';
import { IOptions } from './types';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

if (!isBrowser) {
	(global as any).fetch = fetch;
}

const create = (initialState: any, { getToken }: IOptions) => {
	const httpLink = createHttpLink({
		uri: endpoint,
		credentials: 'same-origin',
	});

	const authLink: ApolloLink = setContext((_, { headers }) => {
		const token = getToken();

		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			},
		};
	});

	return new ApolloClient({
		connectToDevTools: isBrowser,
		ssrMode: !isBrowser,
		link: authLink.concat(httpLink),
		cache: new InMemoryCache().restore(initialState || {}),
	});
};

const initApollo = (initialState: any, options: IOptions) => {
	// create a new client for every browser-request
	if (!isBrowser) {
		return create(initialState, options);
	}

	// reuse client on the client-side
	if (!apolloClient) {
		apolloClient = create(initialState, options);
	}

	return apolloClient;
};

export default initApollo;
