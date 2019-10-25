import * as React from 'react';
import cookie from 'cookie';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';
import initApollo from './initApollo';
import { IRequestWithCookie } from './types';
import { isBrowser } from './config';
import { NormalizedCacheObject, ApolloClient } from 'apollo-boost';
import { Request } from 'express';

const parseCookies = (req?: Request, options: cookie.CookieParseOptions = {}) => {
	return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
};

const withApollo = (App: any) => {
	return class WithData extends React.Component {
		static displayName = `WithData(${App.displayName})`;
		apolloClient: ApolloClient<NormalizedCacheObject>;

		static async getInitialProps(ctx: any) {
			const {
				Component,
				router,
				ctx: { req, res },
			} = ctx;

			const apollo = initApollo(
				{},
				{
					getToken: () => parseCookies(req).token,
				},
			);

			ctx.ctx.apolloClient = apollo;

			let appProps = {};

			if (App.getInitialProps) {
				appProps = await App.getInitialProps(ctx);
			}

			if (req && res.finished) {
				// When redirecting the response is finished
				// No Point in continuing to render
				return {};
			}

			if (!isBrowser) {
				// Run all graphql queries in the component tree and extract the resulting data
				try {
					// Run all GraphQL queries
					await getDataFromTree(
						<App {...appProps} Component={Component} router={router} apolloClient={apollo} />,
					);
				} catch (error) {
					// Prevent Apollo Client GraphQL errors from crashing SSR.
					// Handle them in components via the data.error prop:
					// https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
					console.error('Error while running `getDataFromTree`', error);
				}

				// getDataFromTree does not call componentWillUnmount
				// head side effect therefore need to be cleared manually
				Head.rewind();
			}

			// Extract query data from the Apollo's store
			const apolloState = apollo.cache.extract();

			return { ...appProps, apolloState };
		}

		constructor(props: any) {
			super(props);
			this.apolloClient = initApollo(props.apolloState, { getToken: () => parseCookies().token });
		}

		render() {
			return <App {...this.props} apolloClient={this.apolloClient} />;
		}
	};
};

export default withApollo;
