import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import cookie from 'cookie';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import initApollo from './initApollo';
import { isBrowser } from './config';

const getComponentDisplayName = (Component: any) => {
	return Component.displayName || Component.name || 'Unknown';
};

// function parseCookies(req?: any, options = {}) {
// 	return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
// }

export default (ComposedComponent: any) => {
	return class WithData extends React.Component<{ serverState: any }> {
		static displayName = `WithData(${getComponentDisplayName(ComposedComponent)})`;

		static async getInitialProps(ctx: any) {
			let serverState = {
				apollo: {
					data: {},
				},
			};

			// **
			// let Component, router, pathname: string, req: Request, res: Response, asPath, query;
			// let {
			// 	Component,
			// 	router,
			// 	pathname,
			// 	ctx: { req, res },
			// 	asPath,
			// 	query,
			// } = ctx;
			// ctx.ctx.apolloClient = apollo;

			// Evaluate the composed component's getInitialProps()
			let composedInitialProps = {};
			if (ComposedComponent.getInitialProps) {
				composedInitialProps = await ComposedComponent.getInitialProps(ctx);
			}

			// **
			// if (res && res.finished) {
			// 	// When redirecting, the response is finished.
			// 	// No point in continuing to render
			// 	return {};
			// }

			if (!isBrowser) {
				const apollo = initApollo();

				// **
				// const apollo = initApollo(null, {
				// 	getToken: () => parseCookies(req).qid,
				// });

				// Run all graphql queries in the component tree
				// and extract the resulting data
				try {
					// Run all GraphQL queries
					await getDataFromTree(
						<ApolloProvider client={apollo}>
							<ComposedComponent {...composedInitialProps} />
						</ApolloProvider>,
						{
							router: {
								asPath: ctx.asPath,
								pathname: ctx.pathname,
								query: ctx.query,
							},
						},
					);
				} catch (error) {
					// Prevent Apollo Client GraphQL errors from crashing SSR.
					// Handle them in components via the data.error prop:
					// https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
					console.error(error);
				}

				// getDataFromTree does not call componentWillUnmount
				// head side effect therefore need to be cleared manually
				Head.rewind();

				serverState = {
					apollo: {
						data: apollo.cache.extract(),
					},
				};
			}

			return {
				serverState,
				...composedInitialProps,
			};
		}

		apollo: ApolloClient<NormalizedCacheObject>;

		constructor(props: any) {
			super(props);
			// `getData	mTree` renders the component first, the client is passed off as a property.
			// After that rendering is done using Next's normal rendering pipeline
			// this.apollo = initApollo(this.props.serverState.apollo.data,{
			// 	getToken: () => {
			// 		return parseCookies().token;
			// 	},
			// });
			this.apollo = initApollo(this.props.serverState.apollo.data);
		}

		render() {
			return (
				<ApolloProvider client={this.apollo}>
					<ComposedComponent {...this.props} />
				</ApolloProvider>
			);
		}
	};
};
